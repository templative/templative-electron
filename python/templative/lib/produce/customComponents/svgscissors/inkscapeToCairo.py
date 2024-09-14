from matplotlib import font_manager
from lxml import etree
from PIL import ImageFont
import itertools
import re

nsMap = {
    'svg': 'http://www.w3.org/2000/svg',
    'xlink': 'http://www.w3.org/1999/xlink',
    'inkscape': 'http://www.inkscape.org/namespaces/inkscape',
}
svgNs = '{http://www.w3.org/2000/svg}'

fontsCache = {}
fontPathsCache = {} 

def findFontPath(fontFamily):
    if fontFamily in fontPathsCache:
        return fontPathsCache[fontFamily]
    fontPaths = font_manager.findSystemFonts(fontpaths=None, fontext='ttf')
    for fontPath in fontPaths:
        fontProperties = font_manager.FontProperties(fname=fontPath)
        if fontProperties.get_name() == fontFamily:
            fontPathsCache[fontFamily] = fontPath
            return fontPath
    return None

def getFont(fontFamily, fontSize):
    fontKey = f"{fontFamily}_{fontSize}"
    if fontKey in fontsCache:
        return fontsCache[fontKey]
    fontPath = findFontPath(fontFamily)
    if fontPath:
        try:
            font = ImageFont.truetype(fontPath, int(fontSize))
            fontsCache[fontKey] = font
            return font
        except IOError:
            print(f"!!! Font '{fontFamily}' not found. Using default font.")
            return ImageFont.load_default()
    else:
        print(f"!!! Font '{fontFamily}' not found in system. Using default font.")
        return ImageFont.load_default()
    
def getFontInfo(currentStyles):
    fontSize = currentStyles.get('font-size', '16px')
    fontFamily = currentStyles.get('font-family', 'Arial').strip("'")
    lineHeight = float(currentStyles.get('line-height', 1.2))

    try:
        fontSize = float(fontSize.replace('px', ''))
    except ValueError:
        print(f"!!! Invalid font size '{fontSize}' encountered. Using default size of 16px.")
        fontSize = 16

    font = getFont(fontFamily, fontSize)
    
    return font, fontSize, lineHeight

def getCurrentStyles(textElem, child):
    """
    Merges parent and child styles into a single dictionary.
    """
    parentStyles = parseStyleString(textElem.attrib.get('style', ''))
    childStyles = parseStyleString(child.attrib.get('style', ''))
    return {**parentStyles, **childStyles}

def processTextLine(word, currentLine, font, fontSize, maxWidth, yOffset, currentStyles, textElem, child, lines):
    """
    Handles text wrapping and adding new lines to the list of lines.
    Ensures that styles are correctly applied.
    """
    testLine = f"{currentLine} {word}".strip()

    try:
        width = font.getbbox(testLine)[2]
    except Exception as e:
        print(f"!!! Failed to calculate text width for '{testLine}': {e}")
        return currentLine, yOffset

    if width <= maxWidth:
        currentLine = testLine
    else:
        if currentLine:
            mergedAttribs = mergeAttributes(textElem.attrib, child.attrib, currentStyles)
            lines.append((currentLine, yOffset, mergedAttribs))
            print(f"   --> Created wrapped line: {currentLine} with styles: {mergedAttribs['style']}")
        currentLine = word
        yOffset += fontSize * float(currentStyles.get('line-height', 1.2))

    return currentLine, yOffset

def mergeAttributes(parentAttribs, childAttribs, currentStyles):
    """
    Merge the style attributes from parent and child, allowing the child's style
    fields to overwrite the parent's where applicable.
    """
    mergedAttribs = {**parentAttribs, **childAttribs}

    # Handle 'style' attribute merging
    parentStyles = parseStyleString(parentAttribs.get('style', ''))
    childStyles = parseStyleString(childAttribs.get('style', ''))

    # Combine parent and child styles, giving priority to the child
    combinedStyles = {**parentStyles, **childStyles, **currentStyles}

    # Set the merged 'style' attribute
    mergedAttribs['style'] = buildStyleString(combinedStyles)
    
    return mergedAttribs

def parseStyleString(styleString):
    """
    Parse a style string into a dictionary. Example input: 'font-size: 12px; color: red;'
    """
    styleDict = {}
    if styleString:
        styles = styleString.split(';')
        for style in styles:
            if ':' in style:
                key, value = style.split(':', 1)
                styleDict[key.strip()] = value.strip()
    return styleDict

def buildStyleString(styles):
    """
    Build a style string from a dictionary of styles.
    """
    return '; '.join(f'{k}: {v}' for k, v in styles.items() if v)

