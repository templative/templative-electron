import os
from xml.etree import ElementTree
from aiofile import AIOFile
from svgmanip import Element
from lxml import etree

from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.manage.models.produceProperties import ProduceProperties, PreviewProperties
from templative.lib.manage.models.gamedata import PieceData, ComponentBackData
from templative.lib.produce.translation import getTranslation
from templative.lib.manage.models.composition import ComponentComposition
from templative.lib.manage.models.artdata import ComponentArtdata
from templative.lib.produce.customComponents.svgscissors.inkscapeProcessor import exportSvgToImage
from templative.lib.produce.customComponents.svgscissors.fontCache import FontCache

async def convertElementToString(element) -> str:
    out = etree.tostring(element.root, xml_declaration=True, standalone=True)
    return out.decode('utf-8')

async def createArtFileOfPiece(compositions: ComponentComposition, artdata: any, gamedata: PieceData | ComponentBackData, componentBackOutputDirectory: str, productionProperties: ProduceProperties | PreviewProperties, _:FontCache) -> None:
    templateFilesDirectory = compositions.gameCompose["artTemplatesDirectory"]
    if artdata is None: 
        print("!!! Missing artdata %s" % gamedata.componentDataBlob["displayName"])
        return
    artFilename = "%s.svg" % (artdata["templateFilename"])
    artFilepath = os.path.normpath(os.path.join(productionProperties.inputDirectoryPath, templateFilesDirectory, artFilename))
    if not os.path.exists(artFilepath):
        print("!!! Template art file %s does not exist." % artFilepath)
        return
    
    if not compositions.componentCompose["type"] in COMPONENT_INFO:
        raise Exception("No image size for %s", compositions.componentCompose["type"])
    component = COMPONENT_INFO[compositions.componentCompose["type"]]

    contents = None
    try:
        async with AIOFile(artFilepath, 'r') as f:
            contents = await f.read()
    except Exception as e:
        print(f"!!! Template art file {artFilepath} cannot be parsed. Error: {e}")
        return

    pieceName = gamedata.pieceData["name"] if isinstance(gamedata, PieceData) else gamedata.componentBackDataBlob["name"]
    imageSizePixels = component["DimensionsPixels"]
    
    contents = await addOverlays(contents, artdata["overlays"], compositions, gamedata, productionProperties)
    contents = await textReplaceInFile(contents, artdata["textReplacements"], gamedata, productionProperties)
    contents = await updateStylesInFile(contents, artdata["styleUpdates"], gamedata)
    contents = await addNewlines(contents)
    
    pieceUniqueHash = f"_{gamedata.pieceUniqueBackHash}" if gamedata.pieceUniqueBackHash != '' else ''
    artFileOutputName = f"{compositions.componentCompose['name']}{pieceUniqueHash}-{pieceName}"
    artFileOutputFilepath = await createArtfile(contents, artFileOutputName,imageSizePixels, componentBackOutputDirectory)
    await exportSvgToImage(artFileOutputFilepath, imageSizePixels, artFileOutputName, componentBackOutputDirectory)
    print(f"Produced {pieceName}.")

async def addNewlines(contents):
    if contents is None:
        raise Exception("contents cannot be None")
    return contents.replace("NEWLINE", "\n")

