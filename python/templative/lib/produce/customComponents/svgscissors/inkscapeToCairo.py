from matplotlib import font_manager
from lxml import etree
from PIL import ImageFont
import itertools
import copy
import re
from templative.lib.produce.customComponents.svgscissors.fontCache import FontCache

nsMap = {
    'svg': 'http://www.w3.org/2000/svg',
    'xlink': 'http://www.w3.org/1999/xlink',
    'inkscape': 'http://www.inkscape.org/namespaces/inkscape',
}
svgNs = '{http://www.w3.org/2000/svg}'

def findFontPath(fontFamily, fontCache:FontCache):
    if fontFamily in fontCache.fontPathsCache:
        return fontCache.fontPathsCache[fontFamily]
    
    fontPaths = font_manager.findSystemFonts(fontpaths=None, fontext='ttf')
    for fontPath in fontPaths:
        fontProperties = font_manager.FontProperties(fname=fontPath)
        try:
            # print(fontProperties.get_name())
            if fontProperties.get_name() == fontFamily:
                fontCache.fontPathsCache[fontFamily] = fontPath
                return fontPath
        except:
            return None
    return None

def getFont(fontFamily, fontSize, fontCache:FontCache):
    fontKey = f"{fontFamily}_{fontSize}"
    if fontKey in fontCache.fontsCache:
        return fontCache.fontsCache[fontKey]
    if fontFamily in fontCache.missingFonts:
        return ImageFont.load_default()
    fontPath = findFontPath(fontFamily, fontCache)
    if fontPath:
        try:
            font = ImageFont.truetype(fontPath, int(fontSize))
            fontCache.fontsCache[fontKey] = font
            return font
        except IOError as e:
            print(f"!!! Error loading font '{fontFamily}' from {fontPath}: {e}. Using default font.")
            fontCache.missingFonts.add(fontFamily)
            return ImageFont.load_default()

    print(f"!!! Font {fontFamily} not found in system. Using default font.")
    fontCache.missingFonts.add(fontFamily)
    return ImageFont.load_default()
    
def getFontInfo(currentStyles, fontCache:FontCache):
    fontSize = currentStyles.get('font-size', '16px')
    fontFamily = currentStyles.get('font-family', 'Arial').strip("'")
    lineHeight = float(currentStyles.get('line-height', 1.2))

    try:
        fontSize = float(fontSize.replace('px', ''))
        if fontSize <= 0:
            raise ValueError(f"Invalid font size: {fontSize}. Using default size of 16px.")
    except ValueError:
        print(f"!!! Invalid font size '{fontSize}' encountered. Using default size of 16px.")
        fontSize = 16

    font = getFont(fontFamily, fontSize, fontCache)
    
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

def getAllStylesIncludingInheritance(element):
    finalStyling = {}
    while element is not None:
        style = element.attrib.get('style', '')
        if style == '':
            element = element.getparent()
            continue
        styleDict = dict(item.strip().split(':', 1) for item in style.split(';') if ':' in item)
        for attribute in styleDict:
            if attribute in finalStyling:
                continue
            value = styleDict[attribute].strip()
            value = value.strip("'\"")
            finalStyling[attribute] = value 
            
        element = element.getparent()
    return finalStyling

def determinePaintOrder(style_dict):
    paint_order = 'paint-order' in style_dict and style_dict['paint-order'].lower() or 'fill stroke markers'
            
    if 'stroke' in paint_order and 'fill' in paint_order:
        first_paint = None
        for paint in paint_order.split():
            if paint in ['fill', 'stroke']:
                first_paint = paint
                break
        if first_paint == 'stroke':
            return ['stroke', 'fill']
        
        return ['fill', 'stroke']
    return ['fill', 'stroke']