def getInheritedStyle(element, attribute, default=None):
    while element is not None:
        style = element.attrib.get('style', '')
        if style == '':
            element = element.getparent()
            continue
        styleDict = dict(item.strip().split(':', 1) for item in style.split(';') if ':' in item)
        if attribute in styleDict:
            value = styleDict[attribute].strip()
            value = value.strip("'\"")
            return value
        element = element.getparent()
    
    return default

def convertShapeInsideTextToWrappedText(svgContent):
    parser = etree.XMLParser(remove_blank_text=True)
    root = etree.fromstring(svgContent.encode('utf-8'), parser)
    tree = etree.ElementTree(root)

    textElements = root.findall('.//svg:text', namespaces=nsMap)

    for textElem in textElements:
        shapeInside = getInheritedStyle(textElem, 'shape-inside')
        if not shapeInside:
            continue
        convertTextElement(root, textElem)

    modifiedSvgContent = etree.tostring(tree, pretty_print=True, xml_declaration=True, encoding='UTF-8').decode('utf-8')
    return modifiedSvgContent

def wrapTextWithTspans(textElem, maxWidth, inheritedStyles={}, xPos=0, yPos=0):
    """
    Processes the text element and its children in document order,
    wrapping text and calculating y positions correctly.
    Handles inline style changes within lines, respects multiple newlines,
    and adjusts line spacing based on the largest font size in each line.
    Inserts a newline at the beginning of the content if 'shape-inside' is present,
    and removes the 'shape-inside' attribute from the resulting text element.
    """
    lines = []  # List of lines, each line is a list of (text, styles)
    yOffset = 0  # Initialize yOffset from 0; will add yPos when setting 'y' attribute

    # Extract styles from the original text element
    originalTextStyles = textElem.attrib.get('style', '')
    parsedStyles = parseStyleString(originalTextStyles)

    # Check if 'shape-inside' is in the styles
    if 'shape-inside' in parsedStyles:
        # Insert a newline at the beginning of the text content
        if textElem.text:
            textElem.text = '\n' + textElem.text
        else:
            textElem.text = '\n'
        # Remove 'shape-inside' from the styles
        del parsedStyles['shape-inside']
        # Reconstruct the style string without 'shape-inside'
        updatedStyleString = buildStyleString(parsedStyles)
        # Update the textElem's style attribute
        textElem.attrib['style'] = updatedStyleString

    # Update originalTextStyles to the updated style string
    originalTextStyles = textElem.attrib.get('style', '')

    # Stack for iterative traversal: (element, styles, child_index)
    stack = []
    stack.append((textElem, inheritedStyles.copy(), 0))

    # List of text runs: [(text, styles)]
    textRuns = []

    while stack:
        elem, currentStyles, child_index = stack.pop()

        # Merge styles
        elementStyles = parseStyleString(elem.attrib.get('style', ''))
        styles = {**currentStyles, **elementStyles}

        if child_index == 0:
            # Process element's text content
            text = (elem.text or '')
            if text is not None:
                textRuns.append((text, styles.copy()))

        if child_index < len(elem):
            # There are more children to process
            # Push the current element back onto the stack with the next child index
            stack.append((elem, currentStyles, child_index + 1))
            # Now, push the child onto the stack to process it next
            child = elem[child_index]
            stack.append((child, styles.copy(), 0))
        else:
            # All children have been processed, process tail text
            tail = (elem.tail or '')
            if tail is not None:
                # Use currentStyles (styles of the parent)
                textRuns.append((tail, currentStyles.copy()))

    # Now we have a list of text runs: [(text, styles)]

    # Process the text runs to wrap them into lines
    currentLineTokens = []
    currentLineWidth = 0
    currentLineMaxFontSize = 0
    currentLineMaxLineHeight = 0

    for text, styles in textRuns:
        # Split the text run into segments based on newlines, including empty segments
        segments = text.split('\n')

        for i, segment in enumerate(segments):
            # Split segment into tokens (words and spaces)
            tokens = re.findall(r'[^\s]+|\s+', segment)
            for token in tokens:
                if token == '':
                    continue
                # Update font based on styles
                font, fontSize, lineHeight = getFontInfo(styles)
                tokenWidth = font.getbbox(token)[2]
                # Update maximum font size and line height for the current line
                currentLineMaxFontSize = max(currentLineMaxFontSize, fontSize)
                currentLineMaxLineHeight = max(currentLineMaxLineHeight, lineHeight)
                if currentLineWidth + tokenWidth > maxWidth and token.strip():
                    # Wrap to new line
                    if currentLineTokens:
                        lines.append((currentLineTokens, yOffset, currentLineMaxFontSize, currentLineMaxLineHeight))
                        yOffset += currentLineMaxFontSize * currentLineMaxLineHeight
                        currentLineTokens = []
                        currentLineWidth = 0
                        # Reset maximums after wrapping to new line
                        currentLineMaxFontSize = fontSize
                        currentLineMaxLineHeight = lineHeight
                # Add token to current line
                currentLineTokens.append((token, styles.copy()))
                currentLineWidth += tokenWidth
            # After processing the segment, check for line breaks
            if i < len(segments) - 1:
                # Newline encountered, force line break
                if currentLineTokens:
                    # Add the current line
                    lines.append((currentLineTokens, yOffset, currentLineMaxFontSize, currentLineMaxLineHeight))
                    yOffset += currentLineMaxFontSize * currentLineMaxLineHeight
                    currentLineTokens = []
                    currentLineWidth = 0
                    # Reset maximums after newline
                    currentLineMaxFontSize = 0
                    currentLineMaxLineHeight = 0
                else:
                    # Empty line due to consecutive newlines
                    # Use default font size and line height if maximums are zero
                    if currentLineMaxFontSize == 0:
                        font, fontSize, lineHeight = getFontInfo(styles)
                        currentLineMaxFontSize = fontSize
                        currentLineMaxLineHeight = lineHeight
                    lines.append(([], yOffset, currentLineMaxFontSize, currentLineMaxLineHeight))
                    yOffset += currentLineMaxFontSize * currentLineMaxLineHeight
                    # Reset maximums after empty line
                    currentLineMaxFontSize = 0
                    currentLineMaxLineHeight = 0

    # After processing all text runs, add any remaining tokens as a line
    if currentLineTokens:
        lines.append((currentLineTokens, yOffset, currentLineMaxFontSize, currentLineMaxLineHeight))
        yOffset += currentLineMaxFontSize * currentLineMaxLineHeight

    # Build the new text element with tspans
    newTextElem = etree.Element(f"{svgNs}text", nsmap=nsMap)
    newTextElem.attrib['x'] = str(xPos)
    newTextElem.attrib['y'] = str(yPos)
    newTextElem.attrib['style'] = originalTextStyles  # Updated style without 'shape-inside'

    # Now, for each line, create tspans for each style run in the line
    for lineRuns, offset, lineMaxFontSize, lineMaxLineHeight in lines:
        # Create a parent tspan for the line
        tspanLine = etree.Element(f"{svgNs}tspan", nsmap=nsMap)
        tspanLine.attrib['x'] = str(xPos)
        tspanLine.attrib['y'] = str(float(yPos) + offset)
        if not lineRuns:
            # Empty line (due to multiple newlines), set text to empty string
            tspanLine.text = ''
        else:
            # Build the text content and sub-tspans
            currentStyles = None
            tspanRun = None
            for token, styles in lineRuns:
                if currentStyles != styles:
                    # Start a new tspan for the style run
                    if tspanRun is not None:
                        tspanLine.append(tspanRun)
                    tspanRun = etree.Element(f"{svgNs}tspan", nsmap=nsMap)
                    # Set styles
                    runAttribs = {}
                    runAttribs['style'] = buildStyleString(styles)
                    for attrib, value in runAttribs.items():
                        if attrib not in ('x', 'y', 'dx', 'dy'):
                            tspanRun.attrib[attrib] = value
                    tspanRun.text = ''
                    currentStyles = styles
                # Append token to tspanRun.text
                if tspanRun.text is None:
                    tspanRun.text = token
                else:
                    tspanRun.text += token
            if tspanRun is not None:
                tspanLine.append(tspanRun)
        newTextElem.append(tspanLine)

    return newTextElem

def convertTextElement(root, textElem):
    # Extract the 'shape-inside' style from the element
    shapeInside = getInheritedStyle(textElem, 'shape-inside')
    if not shapeInside:
        return

    # Extract the ID of the rectangle used for the shape-inside reference
    match = re.search(r'url\(#(.*?)\)', shapeInside)
    if not match:
        print(f"!!! Invalid shape-inside attribute found: '{shapeInside}'.")
        return

    rectId = match.group(1)
    rect = root.find(f".//svg:rect[@id='{rectId}']", namespaces=nsMap)
    if rect is None:
        print("!!! Cannot find rect used for shape-inside.")
        return

    # Get rectangle dimensions and position for text wrapping

    # Get the wrapped text element with lines from wrapTextWithTspans
    parentStyles = parseStyleString(textElem.attrib.get('style', ''))
    parentStyles["shape-inside"] = None
    maxWidth = float(rect.attrib.get('width'))
    xPos = rect.attrib.get('x')
    yPos = rect.attrib.get('y')
    wrappedTextElem = wrapTextWithTspans(textElem, maxWidth, parentStyles, xPos, yPos)

    # Replace the original text element in the root with the wrapped text element
    parent = textElem.getparent()
    parent.replace(textElem, wrappedTextElem)
