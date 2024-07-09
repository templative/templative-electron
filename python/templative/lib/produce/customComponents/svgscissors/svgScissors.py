import os
from xml.etree import ElementTree
from aiofile import AIOFile
import svgmanip
import svgutils
import sys
import shutil
import shlex
import subprocess

from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.manage.models.produceProperties import ProduceProperties
from templative.lib.manage.models.gamedata import StudioData, GameData, ComponentData, ComponentBackData, PieceData
from templative.lib.produce.translation import getTranslation
from templative.lib.manage.models.composition import ComponentComposition
from templative.lib.manage.models.artdata import ComponentArtdata

async def createArtFileOfPiece(compositions:ComponentComposition, artdata:any, gamedata:PieceData|ComponentBackData, componentBackOutputDirectory:str, produceProperties:ProduceProperties) -> None:
    
    templateFilesDirectory = compositions.gameCompose["artTemplatesDirectory"]
    artFilename = "%s.svg" % (artdata["templateFilename"])
    artFilepath = os.path.normpath(os.path.join(produceProperties.inputDirectoryPath, templateFilesDirectory, artFilename))
    if not os.path.exists(artFilepath):
        print("!!! Template art file %s does not exist." % artFilepath)
        return
    
    artFile = None
    try:
        artFile = svgmanip.Element(artFilepath)
    except:
        print("!!! Template art file %s cannot be parsed." % artFilepath)
        return

    await addOverlays(artFile, artdata["overlays"], compositions, gamedata, produceProperties)
    pieceName = gamedata.pieceData["name"] if isinstance(gamedata, PieceData) else gamedata.componentBackDataBlob["name"]

    artFileOutputName = ("%s%s-%s" % (compositions.componentCompose["name"], gamedata.pieceUniqueBackHash, pieceName))
    artFileOutputFilepath = await createArtfile(artFile, artFileOutputName, componentBackOutputDirectory)

    await textReplaceInFile(artFileOutputFilepath, artdata["textReplacements"], gamedata, produceProperties)
    await updateStylesInFile(artFileOutputFilepath, artdata["styleUpdates"], gamedata)
    
    if not compositions.componentCompose["type"] in COMPONENT_INFO:
        raise Exception("No image size for %s", compositions.componentCompose["type"]) 
    component = COMPONENT_INFO[compositions.componentCompose["type"]]

    imageSizePixels = component["DimensionsPixels"]
    await scaleContent(artFileOutputFilepath, imageSizePixels, 0.3203944444444444)
    await assignSize(artFileOutputFilepath, imageSizePixels)
    await addNewlines(artFileOutputFilepath)
    await exportSvgToImage(artFileOutputFilepath, imageSizePixels, artFileOutputName, componentBackOutputDirectory)
    print("Produced %s." % (pieceName))

async def addNewlines(artFileOutputFilepath):
    contents = ""
    async with AIOFile(artFileOutputFilepath, 'r') as f:
        contents = await f.read()
    fixedContents = contents.replace("NEWLINE", "\n")
    if fixedContents == contents:
        return
    async with AIOFile(artFileOutputFilepath, 'w') as f:
        await f.write(fixedContents)

async def scaleContent(artFileOutputFilepath, imageSizePixels, scale):
    async with AIOFile(artFileOutputFilepath, encoding='utf-8') as svgFile:
        original = svgutils.transform.fromstring(await svgFile.read())    
        newSvgDocument = svgutils.transform.SVGFigure(imageSizePixels[0] * scale, imageSizePixels[1] * scale,)
        
        svg = original.getroot()
        svg.scale(scale)
        newSvgDocument.append(svg)
        
        newSvgDocument.save(artFileOutputFilepath)

