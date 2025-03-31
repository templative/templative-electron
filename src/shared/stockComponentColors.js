const colors = ["lime green", "red", "blue", "green", "yellow", "mustard", "purple", "orange", "pink", "brown", "gray", "black", "white", "apricot", "teal", "caramel", "ivory", "wood", "limegreen", 'lavender', "salmon", "taupe", "natural", "rose", "tan", "mint"];
const metals = ["gold", "silver", "bronze", "copper", "golden"]
const shades = ["light", "dark", 'bright'];
const allColorVariations = [
  ...shades.flatMap(shade => colors.map(color => `${shade}${color}`)),
  ...shades.flatMap(shade => metals.map(metal => `${shade}${metal}`)),
  ...colors,
  ...metals
];
const colorsAndMetals = [...colors, ...metals];

const getColorValueHex = (colorName) => {
  // Convert to lowercase for comparison
  const color = colorName.toLowerCase();
  
  // Handle special cases and compound colors
  if (color.includes('light') || color.includes('bright')) {
      const baseColor = color.replace('light', '');
      baseColor = baseColor.replace('bright', '');
      switch (baseColor) {
          case 'red': return '#ff9999';
          case 'blue': return '#99ccff';
          case 'green': return '#99ffcc';
          case 'yellow': return '#ffffcc';
          case 'purple': return '#cc99ff';
          case 'orange': return '#ffcc99';
          case 'pink': return '#ffccff';
          case 'brown': return '#cc9966';
          case 'gray': return '#cccccc';
          case 'tan': return '#e6d8ad';
          case 'mint': return '#c5e8c5';
          case 'gold': 
          case 'golden': return '#ffe680';
          case 'silver': return '#e6e6e6';
          case 'bronze': return '#e6ccb3';
          case 'copper': return '#ffcc99';
          default: return '#f0f0f0';
      }
  } else if (color.includes('dark')) {
      const baseColor = color.replace('dark', '');
      switch (baseColor) {
          case 'red': return '#cc0000';
          case 'blue': return '#0066cc';
          case 'green': return '#006633';
          case 'yellow': return '#cccc00';
          case 'purple': return '#660099';
          case 'orange': return '#cc6600';
          case 'pink': return '#cc6699';
          case 'brown': return '#663300';
          case 'gray': return '#666666';
          case 'tan': return '#997a45';
          case 'mint': return '#4c9173';
          case 'gold':
          case 'golden': return '#cc9900';
          case 'silver': return '#999999';
          case 'bronze': return '#996633';
          case 'copper': return '#cc6633';
          default: return '#333333';
      }
  } else if (color.includes('transparent')) {
      return 'rgba(200, 200, 200, 0.5)';
  } else if (color.includes('metallic')) {
      return '#c0c0c0';
  } else {
      // Basic colors
      switch (color) {
          case 'red': return '#ff0000';
          case 'blue': return '#0000ff';
          case 'green': return '#008000';
          case 'yellow': return '#ffff00';
          case 'mustard': return '#e1ad01';
          case 'natural': return '#F1E5AC'; // Yellowish/tan natural color
          case 'purple': return '#800080';
          case 'orange': return '#ffa500';
          case 'pink': return '#ffc0cb';
          case 'brown': return '#a52a2a';
          case 'gray': return '#808080';
          case 'black': return '#000000';
          case 'white': return '#ffffff';
          case 'apricot': return '#fbceb1';
          case 'rose': return '#FF007F'; // Pinkish-red rose color
          case 'salmon': return '#FA8072'; // Pinkish-orange salmon color
          case 'taupe': return '#483C32'; // Grayish-brown taupe color
          case 'teal': return '#008080';
          case 'caramel': return '#c68e17';
          case 'clear': return 'transparent';
          case 'ivory': return '#fffff0';
          case 'wood': return '#966f33';
          case 'limegreen': return '#32cd32';
          case 'lavender': return '#e6e6fa';
          case 'tan': return '#d2b48c';
          case 'mint': return '#98fb98';
          case 'gold':
          case 'golden': return '#ffd700';
          case 'silver': return '#c0c0c0';
          case 'bronze': return '#cd7f32';
          case 'copper': return '#b87333';
          default: return '#cccccc';
      }
  }
};

const getColorValueRGB = (colorName) => {
  // Get the hex value first
  const hexColor = getColorValueHex(colorName);
  
  // Handle transparent case
  if (hexColor === 'transparent') {
    return { r: 0, g: 0, b: 0 };
  }
  
  // Handle rgba format
  if (hexColor.startsWith('rgba')) {
    const rgbaValues = hexColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgbaValues) {
      return {
        r: parseInt(rgbaValues[1], 10) / 255.0,
        g: parseInt(rgbaValues[2], 10) / 255.0,
        b: parseInt(rgbaValues[3], 10) / 255.0
      };
    }
  }
  
  // Handle hex format
  let hex = hexColor.replace('#', '');
  
  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Parse the hex values and convert to 0-1 range
  const r = parseInt(hex.substring(0, 2), 16) / 255.0;
  const g = parseInt(hex.substring(2, 4), 16) / 255.0;
  const b = parseInt(hex.substring(4, 6), 16) / 255.0;
  
  return [r,g,b];
};
module.exports = {
    colors,
    metals,
    shades,
    colorsAndMetals,
    allColorVariations,
    getColorValueHex,
    getColorValueRGB
}