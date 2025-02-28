const os = require('os');
const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');
const tmp = require('tmp-promise');

// Simple locking mechanism to prevent multiple Inkscape processes from conflicting
const activeTasks = new Map();

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
      console.log(`Found Inkscape in PATH at: ${inkscapePath}`);
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

  console.error("\n===== INKSCAPE NOT FOUND =====");
  console.error("Inkscape is required for this application to work properly.");
  console.error("Please install Inkscape from https://inkscape.org/");
  
  if (platform === 'darwin') {
    console.error("\nOn macOS, you can install Inkscape using:");
    console.error("  - Download from https://inkscape.org/release/");
    console.error("  - Or use Homebrew: brew install --cask inkscape");
  } else if (platform === 'win32') {
    console.error("\nOn Windows, you can install Inkscape using:");
    console.error("  - Download from https://inkscape.org/release/");
    console.error("  - Or use Chocolatey: choco install inkscape");
  } else {
    console.error("\nOn Linux, you can install Inkscape using your package manager:");
    console.error("  - Ubuntu/Debian: sudo apt install inkscape");
    console.error("  - Fedora: sudo dnf install inkscape");
    console.error("  - Arch: sudo pacman -S inkscape");
  }
  
  console.error("\nAfter installation, make sure Inkscape is in your PATH or in one of the common locations.");
  console.error("===============================\n");
  
  return null;
}

async function runCommands(commands) {
  const command = commands.join(' ');
  // console.log(`Executing command: ${command}`);

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
    env.INKSCAPE_PREFERENCES_PATH = tempDir;
    env.INKSCAPE_PROFILE_DIR = tempDir;
    env.GTK_DEBUG = 'no-gtk-init';
    env.GDK_BACKEND = 'none';
    env.QT_QPA_PLATFORM = 'minimal';
    env.GTK_PATH = '';
    env.GTK2_RC_FILES = '';
    env.GTK_EXE_PREFIX = '';
    env.GTK_IM_MODULE = 'none';
    env.GTK_RECENT_FILES_DISABLED = '1';
    env.GSETTINGS_BACKEND = 'memory';
    env.HOME = tempDir;
    env.XDG_CONFIG_HOME = tempDir;
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

async function exportSvgToImage(artFileOutputFilepath, imageSizePixels, name, outputDirectory) {
  // Create a unique key for this task
  const taskKey = `${outputDirectory}_${name}`;
  
  // Check if there's already a task running for this file
  if (activeTasks.has(taskKey)) {
    try {
      // Wait for the existing task to complete
      await activeTasks.get(taskKey);
      return;
    } catch (error) {
      console.error(`Previous Inkscape process for ${name} failed: ${error.message}`);
      // Continue with our own attempt
    }
  }
  
  // Create a promise that will be resolved or rejected when this task completes
  let resolveTask, rejectTask;
  const taskPromise = new Promise((resolve, reject) => {
    resolveTask = resolve;
    rejectTask = reject;
  });
  
  // Register this task
  activeTasks.set(taskKey, taskPromise);
  
  try {
    const absoluteSvgFilepath = path.normalize(path.resolve(artFileOutputFilepath));
    const absoluteOutputDirectory = path.normalize(path.resolve(outputDirectory));
    const pngTempFilepath = path.normalize(path.join(absoluteOutputDirectory, `${name}_temp.png`));
    const pngFinalFilepath = path.normalize(path.join(absoluteOutputDirectory, `${name}.png`));

    // Ensure output directory exists
    try {
      await fs.mkdir(absoluteOutputDirectory, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw new Error(`Failed to create output directory: ${error.message}`);
      }
    }

    const inkscapePath = await findInkscape();
    if (!inkscapePath) {
      throw new Error("Inkscape is required but not found. Please install Inkscape and ensure it's accessible.");
    }

    // Check if the SVG file exists
    try {
      await fs.access(absoluteSvgFilepath);
    } catch (error) {
      throw new Error(`SVG file does not exist: ${absoluteSvgFilepath}`);
    }
    
    // Check if the output PNG already exists - if so, we can skip this process
    try {
      await fs.access(pngFinalFilepath);
      console.log(`PNG file already exists for ${name}, skipping export.`);
      resolveTask();
      return;
    } catch (error) {
      // File doesn't exist, continue with export
    }

    // Try to remove any existing temp file before starting
    try {
      await fs.unlink(pngTempFilepath);
    } catch (error) {
      // Ignore errors if the file doesn't exist
    }

    const createPngCommands = [
      `"${inkscapePath}"`,
      `"${absoluteSvgFilepath}"`,
      `--export-filename="${pngTempFilepath}"`,
      '--export-dpi=300',
      '--export-background-opacity=0',
    ];

    const returnCode = await runCommands(createPngCommands);

    if (returnCode !== 0) {
      throw new Error(`Inkscape failed to export ${path.basename(absoluteSvgFilepath)} to PNG. Return code: ${returnCode}`);
    }

    // Check if the temp PNG file was created
    try {
      await fs.access(pngTempFilepath);
      
      // Check if the file has content (not empty)
      const stats = await fs.stat(pngTempFilepath);
      if (stats.size === 0) {
        throw new Error(`Exported PNG file is empty: ${pngTempFilepath}`);
      }
      
      await fs.rename(pngTempFilepath, pngFinalFilepath);
      resolveTask();
    } catch (error) {
      throw new Error(`Failed to access or rename temp PNG file (${pngTempFilepath}): ${error.message}`);
    }
  } catch (error) {
    console.error(`\n===== ERROR EXPORTING SVG TO IMAGE =====`);
    console.error(error.message);
    console.error(`For file: ${path.basename(artFileOutputFilepath)}`);
    console.error(`Make sure Inkscape is properly installed and accessible.`);
    console.error(`=========================================\n`);
    
    // Reject the task promise
    rejectTask(error);
    
    // Re-throw the error to ensure calling code knows there was a problem
    throw error;
  } finally {
    // Remove the task from the active tasks map after a short delay
    // to ensure any waiting tasks have a chance to see the result
    setTimeout(() => {
      activeTasks.delete(taskKey);
    }, 100);
  }
}

module.exports = {
  findInkscape,
  runCommands,
  convertToJpg,
  exportSvgToImage,
};
