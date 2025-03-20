// New utility file for component type helpers
import React from "react";
import { allColorVariations,colorsAndMetals } from '../../../../../shared/stockComponentColors.js';
import chalk from 'chalk';
// Known sizes in order from smallest to largest
export const sizePrefixes = ["Small", "Medium", "Large", "Tall"];
export const DEFAULT_SIZE = null; // Default size for components without a size prefix

// Define extraction rules for sizes
export const sizeExtractionRules = [
    // Rule 1: Size is the last part after comma (e.g., "Box Insert, Pro, Medium")
    {
        name: "comma-separated-last-part",
        test: (str) => str.includes(', '),
        extract: (str) => {
            const parts = str.split(', ');
            
            // Check each part for a size, not just the last part
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                
                // Check if part is a known size prefix
                if (sizePrefixes.includes(part)) {
                    const newParts = [...parts];
                    newParts.splice(i, 1);
                    return {
                        baseName: newParts.join(', '),
                        size: part,
                        isNumeric: false
                    };
                }
                
                // Check if part is a numeric size (e.g., "8mm")
                const numericMatch = part.match(/^(\d+(?:mm|cm)?)$/);
                if (numericMatch) {
                    const newParts = [...parts];
                    newParts.splice(i, 1);
                    return {
                        baseName: newParts.join(', '),
                        size: part,
                        isNumeric: true
                    };
                }
            }
            
            return null;
        }
    },
    
    // New Rule: Size is a number in parentheses at the end of the name (e.g., "Clear Poker Tuck Box (66)")
    {
        name: "number-in-parentheses-at-end",
        test: (str) => /\(\d+\)$/.test(str),
        extract: (str) => {
            const match = str.match(/^(.*?)\s*\((\d+)\)$/);
            if (match) {
                return {
                    baseName: match[1].trim(),
                    size: match[2],
                    isNumeric: true
                };
            }
            return null;
        }
    },
    
    // Rule 2: Size is a prefix (e.g., "Small Box")
    {
        name: "size-prefix",
        test: (str) => sizePrefixes.some(prefix => str.startsWith(prefix)),
        extract: (str) => {
            for (const prefix of sizePrefixes) {
                if (str.startsWith(prefix)) {
                    return {
                        baseName: str.substring(prefix.length).trim(),
                        size: prefix,
                        isNumeric: false
                    };
                }
            }
            return null;
        }
    },
    
    // Rule 3: Size is a number at the end (e.g., "Poker Tuck Box 36")
    {
        name: "ends-with-number",
        test: (str) => /\s\d+$/.test(str),
        extract: (str) => {
            const match = str.match(/^(.+?)\s+(\d+)$/);
            if (match) {
                return {
                    baseName: match[1].trim(),
                    size: match[2],
                    isNumeric: true
                };
            }
            return null;
        }
    },
    
    // Rule 4: Size is a number in parentheses (e.g., "Game Board (18)")
    {
        name: "number-in-parentheses",
        test: (str) => /\(\d+\)$/.test(str),
        extract: (str) => {
            const match = str.match(/^(.+?)\s*\((\d+)\)$/);
            if (match) {
                return {
                    baseName: match[1].trim(),
                    size: match[2],
                    isNumeric: true
                };
            }
            return null;
        }
    },
    
    // Rule 5: Size is a number followed by units (e.g., "Cube 10mm")
    {
        name: "number-with-units",
        test: (str) => /\d+(?:mm|cm)$/.test(str),
        extract: (str) => {
            const match = str.match(/^(.+?)\s+(\d+(?:mm|cm))$/);
            if (match) {
                return {
                    baseName: match[1].trim(),
                    size: match[2],
                    isNumeric: true
                };
            }
            return null;
        }
    },
    
    // New Rule: Size is in format "numbermm x numbermm" (e.g., "Disc, 14mm x 10mm, Blue")
    {
        name: "dimensions-format",
        test: (str) => {
            const parts = str.split(', ');
            return parts.some(part => /^\d+(?:mm|cm)?\s*x\s*\d+(?:mm|cm)?$/.test(part));
        },
        extract: (str) => {
            const parts = str.split(', ');
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                
                // Check if part matches the dimensions pattern
                if (/^\d+(?:mm|cm)?\s*x\s*\d+(?:mm|cm)?$/.test(part)) {
                    const newParts = [...parts];
                    newParts.splice(i, 1);
                    return {
                        baseName: newParts.join(', '),
                        size: part,
                        isNumeric: true
                    };
                }
            }
            
            return null;
        }
    }
];

