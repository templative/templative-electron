
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

# async def runCommands(commands):
#     command = " ".join(commands)
#     # Create a temporary directory
#     with tempfile.TemporaryDirectory() as temp_dir:
#         # Set environment variable for temporary directory
#         env = os.environ.copy()
#         env["XDG_DATA_HOME"] = temp_dir
#         env["DBUS_SESSION_BUS_ADDRESS"] = "/dev/null"  # Disable DBus
#         # Run the command
#         process = await asyncio.create_subprocess_shell(
#             command,
#             stdout=asyncio.subprocess.PIPE,
#             stderr=asyncio.subprocess.PIPE,
#             env=env
#         )
#         stdout, stderr = await process.communicate()
        
#         if stdout:
#             print(f"[stdout]\n{stdout.decode()}")
#         if stderr:
#             print(f"!!! Error {command} exporting to png: {stderr.decode()}")

async def exportSvgToImage(artFileOutputFilepath, imageSizePixels, name, outputDirectory):
    absoluteSvgFilepath = path.normpath(path.abspath(artFileOutputFilepath))
    absoluteOutputDirectory = path.normpath(path.abspath(outputDirectory))
    pngTempFilepath = path.normpath(path.join(absoluteOutputDirectory, f"{name}_temp.png"))
    pngFinalFilepath = path.normpath(path.join(absoluteOutputDirectory, f"{name}.png"))
    
    # inkscapePath = findInkscape()
    # if not inkscapePath:
    #     print("Inkscape is not installed or not found in common paths.")
    #     return

    # createPngCommands = [
    #     '"%s"' % inkscapePath,
    #     '"%s"' % absoluteSvgFilepath,
    #     '--export-filename="%s"' % pngFilepath,
    #     "--export-dpi=300",
    #     "--export-background-opacity=0"
    #     # "--with-gui",
    #     # "--export-width=%s" % imageSizePixels[0],
    #     # "--export-height=%s" % imageSizePixels[1],
    # ]
    # await runCommands(createPngCommands)
    # jpgFilepath = os.path.join(absoluteOutputDirectory, "%s.jpg" % (name))
    # convertCommands = [
    #     "magick convert",
    #     '"%s"' % pngFilepath,
    #     '"%s"' % jpgFilepath ]
    # runCommands(convertCommands)

    # os.remove(pngFilepath)
    cairosvg.svg2png(
        url=absoluteSvgFilepath,
        write_to=pngTempFilepath,
        output_width=imageSizePixels[0],
        output_height=imageSizePixels[1],
        dpi=300,
        background_color='transparent',
    )
    # We dont want to render the temp file as it is being written, so we rename it to the complete version.
    os.rename(pngTempFilepath, pngFinalFilepath)
    # print(f"Converted {absoluteSvgFilepath} to {pngFilepath}")