async def createArtfile(contents, artFileOutputName, imageSizePixels, outputDirectory):
    if contents is None:
        raise Exception("Contents cannot be None")

    root = ElementTree.fromstring(contents)
    
    SVG_NS = "http://www.w3.org/2000/svg"
    ElementTree.register_namespace('', SVG_NS)
    ElementTree.register_namespace('svg', SVG_NS)
    
    scale_factor = 96/300
    
    root.set('width', f'{imageSizePixels[0]*scale_factor}')
    root.set('height', f'{imageSizePixels[1]*scale_factor}')
    
    root.set('viewBox', f'0 0 {imageSizePixels[0]*scale_factor} {imageSizePixels[1]*scale_factor}')
    
    wrapper = ElementTree.Element(f'{{{SVG_NS}}}g')
    wrapper.set('transform', f'scale({scale_factor})')
    
    for child in list(root):
        wrapper.append(child)
    
    for child in list(root):
        root.remove(child)
    root.append(wrapper)
    
    contents = ElementTree.tostring(root, encoding='unicode')
    
    artFileOutputFileName = "%s.svg" % (artFileOutputName)
    artFileOutputFilepath = os.path.join(outputDirectory, artFileOutputFileName)
    async with AIOFile(artFileOutputFilepath, mode="w", encoding="utf-8") as file:
        await file.write(contents)
    return artFileOutputFilepath

async def addOverlays(contents, overlays, compositions: ComponentComposition, pieceGamedata: PieceData, productionProperties: ProduceProperties | PreviewProperties):
    if contents is None:
        raise Exception("contents cannot be None")

    if overlays is None:
        raise Exception("overlays cannot be None")

    overlayFilesDirectory = compositions.gameCompose["artInsertsDirectory"]

    for overlay in overlays:
        isComplex = overlay.get("isComplex", False)
        if isComplex and productionProperties.isSimple:
            continue

        isDebug = overlay.get("isDebugInfo", False)
        if isDebug and productionProperties.isPublish:
            continue

        positionX = overlay.get("positionX", 0)
        positionY = overlay.get("positionY", 0)
        overlayName = await getScopedValue(overlay, pieceGamedata)
        if not overlayName:
            continue

        overlaysFilepath = os.path.abspath(os.path.join(productionProperties.inputDirectoryPath, overlayFilesDirectory))
        overlayFilename = "%s.svg" % (overlayName)
        overlayFilepath = os.path.normpath(os.path.join(overlaysFilepath, overlayFilename))

        if not os.path.exists(overlayFilepath):
            print("!!! Overlay %s does not exist." % overlayFilepath)
            continue

        contents = await placeOverlay(contents, overlayFilepath, positionX, positionY)
    return contents

async def placeOverlay(contents:str, overlayFilepath, positionX, positionY) -> str:
    SVG_NS = "http://www.w3.org/2000/svg"
    ElementTree.register_namespace('', SVG_NS)
    ElementTree.register_namespace('svg', SVG_NS)
    
    main_svg = ElementTree.ElementTree(ElementTree.fromstring(contents))
    main_svg_root = main_svg.getroot()
    
    async with AIOFile(overlayFilepath, 'r') as afp:
        overlay_contents = await afp.read()
    overlay_svg_root = ElementTree.fromstring(overlay_contents)
    
    # Create group with proper namespace
    group = ElementTree.Element(f'{{{SVG_NS}}}g')
    
    # Instead of looking for the first transform group, add directly to root
    # and compensate for the root viewBox scaling
    viewBox = main_svg_root.get('viewBox', '').split()
    if viewBox:
        try:
            _, _, width, height = map(float, viewBox)
            actual_width = float(main_svg_root.get('width', width))
            scale_factor = actual_width / width
        except ValueError:
            scale_factor = 1.0
    else:
        scale_factor = 1.0
    
    # Apply position and inverse of root scaling
    group.set('transform', f'translate({positionX},{positionY}) scale({1/scale_factor})')
    
    # Copy attributes and children from overlay
    for key, value in overlay_svg_root.attrib.items():
        if key not in ['width', 'height', 'viewBox', 'transform']:
            group.set(key, value)
    
    for element in overlay_svg_root:
        group.append(element)
    
    # Add directly to root SVG instead of nested transform group
    main_svg_root.append(group)
    
    return ElementTree.tostring(main_svg_root, encoding='unicode')

