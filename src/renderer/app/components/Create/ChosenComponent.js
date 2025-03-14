import React, { useContext, useState, useEffect } from "react";
import "./CreatePanel.css";
import { RenderingWorkspaceContext } from '../Render/RenderingWorkspaceProvider';
import "./ChosenComponent.css";
import { getColorValueHex } from "../../../../shared/stockComponentColors";
import { extractBaseNameAndSize, addSpaces, areColorVariations } from './TypeSelection/ComponentUtils';

const ChosenComponent = ({ isProcessing, createComponent, componentTypeOptions, isToggledToComponents }) => {
    const context = useContext(RenderingWorkspaceContext);
    const isCreateButtonDisabled = isProcessing || context.componentName === "" || context.selectedComponentType === undefined;

    // Get the selected component info if available
    const selectedComponentInfo = context.selectedComponentType ? 
        componentTypeOptions[context.selectedComponentType] : null;
    const isStock = selectedComponentInfo?.DimensionsPixels === undefined;

    // Find color variations if they exist
    const colorVariations = [];
    if (selectedComponentInfo && !isToggledToComponents) {
        // Find all components that are color variations of the selected component
        Object.keys(componentTypeOptions).forEach(key => {
            if (key !== context.selectedComponentType) {
                const compInfo = componentTypeOptions[key];
                
                // Pass the full component info objects for better comparison
                if (areColorVariations(
                    { Key: context.selectedComponentType, ...selectedComponentInfo },
                    { Key: key, ...compInfo }
                )) {
                    // Extract color from the name (last part)
                    const compDisplayName = compInfo.DisplayName || key;
                    const color = compDisplayName.split(', ').pop();
                    
                    colorVariations.push({
                        key,
                        color,
                        componentInfo: compInfo
                    });
                }
            }
        });
    }

    // Find size variations if they exist
    const sizeVariations = [];
    if (selectedComponentInfo) {
        // Extract base name and size from the selected component
        const displayName = selectedComponentInfo.DisplayName || context.selectedComponentType;
        const { baseName, size, isNumeric } = extractBaseNameAndSize(context.selectedComponentType, displayName);
        
        if (baseName && size) {
            // Find all components with the same base name (potential size variations)
            Object.keys(componentTypeOptions).forEach(key => {
                if (key !== context.selectedComponentType) {
                    const compInfo = componentTypeOptions[key];
                    const compDisplayName = compInfo.DisplayName || key;
                    const result = extractBaseNameAndSize(key, compDisplayName);
                    
                    // If this component has the same base name but different size
                    if (result.baseName === baseName && result.size !== size) {
                        sizeVariations.push({
                            key,
                            size: result.size,
                            isNumeric: result.isNumeric,
                            componentInfo: compInfo
                        });
                    }
                }
            });
        }
    }

    // Sort size variations by size
    sizeVariations.sort((a, b) => {
        // If both are numeric
        if (a.isNumeric && b.isNumeric) {
            return Number(a.size) - Number(b.size);
        }
        
        // If one is numeric and one is not
        if (a.isNumeric && !b.isNumeric) return 1;
        if (!a.isNumeric && b.isNumeric) return -1;
        
        // If neither is numeric, use the sizePrefixes order
        const sizePrefixes = ["Micro", "Mini", "Small", "Medium", "Large", "Tall"];
        return sizePrefixes.indexOf(a.size) - sizePrefixes.indexOf(b.size);
    });

    // Handle color selection
    const handleColorSelect = (key) => {
        // Update the selected component type in the context
        context.selectComponent(key);
    };

    // Handle size selection
    const handleSizeSelect = (key) => {
        // Update the selected component type in the context
        context.selectComponent(key);
    };

    // Get color from selected component
    const selectedColor = selectedComponentInfo ? 
        (selectedComponentInfo.DisplayName || context.selectedComponentType).split(', ').pop() : null;

    // Determine if the selected component has color in its name
    const hasColorInName = selectedColor && 
        ["Red", "Blue", "Green", "Yellow", "Black", "White", "Purple", "Orange", "Brown", "Gray", "Pink"].some(
            color => selectedColor.includes(color)
        );

    // Get size from selected component
    const { size: selectedSize, isNumeric: isSelectedSizeNumeric } = selectedComponentInfo ? 
        extractBaseNameAndSize(context.selectedComponentType, selectedComponentInfo.DisplayName || context.selectedComponentType) : 
        { size: null, isNumeric: false };

    // Format size for display
    const formatSizeForDisplay = (size, isNumeric) => {
        return isNumeric ? `Fits ${size}` : `${size} Size`;
    };

    // Prepare color options array outside of JSX
    const colorOptions = colorVariations.length > 0 ? [
        // Create an entry for the currently selected component
        {
            key: context.selectedComponentType,
            color: selectedColor,
            componentInfo: selectedComponentInfo
        },
        ...colorVariations
    ]
    // Remove duplicates by filtering out the selected component if it's already in colorVariations
    .filter((item, index, self) => 
        index === self.findIndex(t => t.key === item.key)
    )
    // Sort alphabetically by color name
    .sort((a, b) => {
        // Extract colors for comparison
        const colorA = a.color || '';
        const colorB = b.color || '';
        return colorA.localeCompare(colorB);
    }) : [];

    // Prepare size options array outside of JSX
    const sizeOptions = sizeVariations.length > 0 ? [
        // Include the currently selected component in the array
        { 
            key: context.selectedComponentType, 
            size: selectedSize, 
            isNumeric: isSelectedSizeNumeric 
        },
        ...sizeVariations
    ]
    // Remove duplicates by filtering out the selected component if it's already in sizeVariations
    .filter((item, index, self) => 
        index === self.findIndex(t => t.key === item.key)
    )
    .sort((a, b) => {
        // Extract sizes for comparison
        const sizeA = a.size || '';
        const sizeB = b.size || '';
        
        // If both sizes are numeric, compare them as numbers
        if (a.isNumeric && b.isNumeric) {
            return parseInt(sizeA) - parseInt(sizeB);
        }
        
        // If only one is numeric, prioritize non-numeric
        if (a.isNumeric && !b.isNumeric) return 1;
        if (!a.isNumeric && b.isNumeric) return -1;
        
        // Otherwise use string comparison
        return sizeA.localeCompare(sizeB);
    }) : [];

    const hasSelectedComponent = context.selectedComponentType !== undefined;

    if (!hasSelectedComponent) {
        return null;
    }

    return (
        <div className="create-component-name-row">
            <div className="chosen-component-preview">
                    
                <div className="chosen-component-image-container">
                    <p className="component-type-name-title">{selectedComponentInfo.DisplayName}</p>
                    <img className="chosen-component-image" src={selectedComponentInfo.PreviewUri} alt={selectedComponentInfo.DisplayName} />
                    <p className="component-type-name-subtitle">{isStock ? "Stock" : "Custom"} Component</p>
                </div>
            </div>
            <div className="chosen-component-settings">
                {colorVariations.length > 0 && (
                    <>
                        <p>Color</p>
                        <div className="color-options-grid">
                            {colorOptions.map((variation) => (
                                <button 
                                    key={variation.key} 
                                    className={`color-option-button ${context.selectedComponentType === variation.key ? 'selected-color-option' : ''}`}
                                    onClick={() => handleColorSelect(variation.key)}
                                    title={variation.color}
                                >
                                    <div className="color-option-content">
                                        {variation.componentInfo.PreviewUri ? (
                                            <img 
                                                src={variation.componentInfo.PreviewUri} 
                                                alt={variation.color}
                                                className="color-option-image"
                                            />
                                        ) : (
                                            <div 
                                                className="color-option-placeholder"
                                                style={{ backgroundColor: getColorValueHex(variation.color) }}
                                            >
                                                {variation.color?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
                
                {colorVariations.length === 0 && hasColorInName && (
                    <>
                        <p>Color</p>
                        <div className="btn btn-small btn-outline-primary">{selectedColor}</div>
                    </>
                )}
                
                {sizeVariations.length > 0 && (
                    <>
                        <p>Size</p>
                        <div className="size-options">
                            {sizeOptions.map((variation) => (
                                <button 
                                    key={variation.key} 
                                    className={`btn btn-small btn-outline-primary size-option-button ${context.selectedComponentType === variation.key ? 'selected-size-option' : ''}`}
                                    onClick={() => handleSizeSelect(variation.key)}
                                    title={formatSizeForDisplay(variation.size, variation.isNumeric)}
                                >
                                    {formatSizeForDisplay(variation.size, variation.isNumeric)}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="create-component-output-options">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text soft-label">Composition Name</span>
                    <input 
                        type="text" 
                        className="form-control no-left-border" 
                        onChange={(event) => context.setComponentName(event.target.value.replace(/[<>:"/\\|?*]/g, ''))} 
                        placeholder="Player Roles or Emperor Token, etc" 
                        value={context.componentName}
                    />
                </div>
                <button 
                        disabled={isCreateButtonDisabled}
                        className="btn btn-outline-primary create-component-button btn-block" 
                        type="button" 
                        id="button-addon1"
                        onClick={() => createComponent()}
                    >
                        {isProcessing && <span className="spinner-border spinner-border-sm creating-spinner"></span>}
                        Create
                    </button>
            </div>
        </div>
    );
};

export default ChosenComponent;
