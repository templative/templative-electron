import React, { useContext, useMemo } from "react";
import "./CreatePanel.css";
import { RenderingWorkspaceContext } from '../Render/RenderingWorkspaceProvider';
import "./ChosenComponent.css";
import { extractBaseNameAndSize, areColorVariations } from './TypeSelection/ComponentUtils';
import ColorOptions from './ColorOptions';
import SizeOptions from './SizeOptions';
import ComponentPreview from './ComponentPreview';

const ChosenComponent = ({ isProcessing, createComponent, componentTypeOptions, isToggledToComponents }) => {
    const context = useContext(RenderingWorkspaceContext);
    const isCreateButtonDisabled = isProcessing || context.componentName === "" || context.selectedComponentType === undefined;

    // Get the selected component info if available
    const selectedComponentInfo = context.selectedComponentType ? 
        componentTypeOptions[context.selectedComponentType] : null;

    // Find color variations if they exist
    const colorVariations = useMemo(() => {
        const variations = [];
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
                        
                        variations.push({
                            key,
                            color,
                            componentInfo: compInfo
                        });
                    }
                }
            });
        }
        return variations;
    }, [selectedComponentInfo, context.selectedComponentType, componentTypeOptions, isToggledToComponents]);

    // Find size variations if they exist
    const sizeVariations = useMemo(() => {
        const variations = [];
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
                            variations.push({
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
        variations.sort((a, b) => {
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

        return variations;
    }, [selectedComponentInfo, context.selectedComponentType, componentTypeOptions]);

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

    // Prepare color options array outside of JSX
    const colorOptions = useMemo(() => {
        if (colorVariations.length === 0) return [];

        return [
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
        });
    }, [colorVariations, context.selectedComponentType, selectedColor, selectedComponentInfo]);

    // Prepare size options array outside of JSX
    const sizeOptions = useMemo(() => {
        if (sizeVariations.length === 0) return [];

        return [
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
        });
    }, [sizeVariations, context.selectedComponentType, selectedSize, isSelectedSizeNumeric]);

    const hasSelectedComponent = context.selectedComponentType !== undefined;

    if (!hasSelectedComponent) {
        return null;
    }

    return (
        <div className="create-component-name-row">
            <div className="chosen-component-preview">
                <ComponentPreview selectedComponentInfo={selectedComponentInfo} />
            </div>
            <div className="chosen-component-settings">
                {/* Color options */}
                {colorVariations.length > 0 && (
                    <ColorOptions 
                        colorOptions={colorOptions} 
                        selectedComponentType={context.selectedComponentType}
                        handleColorSelect={handleColorSelect}
                    />
                )}
                
                {colorVariations.length === 0 && hasColorInName && (
                    <div className="single-color-display">
                        <p>Color</p>
                        <div className="btn btn-small btn-outline-primary">{selectedColor}</div>
                    </div>
                )}
                
                {/* Size options */}
                {sizeVariations.length > 0 && (
                    <SizeOptions 
                        sizeOptions={sizeOptions}
                        selectedComponentType={context.selectedComponentType}
                        handleSizeSelect={handleSizeSelect}
                    />
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