async def textReplaceInFile(contents: str, textReplacements, gamedata: PieceData | ComponentBackData, productionProperties: ProduceProperties | PreviewProperties):
    for textReplacement in textReplacements:
        key = "{%s}" % textReplacement["key"]
        value = await getScopedValue(textReplacement, gamedata)
        if isinstance(value, str):
            value = value.replace("\\\\n", "\n")
        value = await processValueFilters(value, textReplacement)

        isComplex = textReplacement.get("isComplex", False)
        if isComplex and productionProperties.isSimple:
            value = ""

        isDebug = textReplacement.get("isDebugInfo", False)
        if isDebug and productionProperties.isPublish:
            value = ""

        if productionProperties.targetLanguage != "en" and textReplacement.get("isTranslateable", False) and value:
            translation = getTranslation("./", value, productionProperties.targetLanguage)
            if translation:
                value = translation
            else:
                print("Could not translate %s" % value)
        contents = contents.replace(key, value)
    return contents

async def processValueFilters(value, textReplacement):
    if "filters" in textReplacement:
        for filter in textReplacement["filters"]:
            if filter == "toUpper":
                value = value.upper()
    return str(value)

async def updateStylesInFile(contents, styleUpdates, pieceGamedata: PieceData):
    if contents is None:
        raise Exception("contents cannot be None.")

    if styleUpdates is None:
        raise Exception("styleUpdates cannot be None.")
    
    elementTree = ElementTree.ElementTree(ElementTree.fromstring(contents))
    try:
        for styleUpdate in styleUpdates:
            findById = styleUpdate["id"]
            elementToUpdate = elementTree.find(".//*[@id='%s']" % findById)
            if elementToUpdate is not None:
                value = await getScopedValue(styleUpdate, pieceGamedata)
                await replaceStyleAttributeForElement(elementToUpdate, "style", styleUpdate["cssValue"], value)
            else:
                print("Could not find element with id [%s]." % (findById))
        return ElementTree.tostring(elementTree.getroot(), encoding='unicode')
    except ElementTree.ParseError as pe:
        print("Production failed!", pe)

async def replaceStyleAttributeForElement(element:Element, attribute, key, value):
    attributeValue = element.get(attribute, "")
    replaceStyleWith = ""
    found = False

    cssKeyValuePairs = attributeValue.split(';')
    for cssKeyValuePair in cssKeyValuePairs:
        keyAndPair = cssKeyValuePair.split(':')
        if keyAndPair[0] == key:
            replaceStyleWith += f"{key}:{value};"
            found = True
        else:
            replaceStyleWith += cssKeyValuePair + ';'

    if not found:
        replaceStyleWith += f"{key}:{value};"

    if replaceStyleWith.endswith(";"):
        replaceStyleWith = replaceStyleWith[:-1]
    element.set(attribute, replaceStyleWith)

async def getScopedValue(scopedValue, pieceGameData: PieceData | ComponentBackData):
    if scopedValue is None:
        raise Exception("scopedValue cannot be None.")

    scope = scopedValue["scope"]
    source = scopedValue["source"]

    scopeData = None
    if scope == "studio":
        scopeData = pieceGameData.studioDataBlob
    elif scope == "game":
        scopeData = pieceGameData.gameDataBlob
    elif scope == "component":
        scopeData = pieceGameData.componentDataBlob
    elif scope == "piece":
        scopeData = pieceGameData.pieceData if isinstance(pieceGameData, PieceData) else pieceGameData.componentBackDataBlob
    elif scope == "global":
        return source
    elif scope == "utility":
        utilityFunctions = {
            # "git-sha": getCurrentGitSha
        }
        if source not in utilityFunctions:
            print("Missing function %s not found in %s scope." % (source, scope))
            return source
        return utilityFunctions[source]()

    if source not in scopeData:
        print("Missing key %s not found in %s scope." % (source, scope))
        return source

    return scopeData[source]

# def getCurrentGitSha():
#     repo = git.Repo(search_parent_directories=True)
#     return repo.head.object.hexsha