async def assignSize(artFileOutputFilepath, imageSizePixels):
    
    parser = ElementTree.XMLParser(encoding="utf-8")
    elementTree = ElementTree.parse(artFileOutputFilepath, parser=parser)
    root = elementTree.getroot()
    toThreeHundredDpi = 0.319975619047619
    shrunkWidth = (imageSizePixels[0] * toThreeHundredDpi, imageSizePixels[1] * toThreeHundredDpi)
    root.set("width", "%spx" % shrunkWidth[0])
    root.set("height", "%spx" % shrunkWidth[1])

    root.set("viewbox", "0 0 %s %s" % (shrunkWidth[0], shrunkWidth[1]))
    async with AIOFile(artFileOutputFilepath,'wb') as f:
        await f.write(ElementTree.tostring(root))
    
async def createArtfile(artFile, artFileOutputName, outputDirectory):
    artFileOutputFileName = "%s.svg" % (artFileOutputName)
    artFileOutputFilepath = os.path.join(outputDirectory, artFileOutputFileName)
    artFile.dump(artFileOutputFilepath)
    return artFileOutputFilepath

async def addOverlays(artFile, overlays, compositions:ComponentComposition, pieceGamedata:PieceData, produceProperties:ProduceProperties):
    if artFile == None:
        print("artFile cannot be None.")
        return

    if overlays == None:
        print("overlays cannot be None.")
        return

    overlayFilesDirectory = compositions.gameCompose["artInsertsDirectory"]

    for overlay in overlays:
        isComplex = overlay["isComplex"] if "isComplex" in overlay else False
        if isComplex and produceProperties.isSimple:
            continue

        isDebug = overlay["isDebugInfo"] if "isDebugInfo" in overlay else False
        if isDebug and produceProperties.isPublish:
            continue
        
        positionX = float(overlay["positionX"]) if "positionX" in overlay else 0
        positionY = float(overlay["positionY"]) if "positionY" in overlay else 0
        overlayName = await getScopedValue(overlay, pieceGamedata)
        if overlayName == None or overlayName == "":
            continue
    
        overlaysFilepath = os.path.abspath(os.path.join(produceProperties.inputDirectoryPath, overlayFilesDirectory))
        overlayFilename = "%s.svg" % (overlayName)
        overlayFilepath = os.path.normpath(os.path.join(overlaysFilepath, overlayFilename))

        if not os.path.exists(overlayFilepath):
            print("!!! Overlay %s does not exist." % overlayFilepath)
            continue

        graphicsInsert = None
        try:
            graphicsInsert = svgmanip.Element(overlayFilepath)
        except:
            print("!!! Cannot parse %s." % overlayFilepath)
            continue

        artFile.placeat(graphicsInsert, positionX, positionY)

async def textReplaceInFile(filepath, textReplacements, gamedata:PieceData|ComponentBackData, produceProperties: ProduceProperties):
    if filepath == None:
        print("filepath cannot be None.")
        return

    if textReplacements == None:
        print("textReplacements cannot be None.")
        return

    contents = ""
    async with AIOFile(filepath, 'r') as f:
        contents = await f.read()
        for textReplacement in textReplacements:
            key = "{%s}" % textReplacement["key"]
            value = await getScopedValue(textReplacement, gamedata)
            if (isinstance(value, str)):
                value = value.replace("\\\\n", "\n")
            value = await processValueFilters(value, textReplacement)

            isComplex = textReplacement["isComplex"] if "isComplex" in textReplacement else False
            if isComplex and produceProperties.isSimple:
                value = ""

            isDebug = textReplacement["isDebugInfo"] if "isDebugInfo" in textReplacement else False
            if isDebug and produceProperties.isPublish:
                value = ""

            isTranslateable = "isTranslateable" in textReplacement and textReplacement["isTranslateable"]
            if produceProperties.targetLanguage != "en" and isTranslateable and value != None and value != "":
                translation = getTranslation("./", value, produceProperties.targetLanguage)
                if translation != None:
                    value = translation
                else:
                    print("Could not translate %s" % value)

            contents = contents.replace(key, value)
            
    async with AIOFile(filepath,'w') as f:
        await f.write(contents)

async def processValueFilters(value, textReplacement):
    if "filters" in textReplacement:
        for filter in textReplacement["filters"]:
            if filter == "toUpper":
                value = value.upper()
    return str(value)