def processSvgStrokeOrder(svgContent):
    """
    Preprocess SVG content to ensure that strokes are rendered after fills.
    
    This function splits elements with both fill and stroke into separate elements,
    placing the stroke element after the fill element to maintain correct rendering order.
    
    Args:
        svgContent (str): The original SVG content as a string.
    
    Returns:
        str: The modified SVG content with corrected paint order.
        
    The x,cx,y,cy arent respected when duplicating
    """
    parser = etree.XMLParser(remove_blank_text=True)
    root = etree.fromstring(svgContent.encode('utf-8'), parser)
    tree = etree.ElementTree(root)
    
    # Define SVG elements that can have fill and stroke
    svg_elements = ["tspan", 'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'text']
    TEXT_TAG = f'{{{nsMap["svg"]}}}text'
    TSPAN_TAG = f'{{{nsMap["svg"]}}}tspan'
    
    for elem_tag in svg_elements:
        # Find all elements of this type
        elements = root.findall(f'.//svg:{elem_tag}', namespaces=nsMap)
        
        for elem in elements:
            style_dict = getAllStylesIncludingInheritance(elem)
            has_fill = "fill" in style_dict
            has_stroke = "stroke" in style_dict
            if not (has_fill and has_stroke):
                continue
        
            if elem.tag in [TEXT_TAG, TSPAN_TAG]:
                # Determine if the element has direct text content
                has_direct_text = bool(elem.text and elem.text.strip())
                
                # Determine if any child has direct text content
                has_child_text = any(child.text and child.text.strip() for child in elem)
                
                # If neither the element nor its children have text, skip splitting
                if not (has_direct_text or has_child_text):
                    continue  # Skip to the next element without splitting
        
            # Create a copy for fill
            
            fill_elem = etree.Element(elem.tag, nsmap=elem.nsmap)
            for attrib_key, attrib_val in elem.attrib.items():
                if attrib_key in ['stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-opacity', 'stroke-width']:
                    # Remove stroke-related attributes
                    continue
                fill_elem.set(attrib_key, attrib_val)
            
            # Handle style attribute for fill
            if 'stroke' in style_dict:
                fill_style_dict = copy.deepcopy(style_dict)  # Create a copy for fill
                del fill_style_dict['stroke']
            else:
                fill_style_dict = style_dict.copy()
            fill_style = ';'.join([f"{k}:{v}" for k, v in fill_style_dict.items() if k != 'stroke']) + ';stroke:none' if fill_style_dict else 'stroke:none'
            fill_elem.set('style', fill_style)
            
            # Create a copy for stroke
            stroke_elem = etree.Element(elem.tag, nsmap=elem.nsmap)
            for attrib_key, attrib_val in elem.attrib.items():
                if attrib_key in ['fill', 'fill-opacity', 'fill-rule']:
                    # Remove fill-related attributes
                    continue
                stroke_elem.set(attrib_key, attrib_val)
            
            # Handle style attribute for stroke
            if 'fill' in style_dict:
                stroke_style_dict = copy.deepcopy(style_dict)  # Create a copy for stroke
                del stroke_style_dict['fill']
            else:
                stroke_style_dict = style_dict.copy()
            stroke_style = ';'.join([f"{k}:{v}" for k, v in stroke_style_dict.items() if k != 'fill']) + ';fill:none' if stroke_style_dict else 'fill:none'
            stroke_elem.set('style', stroke_style)
            
            if elem.tag in [TEXT_TAG, TSPAN_TAG]:
                # Preserve the text content in both fill and stroke elements
                fill_elem.text = elem.text
                stroke_elem.text = elem.text
                
                # Iterate through child elements (e.g., <tspan>)
                for child in elem:
                    # Create corresponding fill child
                    fill_child = etree.SubElement(fill_elem, child.tag, child.attrib)
                    fill_child.text = child.text
                    fill_child.tail = None  # Remove tail to prevent whitespace
                    
                    # Create corresponding stroke child
                    stroke_child = etree.SubElement(stroke_elem, child.tag, child.attrib)
                    stroke_child.text = child.text
                    stroke_child.tail = child.tail  # Assi
            
            # Insert fill and stroke elements
            parent = elem.getparent()
            if parent is None:
                continue
            
            index = parent.index(elem)
            insertion_order = determinePaintOrder(style_dict)
            for order in insertion_order:
                if order == 'fill':
                    parent.insert(index, fill_elem)
                    index += 1
                elif order == 'stroke':
                    parent.insert(index, stroke_elem)
                    index += 1
            # Remove the original element
            parent.remove(elem)
                
    
    # Serialize the modified SVG back to string
    modifiedSvgContent = etree.tostring(tree, pretty_print=True, xml_declaration=True, encoding='UTF-8').decode('utf-8')
    return modifiedSvgContent

def convertShapeInsideTextToWrappedText(svgContent, fontCache:FontCache):
    parser = etree.XMLParser(remove_blank_text=True)
    root = etree.fromstring(svgContent.encode('utf-8'), parser)
    tree = etree.ElementTree(root)

    textElements = root.findall('.//svg:text', namespaces=nsMap)

    for textElem in textElements:
        shapeInside = getInheritedStyle(textElem, 'shape-inside')
        if not shapeInside:
            continue
        convertTextElement(root, textElem, fontCache)

    modifiedSvgContent = etree.tostring(tree, pretty_print=True, xml_declaration=True, encoding='UTF-8').decode('utf-8')
    return modifiedSvgContent

def wrapTextWithTspans(textElem, maxWidth, fontCache:FontCache, inheritedStyles={}, xPos=0, yPos=0):
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
                font, fontSize, lineHeight = getFontInfo(styles, fontCache)
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
                        font, fontSize, lineHeight = getFontInfo(styles, fontCache)
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

def convertTextElement(root, textElem, fontCache: FontCache):
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
    wrappedTextElem = wrapTextWithTspans(textElem, maxWidth, fontCache, parentStyles, xPos, yPos)

    # Replace the original text element in the root with the wrapped text element
    parent = textElem.getparent()
    parent.replace(textElem, wrappedTextElem)