// Define extraction rules for colors
export const colorExtractionRules = [
    // Improved rule: Handle "Light Color" and "Dark Color" patterns without changing the base name
    {
        name: "light-dark-color-variation",
        test: (str) => {
            const parts = str.split(', ');
            
            return parts.some(part => 
                /^(Light|Dark) [A-Za-z]+$/.test(part) || 
                part.includes('Light ') || 
                part.includes('Dark ')
            );
        },
        extract: (str) => {
            const parts = str.split(', ');
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                
                // Check for "Light Color" or "Dark Color" pattern
                const variationMatch = part.match(/^(Light|Dark) ([A-Za-z]+)$/);
                if (variationMatch) {
                    const variation = variationMatch[1]; // "Light" or "Dark"
                    const baseColor = variationMatch[2]; // The base color
                    
                    // Keep the full color name (e.g., "Light Blue") as the color
                    const fullColor = `${variation} ${baseColor}`;
                    
                    // Check if this is a valid color variation
                    const isValidColor = colorsAndMetals.some(c => 
                        fullColor.toLowerCase() === ("dark " + c.toLowerCase()) || 
                        fullColor.toLowerCase() === ("light " + c.toLowerCase())
                    );
                    
                    if (isValidColor) {
                        const newParts = [...parts];
                        newParts.splice(i, 1);
                        
                        const result = {
                            baseName: newParts.join(', '),
                            color: fullColor
                        };
                        
                        // Keep the original base name structure without adding Light/Dark to it
                        return result;
                    }
                }
            }
            return null;
        }
    },
    
    // New rule: Handle "Color Pearl" and "Color Opaque" patterns
    {
        name: "color-pearl-opaque",
        test: (str) => {
            const parts = str.split(', ');
            return parts.some(part => 
                /[A-Za-z]+ Pearl/.test(part) || /[A-Za-z]+ Opaque/.test(part)
            );
        },
        extract: (str) => {
            const parts = str.split(', ');
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                
                // Check for "Color Pearl" pattern
                const pearlMatch = part.match(/([A-Za-z]+) Pearl/);
                if (pearlMatch) {
                    const color = pearlMatch[1];
                    if (allColorVariations.some(c => 
                        color.toLowerCase() === c.toLowerCase()
                    )) {
                        const newParts = [...parts];
                        newParts[i] = 'Pearl';
                        return {
                            baseName: newParts.join(', '),
                            color: color
                        };
                    }
                }
                
                // Check for "Color Opaque" pattern
                const opaqueMatch = part.match(/([A-Za-z]+) Opaque/);
                if (opaqueMatch) {
                    const color = opaqueMatch[1];
                    if (allColorVariations.some(c => 
                        color.toLowerCase() === c.toLowerCase()
                    )) {
                        const newParts = [...parts];
                        newParts[i] = 'Opaque';
                        return {
                            baseName: newParts.join(', '),
                            color: color
                        };
                    }
                }
            }
            return null;
        }
    },
    
    // New rule: Handle "Color/Color" patterns, extracting the first color
    {
        name: "color-slash-color",
        test: (str) => {
            const parts = str.split(', ');
            return parts.some(part => /[A-Za-z]+\/[A-Za-z]+/.test(part));
        },
        extract: (str) => {
            const parts = str.split(', ');
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const match = part.match(/([A-Za-z]+)\/([A-Za-z]+)/);
                if (match) {
                    const firstColor = match[1];
                    // Check if the first part is a known color
                    if (allColorVariations.some(color => 
                        firstColor.toLowerCase() === color.toLowerCase()
                    )) {
                        const newParts = [...parts];
                        // Replace the "Color/Color" with just "/Color" to preserve the pattern
                        newParts[i] = '/' + match[2];
                        return {
                            baseName: newParts.join(', '),
                            color: firstColor
                        };
                    }
                }
            }
            return null;
        }
    },
    
    // Rule 1: Color is the last part after comma (e.g., "D6, 8mm, White")
    {
        name: "comma-separated-last-part",
        test: (str) => str.includes(', '),
        extract: (str) => {
            const parts = str.split(', ');
            const lastPart = parts[parts.length - 1];
            
            // Check if last part is a known color
            const isExactColorMatch = allColorVariations.some(color => 
                lastPart.toLowerCase() === color.toLowerCase()
            );
            
            if (isExactColorMatch) {
                return {
                    baseName: parts.slice(0, parts.length - 1).join(', '),
                    color: lastPart
                };
            }
            
            return null;
        }
    },
    
    // Rule 2: Color is the last word (e.g., "Wooden Cube Red")
    {
        name: "color-as-last-word",
        test: (str) => {
            const words = str.split(/\s+/);
            const lastWord = words[words.length - 1];
            return allColorVariations.some(color => 
                lastWord.toLowerCase() === color.toLowerCase()
            );
        },
        extract: (str) => {
            const words = str.split(/\s+/);
            const lastWord = words[words.length - 1];
            
            if (allColorVariations.some(color => 
                lastWord.toLowerCase() === color.toLowerCase()
            )) {
                return {
                    baseName: words.slice(0, -1).join(' '),
                    color: lastWord
                };
            }
            
            return null;
        }
    },
    
    // Rule 3: Color is in parentheses (e.g., "Game Piece (Blue)")
    {
        name: "color-in-parentheses",
        test: (str) => /\([A-Za-z]+\)$/.test(str),
        extract: (str) => {
            const match = str.match(/^(.+?)\s*\(([A-Za-z]+)\)$/);
            if (match) {
                const potentialColor = match[2];
                if (allColorVariations.some(color => 
                    potentialColor.toLowerCase() === color.toLowerCase()
                )) {
                    return {
                        baseName: match[1].trim(),
                        color: potentialColor
                    };
                }
            }
            return null;
        }
    },
    
    // Rule 4: Special case for dice with color (e.g., "D612mmBlack")
    {
        name: "dice-with-color",
        test: (str) => /^D(?:4|6|8|10|12|20)\d*mm[A-Z][a-z]+$/.test(str),
        extract: (str) => {
            const match = str.match(/^(D(?:4|6|8|10|12|20)\d*mm)([A-Z][a-z]+)$/);
            if (match) {
                const diceBase = match[1];
                const potentialColor = match[2];
                
                if (allColorVariations.some(color => 
                    potentialColor.toLowerCase() === color.toLowerCase()
                )) {
                    return {
                        baseName: diceBase,
                        color: potentialColor
                    };
                }
            }
            return null;
        }
    }
];

