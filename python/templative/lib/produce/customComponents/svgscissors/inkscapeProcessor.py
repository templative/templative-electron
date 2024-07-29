from os import path
import sys
import shutil
import shlex
import subprocess

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


def runCommands(commands):
    command = " ".join(commands)
    
    # Async version -> https://chatgpt.com/c/a88a5976-8e5b-484f-a6dc-a1221a039620
    subprocess.run(shlex.split(command), shell=True)
    # print(message)
    # os.system(message)
    # try:
    #     result = subprocess.run(commands, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    #     print(result.stdout.decode())
    # except subprocess.CalledProcessError as e:
    #     print(f"Error executing command: {e.cmd}\nExit code: {e.returncode}\nOutput: {e.output.decode()}\nError: {e.stderr.decode()}")



async def exportSvgToImage(filepath, imageSizePixels, name, outputDirectory):
    absoluteSvgFilepath = path.normpath(path.abspath(filepath))
    absoluteOutputDirectory = path.normpath(path.abspath(outputDirectory))
    pngFilepath = path.normpath(path.join(absoluteOutputDirectory, f"{name}.png"))

    inkscapePath = findInkscape()
    if not inkscapePath:
        print("Inkscape is not installed or not found in common paths.")
        return

    createPngCommands = [
        '"%s"' % inkscapePath,
        '"%s"' % absoluteSvgFilepath,
        '--export-filename="%s"' % pngFilepath,
        "--export-dpi=300",
        "--export-background-opacity=0"
        # "--with-gui",
        # "--export-width=%s" % imageSizePixels[0],
        # "--export-height=%s" % imageSizePixels[1],
    ]
    # print(createPngCommands)
    # print(command)

    runCommands(createPngCommands)
    # jpgFilepath = os.path.join(absoluteOutputDirectory, "%s.jpg" % (name))
    # convertCommands = [
    #     "magick convert",
    #     '"%s"' % pngFilepath,
    #     '"%s"' % jpgFilepath ]
    # runCommands(convertCommands)

    # os.remove(pngFilepath)