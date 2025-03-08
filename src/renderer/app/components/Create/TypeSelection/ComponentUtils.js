// New utility file for component type helpers
import React from "react";

// Known sizes in order from smallest to largest
export const sizePrefixes = ["Small", "Medium", "Large", "Tall"];
export const DEFAULT_SIZE = "Standard"; // Default size for components without a size prefix

// Helper function to extract base name and size from component name
export const extractBaseNameAndSize = (name, displayName) => {
    // First try with displayName if available
    if (displayName) {
        // Try standard size prefixes
        const prefixResult = extractSizeFromString(displayName);
        if (prefixResult.size) {
            return prefixResult;
        }
        
        // Try numerical suffix
        const numericResult = extractNumericSuffix(displayName);
        if (numericResult.size) {
            return numericResult;
        }
    }
    
    // Fall back to using the name
    // Try standard size prefixes
    const prefixResult = extractSizeFromString(name);
    if (prefixResult.size) {
        return prefixResult;
    }
    
    // Try numerical suffix
    const numericResult = extractNumericSuffix(name);
    if (numericResult.size) {
        return numericResult;
    }
    
    // If no size is found, return the original string as both the base name and with a default size
    // This allows components without explicit size to be grouped with sized variants
    return { baseName: name, size: DEFAULT_SIZE, isImplicitSize: true };
};

// Helper function to extract size from a string (for prefix-based sizes)
export const extractSizeFromString = (str) => {
    // Check if the string starts with any of the size prefixes
    for (const prefix of sizePrefixes) {
        if (str.startsWith(prefix)) {
            // Remove the size prefix from the string to get the base name
            const baseName = str.substring(prefix.length);
            return { baseName, size: prefix, isNumeric: false };
        }
    }
    
    // If no size prefix is found, return the original string as the base name
    return { baseName: str, size: null };
};

// Helper function to extract numeric suffix as size
export const extractNumericSuffix = (str) => {
    // Skip dice notation patterns like D6, D20, etc.
    if (/D(4|6|8|10|12|20)$/.test(str)) {
        return { baseName: str, size: null };
    }
    
    // Check for a number at the end of the string that follows any letters/words
    // This will match patterns like "BridgeTuckBox108" or "Hookbox 6" but not "CustomColorD6"
    const match = str.match(/^([A-Za-z]+(?:[A-Z][a-z]*)*?)(?:\s*)(\d+)$/);
    
    if (match) {
        return {
            baseName: match[1].trim(), // Everything before the number, trimmed
            size: match[2],            // The number itself as a string
            isNumeric: true            // Flag to indicate this is a numeric size
        };
    }
    
    // No numeric suffix found
    return { baseName: str, size: null };
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

// List of all possible color variations for stock components
export const allColorVariations = [
    "Red", "Blue", "Green", "Yellow", "Black", "White", 
    "Purple", "Orange", "Brown", "Gray", "Pink", "Teal",
    "Lime", "Cyan", "Magenta", "Gold", "Silver", "Bronze"
];

// Helper function to extract base name and color from component name
export const extractBaseNameAndColor = (name, displayName) => {
    // First try with displayName if available
    if (displayName) {
        const result = extractColorFromString(displayName);
        if (result.color) {
            return result;
        }
    }
    
    // Fall back to using the name
    return extractColorFromString(name);
};

// Helper function to extract color from a string
export const extractColorFromString = (str) => {
    // Special handling for dice notation (D6, D12, etc.)
    if (/D(4|6|8|10|12|20)\d*mm/.test(str)) {
        // For dice, we need to be more careful with the extraction
        // Extract color only if it appears at the end after a comma or as the last word
        const commaIndex = str.lastIndexOf(", ");
        if (commaIndex !== -1) {
            const potentialColorPart = str.substring(commaIndex + 2); // +2 to skip ", "
            
            // Check if the potential color part contains a valid color from our list
            const containsValidColor = allColorVariations.some(color => 
                potentialColorPart.toLowerCase() === color.toLowerCase()
            );
            
            if (containsValidColor) {
                const baseName = str.substring(0, commaIndex);
                return { baseName: baseName, color: potentialColorPart };
            }
        }
        
        // For dice without comma format, check if the last word is a color
        const words = str.split(/\s+/);
        const lastWord = words[words.length - 1];
        
        if (allColorVariations.some(color => lastWord.toLowerCase() === color.toLowerCase())) {
            const baseName = words.slice(0, -1).join(' ');
            return { baseName: baseName, color: lastWord };
        }
        
        // For dice with color directly attached (like D612mmBlack)
        const diceMatch = str.match(/^(D(?:4|6|8|10|12|20)\d*mm)([A-Z][a-z]+)$/);
        if (diceMatch) {
            const diceBase = diceMatch[1];
            const potentialColor = diceMatch[2];
            
            if (allColorVariations.some(color => potentialColor.toLowerCase() === color.toLowerCase())) {
                return { baseName: diceBase, color: potentialColor };
            }
        }
        
        // If we get here, we couldn't extract a color for this dice
        return { baseName: str, color: null };
    }
    
    // Standard color extraction for non-dice components
    const commaIndex = str.lastIndexOf(", ");
    if (commaIndex === -1) return { baseName: str, color: null };
    
    // Check if the part after the last comma is a color or contains a color
    const potentialColorPart = str.substring(commaIndex + 2); // +2 to skip ", "
    
    // Check if the potential color part is a pure color from our list (exact match)
    const isExactColorMatch = allColorVariations.some(color => 
        potentialColorPart.toLowerCase() === color.toLowerCase()
    );
    
    if (isExactColorMatch) {
        const baseName = str.substring(0, commaIndex);
        return { baseName: baseName, color: potentialColorPart };
    }
    
    // If it's not an exact match, it might be a modified color (like "Marbled Green")
    // In this case, we should consider the entire string as the base name
    return { baseName: str, color: null };
};

// Helper function to extract the base color (like "Green" from "Lime Green" or "Transparent Green")
export const getBaseColor = (color) => {
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
    
    // Check if both last parts are pure colors from our list
    const isPureColor1 = allColorVariations.some(color => 
        lastPart1.toLowerCase() === color.toLowerCase()
    );
    
    const isPureColor2 = allColorVariations.some(color => 
        lastPart2.toLowerCase() === color.toLowerCase()
    );
    
    // They're color variations if both last parts are pure colors
    return isPureColor1 && isPureColor2;
}; 