// Updated extraction function using rules
export const extractBaseNameAndSize = (name, displayName) => {
    // Try with displayName first if available
    if (displayName) {
        for (const rule of sizeExtractionRules) {
            if (rule.test(displayName)) {
                const result = rule.extract(displayName);
                if (result) {
                    return result;
                }
            }
        }
    }
    
    // Fall back to using the name
    for (const rule of sizeExtractionRules) {
        if (rule.test(name)) {
            const result = rule.extract(name);
            if (result) {
                return result;
            }
        }
    }
    
    // If no size is found, return the original string with default size
    return { baseName: name, size: DEFAULT_SIZE, isImplicitSize: true };
};

// Updated extraction function using rules
export const extractBaseNameAndColor = (name, displayName) => {
    // Try with displayName first if available
    if (displayName) {
        for (const rule of colorExtractionRules) {
            if (rule.test(displayName)) {
                const result = rule.extract(displayName);
                if (result) {
                    return result;
                }
            }
        }
    }
    
    // Fall back to using the name
    for (const rule of colorExtractionRules) {
        if (rule.test(name)) {
            const result = rule.extract(name);
            if (result) {
                return result;
            }
        }
    }
    
    // If no color is found, return the original string with null color
    return { baseName: name, color: null };
};

// Modified function to process base name with compound colors
export const cleanBaseName = (originalName, size, color) => {
    // Special handling for "Light" and "Dark" prefixed colors
    let baseColor = null;
    let colorPrefix = null;
    
    if (color) {
        // Check if this is a compound color with Light/Dark prefix
        const lightMatch = color.match(/^Light\s+([A-Za-z]+)$/i);
        const darkMatch = color.match(/^Dark\s+([A-Za-z]+)$/i);
        
        if (lightMatch) {
            baseColor = lightMatch[1];
            colorPrefix = "Light";
        } else if (darkMatch) {
            baseColor = darkMatch[1];
            colorPrefix = "Dark";
        }
    }
    
    // If the name has commas, handle it specially
    if (originalName.includes(', ')) {
        const parts = originalName.split(', ');
        
        // Filter out the size part
        const partsWithoutSize = parts.filter(part => part !== size);
        
        // Handle color parts, including compound colors
        const cleanedParts = partsWithoutSize.map(part => {
            // If this part contains the color we extracted, handle it specially
            if (color && part.includes(color)) {
                // For "Color Pearl" pattern, replace with "Pearl"
                const pearlMatch = part.match(new RegExp(`${color} Pearl`, 'i'));
                if (pearlMatch) {
                    return 'Pearl';
                }
                
                // For "Color Opaque" pattern, replace with "Opaque"
                const opaqueMatch = part.match(new RegExp(`${color} Opaque`, 'i'));
                if (opaqueMatch) {
                    return 'Opaque';
                }
                
                // For "Color/Color" pattern
                const slashMatch = part.match(new RegExp(`${color}\/([A-Za-z]+)`, 'i'));
                if (slashMatch) {
                    return 'Color/' + slashMatch[1];
                }
                
                // For "Black on Red" pattern
                const onMatch = part.match(new RegExp(`([A-Za-z]+) on ${color}`, 'i'));
                if (onMatch) {
                    return `${onMatch[1]} on Color`;
                }
                
                // For compound colors like "Light Blue" or "Dark Green"
                if (colorPrefix && baseColor) {
                    // Replace the entire color phrase with nothing to create a clean base name
                    return part.replace(new RegExp(`${colorPrefix} ${baseColor}`, 'i'), '').trim();
                }
                
                // For other patterns, remove the color
                return part.replace(color, '').trim();
            }
            return part;
        }).filter(part => part); // Remove any empty parts
        
        return cleanedParts.join(', ');
    }
    
    // For compound colors in non-comma separated names
    if (colorPrefix && baseColor && originalName.includes(`${colorPrefix} ${baseColor}`)) {
        return originalName.replace(new RegExp(`${colorPrefix} ${baseColor}`, 'i'), '').trim();
    }
    
    // Otherwise return the original name
    return originalName;
};

