import os
import sys
import shutil
import shlex
import subprocess
import asyncio
from os import path
import tempfile
import cairosvg

def searchWindowsRegistryForInkscape():
    try:
        import winreg
        registry_path = r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"
        registry_key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, registry_path)
        
        for i in range(0, winreg.QueryInfoKey(registry_key)[0]):
            subkey_name = winreg.EnumKey(registry_key, i)
            subkey_path = f"{registry_path}\\{subkey_name}"
            try:
                subkey = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, subkey_path)
                display_name, _ = winreg.QueryValueEx(subkey, "DisplayName")
                if "Inkscape" in display_name:
                    install_location, _ = winreg.QueryValueEx(subkey, "InstallLocation")
                    inkscapeExecutablePath = path.normpath(path.join(install_location, "bin", "inkscape.exe"))
                    return inkscapeExecutablePath if path.isfile(inkscapeExecutablePath) else None 
            except FileNotFoundError:
                pass
            except WindowsError:
                pass
    except WindowsError as e:
        print(e)
        pass

    return None

def findInkscape():
    common_paths = {
        "win32": [
            "C:/Program Files/Inkscape/bin/inkscape.exe",
            "C:/Program Files (x86)/Inkscape/bin/inkscape.exe"
        ],
        "darwin": [
            "/Applications/Inkscape.app/Contents/MacOS/inkscape"
        ]
    }

    inkscape_path = shutil.which("inkscape")
    if inkscape_path and path.isfile(inkscape_path):
        return inkscape_path

    if sys.platform not in common_paths:
        return None

    for likelyPath in common_paths[sys.platform]:
        if path.isfile(likelyPath):
            return likelyPath
        
    if sys.platform == "win32":
        inkscapePath = searchWindowsRegistryForInkscape()
        if inkscapePath:
            return inkscapePath

    return None

async def runCommands(commands):
    command = " ".join(commands)
    with tempfile.TemporaryDirectory() as temp_dir:
        env = os.environ.copy()
        env["XDG_DATA_HOME"] = temp_dir
        env["DBUS_SESSION_BUS_ADDRESS"] = "/dev/null"
        
        env["GTK_DEBUG"] = "fatal-warnings"
        
        if sys.platform == "darwin":
            # More aggressive GUI suppression for macOS
            env["LSUIElement"] = "1"
            env["DISPLAY"] = ""
            env["NSDocumentRevisionsDebugMode"] = "1"
            env["INKSCAPE_PREFERENCES_PATH"] = temp_dir  # Force separate preferences path
            env["INKSCAPE_PROFILE_DIR"] = temp_dir      # Force separate profile directory
            env["GTK_DEBUG"] = "no-gtk-init"           # Prevent GTK initialization
            # Prevent Quartz/X11 window system initialization
            env["GDK_BACKEND"] = "none"
            env["QT_QPA_PLATFORM"] = "minimal"
            # Additional GTK-related settings
            env["GTK_PATH"] = ""
            env["GTK2_RC_FILES"] = ""
            env["GTK_EXE_PREFIX"] = ""
            env["GTK_IM_MODULE"] = "none"
            # Disable recent files
            env["GTK_RECENT_FILES_DISABLED"] = "1"
            env["GSETTINGS_BACKEND"] = "memory"
            # Set a temporary home directory to prevent accessing user settings
            env["HOME"] = temp_dir
            env["XDG_CONFIG_HOME"] = temp_dir
            env["XDG_CACHE_HOME"] = temp_dir
            env["XDG_RUNTIME_DIR"] = temp_dir
            
        process = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            env=env
        )
        stdout, _ = await process.communicate()
        
        if stdout:
            print(f"[stdout]\n{stdout.decode()}")

async def convertToJpg(absoluteOutputDirectory, name, pngFilepath):
    jpgFilepath = os.path.join(absoluteOutputDirectory, "%s.jpg" % (name))
    convertCommands = [
        "magick convert",
        '"%s"' % pngFilepath,
        '"%s"' % jpgFilepath ]
    runCommands(convertCommands)

async def convertSvgToPngWithCairo(absoluteSvgFilepath, pngFilepath, width, height):
    cairosvg.svg2png(
        url=absoluteSvgFilepath,
        write_to=pngFilepath,
        output_width=width,
        output_height=height,
        dpi=300,
        background_color='transparent',
    )

async def exportSvgToImage(artFileOutputFilepath, imageSizePixels, name, outputDirectory):
    absoluteSvgFilepath = path.normpath(path.abspath(artFileOutputFilepath))
    absoluteOutputDirectory = path.normpath(path.abspath(outputDirectory))
    pngTempFilepath = path.normpath(path.join(absoluteOutputDirectory, f"{name}_temp.png"))
    pngFinalFilepath = path.normpath(path.join(absoluteOutputDirectory, f"{name}.png"))
    
    inkscapePath = findInkscape()
    if not inkscapePath:
        print("Inkscape is not installed or not found in common paths.")
        return

    createPngCommands = [
        '"%s"' % inkscapePath,
        '"%s"' % absoluteSvgFilepath,
        '--export-filename="%s"' % pngTempFilepath,
        "--export-dpi=300",
        "--export-background-opacity=0",
        # "--export-width=%s" % imageSizePixels[0],
        # "--export-height=%s" % imageSizePixels[1],
    ]
    await runCommands(createPngCommands)

    # We dont want to render the temp file as it is being written, so we rename it to the complete version.
    os.rename(pngTempFilepath, pngFinalFilepath)