async def updateStylesInFile(filepath, styleUpdates, pieceGamedata: PieceData):
    if filepath == None:
        print("filepath cannot be None.")
        return

    if styleUpdates == None:
        print("styleUpdates cannot be None.")
        return    

    try:
        async with AIOFile(filepath, encoding='utf-8') as svgFile:
            tree = ElementTree.fromstring(await svgFile.read())
        
            for styleUpdate in styleUpdates:
                findById = styleUpdate["id"]
                elementToUpdate = tree.find(".//*[@id='%s']" % findById)
                if (elementToUpdate != None):
                    value = await getScopedValue(styleUpdate, pieceGamedata)
                    await replaceStyleAttributeForElement(elementToUpdate, "style", styleUpdate["cssValue"], value)
                else:
                    print("Could not find element with id [%s]." % (findById))

            async with AIOFile(filepath,'wb', encoding='utf-8') as f:
                await f.write(ElementTree.tostring(tree))
    except ElementTree.ParseError as pe:
        print("Production failed!", pe, filepath)

async def replaceStyleAttributeForElement(element, attribute, key, value):
    attributeValue = element.get(attribute, "")

    replaceStyleWith = ""
    found = False

    cssKeyValuePairs = attributeValue.split(';')
    for cssKeyValuePair in cssKeyValuePairs:
        keyAndPair = cssKeyValuePair.split(':')
        if (keyAndPair[0] == key):
            replaceStyleWith += "%s:%s;" % (key, value)
            found = True
        else:
            replaceStyleWith += cssKeyValuePair + ';'
    if (not found):
        newCss = "%s:%s;" % (key, value)
        replaceStyleWith += newCss

    if replaceStyleWith[len(replaceStyleWith)-1] == ";":
        replaceStyleWith = replaceStyleWith[:len(replaceStyleWith)-1]
    element.set(attribute, replaceStyleWith)

async def getScopedValue(scopedValue, pieceGameData: PieceData|ComponentBackData):
    if scopedValue == None:
        print("scopedValue cannot be None.")
        return

    scope = scopedValue["scope"]
    source = scopedValue["source"]

    scopeData = None
    if scope == "studio":
        scopeData = pieceGameData.studioDataBlob

    if scope == "game":
        scopeData = pieceGameData.gameDataBlob

    if scope == "component":
        scopeData = pieceGameData.componentDataBlob

    if scope == "piece":
        scopeData = pieceGameData.pieceData if isinstance(pieceGameData, PieceData) else pieceGameData.componentBackDataBlob 

    if scope == "global":
        return source
    
    if scope == "utility":
        utilityFunctions = {
            # "git-sha": getCurrentGitSha
        }
        if not source in utilityFunctions:
            print("Missing function %s not found in %s scope." % (source, scope))
            return source
        return utilityFunctions[source]()

    if not source in scopeData:
        print("Missing key %s not found in %s scope." % (source, scope))
        return source

    return scopeData[source]

def runCommands(commands):   
    command = " ".join(commands)
    subprocess.run(shlex.split(command), shell=True)
    # print(message)
    # os.system(message)
    # try:
    #     result = subprocess.run(commands, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    #     print(result.stdout.decode())
    # except subprocess.CalledProcessError as e:
    #     print(f"Error executing command: {e.cmd}\nExit code: {e.returncode}\nOutput: {e.output.decode()}\nError: {e.stderr.decode()}")

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
    if inkscape_path and os.path.isfile(inkscape_path):
        return inkscape_path

    if not sys.platform in common_paths:
        return None

    for path in common_paths[sys.platform]:
        if os.path.isfile(path):
            return path

    return None

async def exportSvgToImage(filepath, imageSizePixels, name, outputDirectory):
    absoluteSvgFilepath = os.path.normpath(os.path.abspath(filepath))
    absoluteOutputDirectory = os.path.normpath(os.path.abspath(outputDirectory))
    pngFilepath = os.path.normpath(os.path.join(absoluteOutputDirectory, f"{name}.png"))
    
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

# def getCurrentGitSha():
#     repo = git.Repo(search_parent_directories=True)
#     return repo.head.object.hexsha