// Compare sizes for sorting (handles both standard size prefixes and numeric sizes)
export const compareSizes = (a, b) => {
    // Handle the default size (should come before other sizes)
    if (a === DEFAULT_SIZE) return -1;
    if (b === DEFAULT_SIZE) return 1;
    
    // If both are standard prefixes
    if (sizePrefixes.includes(a) && sizePrefixes.includes(b)) {
        return sizePrefixes.indexOf(a) - sizePrefixes.indexOf(b);
    }
    
    // If both are numeric
    if (!isNaN(Number(a)) && !isNaN(Number(b))) {
        return Number(a) - Number(b);
    }
    
    // If one is a prefix and one is numeric, prefix comes first
    if (sizePrefixes.includes(a)) return -1;
    if (sizePrefixes.includes(b)) return 1;
    
    // Default comparison
    return String(a).localeCompare(String(b));
};

// Format text with spaces
export const addSpaces = (str) => {
    return str
        // First specifically handle D4, D6, D8, D10, D12, D20
        .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
        // Then handle measurement units, keeping them with their numbers
        .replace(/(\d+)(mm|cm)/g, '$1$2')
        // Add space between lowercase and uppercase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Add space between letters and numbers (except for measurement units)
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        // Fix dice notation
        .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
        .trim()
};

