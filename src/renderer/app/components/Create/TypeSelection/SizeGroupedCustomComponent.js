import React, { useState, useMemo } from "react";
import { addSpaces } from './ComponentType';
import ExportIcons, { getExportRouteInfo } from './ExportIcons';
import PdfIcon from './TypeIcons/PdfIcon';
import TabletopPlaygroundIcon from './TypeIcons/TabletopPlaygroundIcon';
import TabletopSimulatorIcon from './TypeIcons/TabletopSimulatorIcon';
import TheGameCrafterIcon from './TypeIcons/theGameCrafterIcon';
import './StockComponentType.css';

// Known sizes in order from smallest to largest
const sizePrefixes = ["Micro", "Mini", "Small", "Medium", "Large", "Tall"];

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
    return extractNumericSuffix(name);
};

// Helper function to extract size from a string (for prefix-based sizes)
const extractSizeFromString = (str) => {
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
const extractNumericSuffix = (str) => {
    // Check for a number at the end of the string that follows any letters/words
    // This will match patterns like "BridgeTuckBox108" but not "CustomColorD6"
    const match = str.match(/^([A-Za-z]+(?:[A-Z][a-z]*)*?)(\d+)$/);
    
    if (match) {
        return {
            baseName: match[1], // Everything before the number
            size: match[2],     // The number itself as a string
            isNumeric: true     // Flag to indicate this is a numeric size
        };
    }
    
    // No numeric suffix found
    return { baseName: str, size: null };
};

// Compare sizes for sorting (handles both standard size prefixes and numeric sizes)
const compareSizes = (a, b) => {
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

const SizeGroupedCustomComponent = ({ baseName, components, selectTypeCallback, selectedComponentType, search }) => {
    // Find if any component in this group is selected
    const hasSelectedComponent = components.some(comp => comp.key === selectedComponentType);
    
    // Find the selected component
    const selectedComponent = components.find(comp => comp.key === selectedComponentType) || components[0];
    
    // Sort components by size (using custom compare function)
    const sortedComponents = [...components].sort((a, b) => {
        return compareSizes(a.size, b.size);
    });
    
    // State for selected size in dropdown (initialize with selected component's size if available)
    const [selectedSize, setSelectedSize] = useState(
        selectedComponent ? selectedComponent.size : (sortedComponents[0]?.size || "")
    );
    
    // When size dropdown changes, select the corresponding component
    const handleSizeChange = (e) => {
        const newSize = e.target.value;
        setSelectedSize(newSize);
        
        // Find component with this size and select it
        const componentWithSize = components.find(comp => comp.size === newSize);
        if (componentWithSize) {
            selectTypeCallback(componentWithSize.key);
        }
    };
    
    // Get export route info for the selected component
    const exportRoutes = getExportRouteInfo(selectedComponent.componentInfo);
    
    // Format the base name with proper spacing
    const displayBaseName = addSpaces(baseName);
    
    // Determine if there's a preview image URL
    const imageUrl = useMemo(() => {
        if (!selectedComponent.key) return null;
        return `https://www.thegamecrafter.com/product-images/${selectedComponent.key}.jpg`;
    }, [selectedComponent.key]);
    
    return (
        <div className={`component-type-wrapper ${hasSelectedComponent ? 'selected-group' : ''}`}>
            <div className="component-type-card size-grouped-component-card outline-card">
                <div className="component-type-content">
                    <div className="component-type-info">
                        <p className="component-type-name">{displayBaseName}</p>
                        {(selectedComponent.componentInfo["SimulatorCreationTask"] || selectedComponent.componentInfo["DimensionsInches"]) && (
                            <p className="component-type-dimensions">
                                {selectedComponent.componentInfo["SimulatorCreationTask"]}
                                {selectedComponent.componentInfo["SimulatorCreationTask"] && selectedComponent.componentInfo["DimensionsInches"] && " - "}
                                {selectedComponent.componentInfo["DimensionsInches"] && 
                                  `${parseFloat(selectedComponent.componentInfo["DimensionsInches"][0]).toFixed(1)}″×${parseFloat(selectedComponent.componentInfo["DimensionsInches"][1]).toFixed(1)}″`}
                            </p>
                        )}
                        
                        {/* Component Preview (similar to ComponentType) */}
                        <div className="component-type-preview">
                            {imageUrl && (
                                <img 
                                    src={imageUrl} 
                                    alt={displayBaseName}
                                    className="preview-image"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                        </div>
                        
                        {/* Size Dropdown and Export Icons Row */}
                        <div className="size-selector-row">
                            <div className="size-selector">
                                <select 
                                    value={selectedSize} 
                                    onChange={handleSizeChange}
                                    className="size-dropdown"
                                >
                                    {sortedComponents.map(comp => (
                                        <option key={comp.key} value={comp.size}>
                                            {comp.isNumeric ? `Fits ${comp.size}` : `${comp.size} Size`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Export Icons */}
                            <ExportIcons componentInfo={selectedComponent.componentInfo} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeGroupedCustomComponent;