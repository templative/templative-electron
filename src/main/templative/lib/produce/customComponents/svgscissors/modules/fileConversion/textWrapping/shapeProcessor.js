/**
 * Extract bounds from a shape element
 * @param {Element} shapeElement - Shape element
 * @param {string} shapeType - Type of shape
 * @returns {Object|null} - Bounds object with x, y, width, height
 */
function extractShapeBounds(shapeElement, shapeType) {
  switch (shapeType) {
    case 'rect':
      return extractRectBounds(shapeElement);
    case 'circle':
      return extractCircleBounds(shapeElement);
    case 'ellipse':
      return extractEllipseBounds(shapeElement);
    case 'path':
      return extractPathBounds(shapeElement);
    default:
      return null;
  }
}

/**
 * Extract bounds from a rect element
 * @param {Element} rectElement - Rect element
 * @returns {Object} - Bounds object with x, y, width, height
 */
function extractRectBounds(rectElement) {
  const x = parseFloat(rectElement.getAttribute('x') || 0);
  const y = parseFloat(rectElement.getAttribute('y') || 0);
  const width = parseFloat(rectElement.getAttribute('width') || 0);
  const height = parseFloat(rectElement.getAttribute('height') || 0);
  
  return { x, y, width, height };
}

/**
 * Extract bounds from a circle element
 * @param {Element} circleElement - Circle element
 * @returns {Object} - Bounds object with x, y, width, height
 */
function extractCircleBounds(circleElement) {
  const cx = parseFloat(circleElement.getAttribute('cx') || 0);
  const cy = parseFloat(circleElement.getAttribute('cy') || 0);
  const r = parseFloat(circleElement.getAttribute('r') || 0);
  
  return {
    x: cx - r,
    y: cy - r,
    width: r * 2,
    height: r * 2
  };
}

/**
 * Extract bounds from an ellipse element
 * @param {Element} ellipseElement - Ellipse element
 * @returns {Object} - Bounds object with x, y, width, height
 */
function extractEllipseBounds(ellipseElement) {
  const cx = parseFloat(ellipseElement.getAttribute('cx') || 0);
  const cy = parseFloat(ellipseElement.getAttribute('cy') || 0);
  const rx = parseFloat(ellipseElement.getAttribute('rx') || 0);
  const ry = parseFloat(ellipseElement.getAttribute('ry') || 0);
  
  return {
    x: cx - rx,
    y: cy - ry,
    width: rx * 2,
    height: ry * 2
  };
}

/**
 * Extract bounds from a path element
 * @param {Element} pathElement - Path element
 * @returns {Object} - Bounds object with x, y, width, height
 */
function extractPathBounds(pathElement) {
  // This is a more comprehensive implementation
  try {
    // First try to use getBBox if available (works in browser environments)
    if (pathElement.getBBox) {
      try {
        const bbox = pathElement.getBBox();
        return {
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height
        };
      } catch (e) {
        console.error('Error getting bounding box:', e);
      }
    }
    
    // If getBBox is not available or fails, try to parse the path data
    const pathData = pathElement.getAttribute('d');
    if (!pathData) {
      return {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };
    }
    
    // Simple path parser to extract bounds
    // This is a simplified approach that works for many common paths
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let currentX = 0, currentY = 0;
    
    // Split path data into commands
    const commands = pathData.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
    
    for (const cmd of commands) {
      const type = cmd[0];
      const args = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);
      
      switch (type) {
        case 'M': // Move to (absolute)
          currentX = args[0];
          currentY = args[1];
          break;
        case 'm': // Move to (relative)
          currentX += args[0];
          currentY += args[1];
          break;
        case 'L': // Line to (absolute)
          currentX = args[0];
          currentY = args[1];
          break;
        case 'l': // Line to (relative)
          currentX += args[0];
          currentY += args[1];
          break;
        case 'H': // Horizontal line to (absolute)
          currentX = args[0];
          break;
        case 'h': // Horizontal line to (relative)
          currentX += args[0];
          break;
        case 'V': // Vertical line to (absolute)
          currentY = args[0];
          break;
        case 'v': // Vertical line to (relative)
          currentY += args[0];
          break;
        // Add more path commands as needed
      }
      
      // Update bounds
      minX = Math.min(minX, currentX);
      minY = Math.min(minY, currentY);
      maxX = Math.max(maxX, currentX);
      maxY = Math.max(maxY, currentY);
    }
    
    // If we couldn't determine bounds, return default
    if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
      return {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  } catch (error) {
    console.error('Error parsing path data:', error);
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    };
  }
}

/**
 * Get bounds of a shape element
 * @param {Element} shapeElement - Shape element
 * @returns {Object|null} - Bounds object with x, y, width, height
 */
function getShapeBounds(shapeElement) {
  const tagName = shapeElement.tagName.toLowerCase();
  
  switch (tagName) {
    case 'rect':
      return extractShapeBounds(shapeElement, 'rect');
    case 'circle':
      return extractShapeBounds(shapeElement, 'circle');
    case 'ellipse':
      return extractShapeBounds(shapeElement, 'ellipse');
    case 'path':
      return extractShapeBounds(shapeElement, 'path');
    default:
      return null;
  }
}

module.exports = {
  extractRectBounds,
  extractCircleBounds,
  extractEllipseBounds,
  extractPathBounds,
  getShapeBounds
}; 