// Helper function to extract the base color (like "Green" from "Lime Green" or "Transparent Green")
export const getBaseColor = (color) => {
    if (!color) return null;
    
    // First check if this is a Light/Dark prefixed color
    const lightMatch = color.match(/^Light\s+([A-Za-z]+)$/i);
    const darkMatch = color.match(/^Dark\s+([A-Za-z]+)$/i);
    
    if (lightMatch) {
        return lightMatch[1]; // Return the base color without "Light"
    } else if (darkMatch) {
        return darkMatch[1]; // Return the base color without "Dark"
    }
    
    // Convert to lowercase for comparison
    const colorLower = color.toLowerCase();
    
    // Find the base color by checking which color from our list is contained in the string
    for (const baseColor of allColorVariations) {
        if (colorLower.includes(baseColor.toLowerCase())) {
            return baseColor;
        }
    }
    
    return null;
};

// Helper function to extract color prefix (like "Transparent" from "Transparent Green")
export const getColorPrefix = (color) => {
    if (!color) return null;
    
    // Check for Light/Dark prefixes first
    const lightMatch = color.match(/^(Light)\s+[A-Za-z]+$/i);
    const darkMatch = color.match(/^(Dark)\s+[A-Za-z]+$/i);
    
    if (lightMatch) {
        return lightMatch[1];
    } else if (darkMatch) {
        return darkMatch[1];
    }
    
    // Get the base color
    const baseColor = getBaseColor(color);
    if (!baseColor) return null;
    
    // Remove the base color to get the prefix
    const prefixPart = color.toLowerCase().replace(baseColor.toLowerCase(), '').trim();
    
    if (!prefixPart) {
        return null;
    }
    
    return prefixPart;
};

// New function to determine if two components are color variations based on their keys and display names
export const areColorVariations = (component1, component2) => {
    // If either component is missing required info, they can't be color variations
    if (!component1 || !component2) return false;
    
    const key1 = component1.Key || '';
    const key2 = component2.Key || '';
    const displayName1 = component1.DisplayName || key1;
    const displayName2 = component2.DisplayName || key2;
    
    // If we have keys, use them for more accurate comparison
    if (key1 && key2) {
        // For keys like "D612mmBlack" and "D612mmBlue"
        // Extract the color part and check if the rest matches
        
        // For dice components with standard naming pattern
        const dicePattern = /^(D\d+\d+mm(?:Rounded)?)([A-Z][a-z]+)$/;
        const match1 = key1.match(dicePattern);
        const match2 = key2.match(dicePattern);
        
        if (match1 && match2) {
            const base1 = match1[1]; // e.g., "D612mm" or "D612mmRounded"
            const base2 = match2[1];
            const color1 = match1[2]; // e.g., "Black"
            const color2 = match2[2]; // e.g., "Blue"
            
            // Check if the bases match and both colors are in our list
            if (base1 === base2 && 
                allColorVariations.some(c => c.toLowerCase() === color1.toLowerCase()) &&
                allColorVariations.some(c => c.toLowerCase() === color2.toLowerCase())) {
                return true;
            }
        }
        
        // For other component types, we'll need different patterns
        // This could be expanded for other component naming conventions
    }
    
    // Fall back to display name comparison if keys don't provide a clear answer
    // Split both names by commas
    const parts1 = displayName1.split(', ');
    const parts2 = displayName2.split(', ');
    
    // If they have different number of parts, they're not color variations
    if (parts1.length !== parts2.length) return false;
    
    // Check if all parts except the last one match exactly
    for (let i = 0; i < parts1.length - 1; i++) {
        if (parts1[i] !== parts2[i]) return false;
    }
    
    // Get the last parts (potential colors)
    const lastPart1 = parts1[parts1.length - 1];
    const lastPart2 = parts2[parts2.length - 1];
    
    // Check if both last parts are colors from our list (including light/dark variations)
    const isColor1 = allColorVariations.some(color => 
        lastPart1.toLowerCase() === color.toLowerCase()
    );
    
    const isColor2 = allColorVariations.some(color => 
        lastPart2.toLowerCase() === color.toLowerCase()
    );
    
    // They're color variations if both last parts are colors and they're different
    return isColor1 && isColor2 && lastPart1 !== lastPart2;
}; 