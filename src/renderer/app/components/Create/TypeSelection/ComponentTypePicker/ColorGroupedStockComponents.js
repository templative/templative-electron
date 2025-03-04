import React, { useState, useEffect } from "react";
import { addSpaces } from './ComponentType';
import './StockComponentType.css';
import { allColorVariations, getColorValueHex } from "../../../../../../shared/stockComponentColors";

// Helper function to get a CSS color value from a color name


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
    
    // Find the selected component
    const selectedComponent = components.find(comp => comp.key === selectedComponentType) || components[0];
    
    // Sort components by color name for better organization
    const sortedComponents = [...components].sort((a, b) => a.color.localeCompare(b.color));
    
    // Format the base name with proper spacing
    const displayBaseName = addSpaces(baseName);
    
    return (
        <div className={`component-type-wrapper ${hasSelectedComponent ? 'selected-group' : ''}`}>
            <div className="component-type-card color-grouped-component-card outline-card">
                <div className="component-type-content">
                    <div className="component-type-info">
                        <p className="component-type-name">{displayBaseName}</p>
                        {(selectedComponent.componentInfo["SimulatorCreationTask"] || selectedComponent.componentInfo["Color"]) && (
                            <p className="component-type-dimensions">
                                {selectedComponent.componentInfo["SimulatorCreationTask"]}
                                {selectedComponent.componentInfo["SimulatorCreationTask"] && selectedComponent.componentInfo["Color"] && " - "}
                                {selectedComponent.componentInfo["Color"]}
                            </p>
                        )}
                        
                        <div className="color-options-container">
                            {/* Color options as selectable buttons */}
                            <div className="color-options-grid">
                                {sortedComponents.map((component, index) => (
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
                                                    style={{ backgroundColor: getColorValueHex(component.color) }}
                                                >
                                                    {component.color.charAt(0).toUpperCase()}
                                                </div>
                                            )}
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