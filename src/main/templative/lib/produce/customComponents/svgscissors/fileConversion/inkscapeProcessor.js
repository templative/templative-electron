const os = require('os');
const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');
const tmp = require('tmp-promise');

async function searchWindowsRegistryForInkscape() {
  try {
    const { Registry } = require('rage-edit');
    const registry = new Registry();

    const registryPaths = [
      ['SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall', Registry.HKLM],
      ['SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall', Registry.HKLM],
      ['SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall', Registry.HKCU],
    ];

    for (const [regPath, hkey] of registryPaths) {
      try {
        const registryKey = registry.openKey(hkey, regPath);
        const subkeyCount = registryKey.keys.length;

        for (let i = 0; i < subkeyCount; i++) {
          const subkeyName = registryKey.keys[i];
          const subkey = registry.openKey(hkey, `${regPath}\\${subkeyName}`);

          try {
            const displayName = subkey.values.DisplayName.value;
            if (displayName.includes('Inkscape')) {
              const installLocation = subkey.values.InstallLocation.value;
              const inkscapePath = path.normalize(path.join(installLocation, 'bin', 'inkscape.exe'));
              if (await fs.stat(inkscapePath)) {
                return inkscapePath;
              }
            }
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.error(`Registry search error: ${error}`);
  }

  return null;
}

async function findInkscape() {
  const commonPaths = {
    win32: [
      'C:/Program Files/Inkscape/bin/inkscape.exe',
      'C:/Program Files (x86)/Inkscape/bin/inkscape.exe',
    ],
    darwin: [
      '/Applications/Inkscape.app/Contents/MacOS/inkscape',
      '/opt/homebrew/bin/inkscape',
      '/usr/local/bin/inkscape',
    ],
  };

  // First try the PATH - use the native Promise support in which
  try {
    const which = require('which');
    const inkscapePath = await which('inkscape');
    if (inkscapePath) {
      // console.log(`Found Inkscape in PATH at: ${inkscapePath}`);
      return inkscapePath;
    }
  } catch (error) {
    // which command failed, continue to check common paths
    // console.log("Inkscape not found in PATH, checking common installation locations...");
  }

  // Then try common paths for the current platform
  let platform = process.platform;
  if (platform.startsWith('linux')) {
    platform = 'linux';
  }

  if (commonPaths[platform]) {
    for (const possiblePath of commonPaths[platform]) {
      try {
        await fs.access(possiblePath);
        // console.log(`Found Inkscape at: ${possiblePath}`);
        return possiblePath;
      } catch (error) {
        continue;
      }
    }
  }

  // Finally try Windows registry
  if (platform === 'win32') {
    const inkscapePath = await searchWindowsRegistryForInkscape();
    if (inkscapePath) {
      return inkscapePath;
    }
  }
  
  return null;
}

async function runCommands(commands) {
  const command = commands.join(' ');

  const { path: tempDir, cleanup } = await tmp.dir({ unsafeCleanup: true });

  const env = {
    ...process.env,
    XDG_DATA_HOME: tempDir,
    DBUS_SESSION_BUS_ADDRESS: '/dev/null',
    GTK_DEBUG: 'fatal-warnings',
  };

  if (process.platform === 'darwin') {
    // More aggressive GUI suppression for macOS
    env.LSUIElement = '1';
    env.DISPLAY = '';
    env.NSDocumentRevisionsDebugMode = '1';
    // env.INKSCAPE_PREFERENCES_PATH = tempDir; // LIKELY FONT ISSUE
    // env.INKSCAPE_PROFILE_DIR = tempDir; // LIKELY FONT ISSUE
    env.GTK_DEBUG = 'no-gtk-init';
    env.GDK_BACKEND = 'none';
    env.QT_QPA_PLATFORM = 'minimal';
    env.GTK_PATH = '';
    env.GTK2_RC_FILES = '';
    env.GTK_EXE_PREFIX = '';
    env.GTK_IM_MODULE = 'none';
    env.GTK_RECENT_FILES_DISABLED = '1';
    env.GSETTINGS_BACKEND = 'memory';
    // env.HOME = tempDir; // MOST LIKELY FONT ISSUE - prevents access to user fonts
    // env.XDG_CONFIG_HOME = tempDir; // LIKELY FONT ISSUE - font config
    env.XDG_CACHE_HOME = tempDir;
    env.XDG_RUNTIME_DIR = tempDir;
    
    // Suppress GTK warnings on macOS by redirecting stderr
    if (!command.includes('2>/dev/null')) {
      commands.push('2>/dev/null');
    }
  }

  try {
    // Use the updated command with stderr redirection if needed
    const finalCommand = commands.join(' ');
    
    const child = spawn(finalCommand, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'], // Capture both stdout and stderr
      env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const exitCode = await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        resolve(code);
      });
      
      child.on('error', (err) => {
        reject(new Error(`Failed to execute command: ${err.message}`));
      });
    });

    await cleanup();

    if (stdout.trim()) {
      // console.log(`Command output:\n${stdout}`);
    }

    if (stderr.trim()) {
      // Filter out common GTK/Pango warnings
      const filteredStderr = stderr
        .split('\n')
        .filter(line => !line.includes('Failed to wrap object of type') && 
                        !line.includes('commonly caused by failing to call a library init() function'))
        .join('\n');
        
      if (filteredStderr.trim()) {
        console.warn(`Command errors for ${finalCommand}:\n${filteredStderr}`);
      }
    }

    if (exitCode !== 0) {
      console.error(`Command failed with exit code ${exitCode}`);
    } else {
      // console.log(`Command completed successfully with exit code ${exitCode}`);
    }

    return exitCode;
  } catch (error) {
    await cleanup();
    console.error(`Error executing command: ${error.message}`);
    throw error;
  }
}

async function convertToJpg(absoluteOutputDirectory, name, pngFilepath) {
  const jpgFilepath = path.join(absoluteOutputDirectory, `${name}.jpg`);
  const convertCommands = [
    'magick convert',
    `"${pngFilepath}"`,
    `"${jpgFilepath}"`,
  ];
  await runCommands(convertCommands);
}

async function exportSvgToPngUsingInkscape(svgFilepath, outputPngFilepath) {
  // Ensure output directory exists
  try {
    await fs.mkdir(path.dirname(outputPngFilepath), { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw new Error(`Failed to create output directory: ${error.message}`);
    }
  }

  const inkscapePath = await findInkscape();
  if (!inkscapePath) {
    throw new Error("You are using Inkscape for rendering. Please install Inkscape from https://inkscape.org/ or use the Templative renderer.");
  }

  // Check if the SVG file exists
  try {
    await fs.access(svgFilepath);
  } catch (error) {
    throw new Error(`SVG file does not exist: ${svgFilepath}`);
  }

  const createPngCommands = [
    `"${inkscapePath}"`,
    `"${svgFilepath}"`,
    `--export-filename="${outputPngFilepath}"`,
    '--export-dpi=300',
    '--export-background-opacity=0',
  ];

  const returnCode = await runCommands(createPngCommands);
  if (returnCode !== 0) {
    throw new Error(`Inkscape failed to export ${path.basename(svgFilepath)} to PNG. Return code: ${returnCode}`);
  }
}

async function exportSvgStringToPngUsingInkscape(svgString, imageSizePixels, outputPngFilepath) {
  // Ensure output directory exists
  try {
    await fs.mkdir(path.dirname(outputPngFilepath), { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw new Error(`Failed to create output directory: ${error.message}`);
    }
  }

  const inkscapePath = await findInkscape();
  if (!inkscapePath) {
    throw new Error("You are using Inkscape for rendering. Please install Inkscape from https://inkscape.org/ or use the Templative renderer.");
  }

  const { path: tempDir, cleanup } = await tmp.dir({ unsafeCleanup: true });

  const env = {
    ...process.env,
    XDG_DATA_HOME: tempDir,
    DBUS_SESSION_BUS_ADDRESS: '/dev/null',
    GTK_DEBUG: 'fatal-warnings',
  };

  if (process.platform === 'darwin') {
    // More aggressive GUI suppression for macOS
    env.LSUIElement = '1';
    env.DISPLAY = '';
    env.NSDocumentRevisionsDebugMode = '1';
    env.GTK_DEBUG = 'no-gtk-init';
    env.GDK_BACKEND = 'none';
    env.QT_QPA_PLATFORM = 'minimal';
    env.GTK_PATH = '';
    env.GTK2_RC_FILES = '';
    env.GTK_EXE_PREFIX = '';
    env.GTK_IM_MODULE = 'none';
    env.GTK_RECENT_FILES_DISABLED = '1';
    env.GSETTINGS_BACKEND = 'memory';
    env.XDG_CACHE_HOME = tempDir;
    env.XDG_RUNTIME_DIR = tempDir;
  }

  try {
    const child = spawn(`"${inkscapePath}"`, [
      '--pipe',
      '--export-filename=' + outputPngFilepath,
      '--export-dpi=300',
      '--export-background-opacity=0'
    ], {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
      env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Write SVG string to stdin
    child.stdin.write(svgString);
    child.stdin.end();

    const exitCode = await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        resolve(code);
      });
      
      child.on('error', (err) => {
        reject(new Error(`Failed to execute Inkscape: ${err.message}`));
      });
    });

    await cleanup();

    if (stdout.trim()) {
      // console.log(`Inkscape output:\n${stdout}`);
    }

    if (stderr.trim()) {
      // Filter out common GTK/Pango warnings
      const filteredStderr = stderr
        .split('\n')
        .filter(line => !line.includes('Failed to wrap object of type') && 
                        !line.includes('commonly caused by failing to call a library init() function'))
        .join('\n');
        
      if (filteredStderr.trim()) {
        console.warn(`Inkscape errors:\n${filteredStderr}`);
      }
    }

    if (exitCode !== 0) {
      throw new Error(`Inkscape failed to convert SVG string to PNG. Return code: ${exitCode}`);
    }

    // console.log(`Successfully converted SVG string to PNG: ${outputPngFilepath}`);
  } catch (error) {
    await cleanup();
    console.error(`Error converting SVG string to PNG: ${error.message}`);
    throw error;
  }
}

async function createInkscapeShellExportCommand(svgFilepath, outputPngFilepath) {
  const command = `file-open:${svgFilepath}; export-filename:${outputPngFilepath}; export-dpi:300; export-background-opacity:0; export-do; file-close;`;
  return command;
}

async function processInkscapeShellCommands(commands) {
  const inkscapePath = await findInkscape();
  if (!inkscapePath) {
    throw new Error("You are using Inkscape for rendering. Please install Inkscape from https://inkscape.org/ or use the Templative renderer.");
  }

  if (commands.length === 0) {
    console.log("No Inkscape commands to process");
    return 0;
  }

  // Filter out any undefined or null commands
  const validCommands = commands.filter(cmd => cmd != null && cmd !== undefined);
  
  if (validCommands.length === 0) {
    console.log("No valid Inkscape commands to process after filtering");
    return 0;
  }

  try {
    const child = spawn(`"${inkscapePath}"`, ['--shell'], {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
    });

    // Join all commands with newlines and add quit at the end
    const allCommands = validCommands.join('\n') + '\nquit\n';
    child.stdin.write(allCommands);
    child.stdin.end();

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      if (!data) {
        console.warn('Received undefined/null stdout data from Inkscape process');
        return;
      }
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      if (!data) {
        console.warn('Received undefined/null stderr data from Inkscape process');
        return;
      }
      stderr += data.toString();
    });

    const exitCode = await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        resolve(code);
      });
      
      child.on('error', (err) => {
        console.error('Inkscape process error:', err);
        reject(new Error(`Failed to execute Inkscape shell commands: ${err.message}`));
      });
    });

    // if (stdout.trim()) {
    //   console.log(`Inkscape batch output:\n${stdout}`);
    // }

    if (stderr.trim()) {
      // Filter out common GTK/Pango warnings
      const filteredStderr = stderr
        .split('\n')
        .filter(line => !line.includes('Failed to wrap object of type') && 
                        !line.includes('commonly caused by failing to call a library init() function'))
        .join('\n');
        
      if (filteredStderr.trim()) {
        console.warn(`Inkscape batch errors:\n${filteredStderr}`);
      }
    }

    if (exitCode !== 0) {
      console.error(`Inkscape batch processing failed with exit code ${exitCode}`);
    } else {
      // console.log(`Successfully processed ${commands.length} Inkscape export commands`);
    }

    return exitCode;
  } catch (error) {
    console.error('Error in processInkscapeShellCommands:', error);
    throw error;
  }
}

module.exports = {
  findInkscape,
  runCommands,
  convertToJpg,
  exportSvgToPngUsingInkscape,
  createInkscapeShellExportCommand,
  processInkscapeShellCommands
};
