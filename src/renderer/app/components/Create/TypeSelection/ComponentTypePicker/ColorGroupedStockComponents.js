import React, { useState, useEffect } from "react";
import { addSpaces } from './ComponentType';
import './StockComponentType.css';
import { allColorVariations } from "../../../../../../shared/stockComponentColors";

// Helper function to get a CSS color value from a color name
const getColorValue = (colorName) => {
    // Convert to lowercase for comparison
    const color = colorName.toLowerCase();
    
    // Handle special cases and compound colors
    if (color.includes('light')) {
        const baseColor = color.replace('light', '');
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
            case 'gold': return '#ffe680';
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
            case 'gold': return '#cc9900';
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
            case 'purple': return '#800080';
            case 'orange': return '#ffa500';
            case 'pink': return '#ffc0cb';
            case 'brown': return '#a52a2a';
            case 'gray': return '#808080';
            case 'black': return '#000000';
            case 'white': return '#ffffff';
            case 'apricot': return '#fbceb1';
            case 'teal': return '#008080';
            case 'caramel': return '#c68e17';
            case 'clear': return 'transparent';
            case 'ivory': return '#fffff0';
            case 'wood': return '#966f33';
            case 'limegreen': return '#32cd32';
            case 'lavender': return '#e6e6fa';
            case 'gold': return '#ffd700';
            case 'silver': return '#c0c0c0';
            case 'bronze': return '#cd7f32';
            case 'copper': return '#b87333';
            default: return '#cccccc';
        }
    }
};

// Helper function to extract the base color (like "Green" from "Lime Green" or "Transparent Green")
const getBaseColor = (color) => {
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
const getColorPrefix = (color) => {
    // Get the base color
    const baseColor = getBaseColor(color);
    if (!baseColor) return null;
    
    // Remove the base color to get the prefix
    const prefixPart = color.toLowerCase().replace(baseColor.toLowerCase(), '').trim();
    
    if (!prefixPart) {
        return null;
    }
    
    // Capitalize the first letter of each word in the prefix
    return prefixPart.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const ColorGroupedStockComponents = ({ baseName, components, selectTypeCallback, selectedComponentType, search }) => {
    // Find if any component in this group is selected
    const hasSelectedComponent = components.some(comp => comp.key === selectedComponentType);
    
    // Sort components by color name for better organization
    const sortedComponents = [...components].sort((a, b) => a.color.localeCompare(b.color));
    
    // Format the base name with proper spacing
    const displayBaseName = addSpaces(baseName);
    
    return (
        <div className={`component-type-wrapper ${hasSelectedComponent ? 'selected-group' : ''}`}>
            <div className="component-type-card color-grouped-component-card outline-card">
                <div className="component-type-content">
                    <div className="component-type-info">
                        <p><strong>{displayBaseName}</strong></p>
                        
                        <div className="color-options-container">
                            {/* Color options as selectable buttons */}
                            <div className="color-options-grid">
                                {sortedComponents.map(component => (
                                    <button 
                                        key={component.key} 
                                        className={`color-option-button ${component.key === selectedComponentType ? 'selected-color-option' : ''}`}
                                        onClick={() => selectTypeCallback(component.key)}
                                        title={component.color}
                                    >
                                        <div className="color-option-content">
                                            {component.componentInfo.PreviewUri ? (
                                                <img 
                                                    src={component.componentInfo.PreviewUri} 
                                                    alt={component.color}
                                                    className="color-option-image"
                                                />
                                            ) : (
                                                <div 
                                                    className="color-option-placeholder"
                                                    style={{ backgroundColor: getColorValue(component.color) }}
                                                >
                                                    {component.color.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="color-option-label">{component.color}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorGroupedStockComponents; 