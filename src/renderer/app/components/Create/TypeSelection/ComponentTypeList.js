import React, { useMemo } from "react";
import {componentTypeHasAllFilteredTags, matchesSearch} from "../TagFilter"
import ComponentTypeFolder from "./ComponentTypeFolder";
import ComponentType from "./ComponentType";
import StockComponentType from "./StockComponentType";
import ColorGroupedStockComponents from "./ColorGroupedStockComponents";
import SizeGroupedCustomComponent from "./SizeGroupedCustomComponent";
import noFileIcon from "../../Edit/noFileIcon.svg";
import { allColorVariations } from "../../../../../shared/stockComponentColors";

// Helper function to extract base name and color from component name
// For example: "Bug, Green" -> { baseName: "Bug", color: "Green" }
// Also handles cases with multiple commas like "Dice, D6, Red" -> { baseName: "Dice, D6", color: "Red" }
// And cases with measurements like "D6, 12mm, Green" -> { baseName: "D6, 12mm", color: "Green" }
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
const extractColorFromString = (str) => {
    const commaIndex = str.lastIndexOf(", ");
    if (commaIndex === -1) return { baseName: str, color: null };
    
    // Check if the part after the last comma is a color or contains a color
    const potentialColorPart = str.substring(commaIndex + 2); // +2 to skip ", "
    
    // Check if the potential color part contains a valid color from our list
    const containsValidColor = allColorVariations.some(color => 
        potentialColorPart.toLowerCase().includes(color.toLowerCase())
    );
    
    if (containsValidColor) {
        const baseName = str.substring(0, commaIndex);
        return { baseName: baseName, color: potentialColorPart };
    }
    
    // If it doesn't look like a valid color, return the whole name as baseName
    return { baseName: str, color: null };
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
    
    return prefixPart;
};

// Helper functions for extracting size information
import { extractBaseNameAndSize } from "./SizeGroupedCustomComponent";

const ComponentTypeList = ({ 
    componentTypeOptions,
    selectedTags,
    majorCategories,
    search,
    selectTypeCallback,
    selectedComponentType,
    isStock
}) => {   
    const { componentDivs, categoryToFilteredTypes } = useMemo(() => {
        // Track which components have already been assigned to a category
        const assignedComponents = new Set();
        const categoryTypes = {};

        // Process categories in order of majorCategories (priority order)
        majorCategories.forEach(category => {
            const filteredComponentTypes = Object.keys(componentTypeOptions)
                .filter((key) => {                
                    // Skip if this component is already assigned to a category
                    if (assignedComponents.has(key)) {
                        return false;
                    }
                    
                    const isMatchingTags = componentTypeHasAllFilteredTags(selectedTags, componentTypeOptions[key]["Tags"]);
                    const isMatchingCategory = componentTypeHasAllFilteredTags([category], componentTypeOptions[key]["Tags"]);
                    const isMatchingSearch = matchesSearch(search, key);
                    const isNotDisabled = !componentTypeOptions[key]["IsDisabled"] || componentTypeOptions[key]["IsDisabled"] === undefined;
                    
                    // If this component matches this category, mark it as assigned
                    if (isMatchingTags && isMatchingCategory && isMatchingSearch && isNotDisabled) {
                        assignedComponents.add(key);
                        return true;
                    }
                    
                    return false;
                })
                .sort();
                
            if (filteredComponentTypes.length > 0) {
                categoryTypes[category] = filteredComponentTypes;
            }
        });

        // Get all components that match search and filters but aren't in any category
        const uncategorizedKeys = Object.keys(componentTypeOptions)
            .filter((key) => {
                return !assignedComponents.has(key) && // Not already in a category
                    componentTypeHasAllFilteredTags(selectedTags, componentTypeOptions[key]["Tags"], majorCategories) &&
                    (!componentTypeOptions[key]["IsDisabled"] || componentTypeOptions[key]["IsDisabled"] === undefined) &&
                    matchesSearch(search, key);
            })
            .sort();
            
        let filteredDivs = [];
        
        if (isStock) {
            // Group components by base name only (ignoring color variations)
            const groupedComponents = {};
            
            uncategorizedKeys.forEach(key => {
                const { baseName, color } = extractBaseNameAndColor(key, componentTypeOptions[key]["DisplayName"]);
                
                // Only group if there's a color
                if (color) {
                    // Use just the baseName as the grouping key
                    // This ensures all color variations of the same component are grouped together
                    const groupKey = baseName;
                    
                    if (!groupedComponents[groupKey]) {
                        groupedComponents[groupKey] = [];
                    }
                    
                    groupedComponents[groupKey].push({
                        key,
                        color,
                        componentInfo: componentTypeOptions[key]
                    });
                } else {
                    // If no color, render as a regular component
                    filteredDivs.push(
                        <StockComponentType 
                            key={`${key}${search}`} 
                            name={key} 
                            componentInfo={componentTypeOptions[key]}
                            selectTypeCallback={selectTypeCallback}
                            selectedComponentType={selectedComponentType} 
                            existingQuantity={0}
                            search={search}    
                        />
                    );
                }
            });
            
            // Add grouped components to the filtered divs
            Object.entries(groupedComponents).forEach(([groupKey, components]) => {
                // Extract the actual base name (remove the prefix marker if present)
                const baseName = groupKey.includes('__') ? groupKey.split('__')[0] : groupKey;
                
                // Only create a color group if there are multiple components with the same base name
                if (components.length > 1) {
                    filteredDivs.push(
                        <ColorGroupedStockComponents
                            key={`${groupKey}${search}`}
                            baseName={baseName}
                            components={components}
                            selectTypeCallback={selectTypeCallback}
                            selectedComponentType={selectedComponentType}
                            search={search}
                        />
                    );
                } else if (components.length === 1) {
                    // If only one component with this base name, render it normally
                    const component = components[0];
                    filteredDivs.push(
                        <StockComponentType 
                            key={`${component.key}${search}`} 
                            name={component.key} 
                            componentInfo={component.componentInfo}
                            selectTypeCallback={selectTypeCallback}
                            selectedComponentType={selectedComponentType} 
                            existingQuantity={0}
                            search={search}    
                        />
                    );
                }
            });
        } else {
            // For non-stock components, group by size
            const groupedComponents = {};
            
            uncategorizedKeys.forEach(key => {
                const { baseName, size, isNumeric } = extractBaseNameAndSize(key, componentTypeOptions[key]["DisplayName"]);
                
                // Only group if there's a size
                if (size) {
                    // Use just the baseName as the grouping key
                    const groupKey = baseName;
                    
                    if (!groupedComponents[groupKey]) {
                        groupedComponents[groupKey] = [];
                    }
                    
                    groupedComponents[groupKey].push({
                        key,
                        size,
                        isNumeric,
                        componentInfo: componentTypeOptions[key]
                    });
                } else {
                    // If no size, render as a regular component
                    filteredDivs.push(
                        <ComponentType 
                            key={`${key}${search}`} 
                            name={key} 
                            componentInfo={componentTypeOptions[key]}
                            selectTypeCallback={selectTypeCallback}
                            selectedComponentType={selectedComponentType} 
                            existingQuantity={0}
                            search={search}    
                        />
                    );
                }
            });
            
            // Add grouped components to the filtered divs
            Object.entries(groupedComponents).forEach(([groupKey, components]) => {
                // Extract the actual base name (remove the prefix marker if present)
                const baseName = groupKey.includes('__') ? groupKey.split('__')[0] : groupKey;
                
                // Only create a size group if there are multiple components with the same base name
                if (components.length > 1) {
                    filteredDivs.push(
                        <SizeGroupedCustomComponent
                            key={`${groupKey}${search}`}
                            baseName={baseName}
                            components={components}
                            selectTypeCallback={selectTypeCallback}
                            selectedComponentType={selectedComponentType}
                            search={search}
                        />
                    );
                } else if (components.length === 1) {
                    // If only one component with this base name, render it normally
                    const component = components[0];
                    filteredDivs.push(
                        <ComponentType 
                            key={`${component.key}${search}`} 
                            name={component.key} 
                            componentInfo={component.componentInfo}
                            selectTypeCallback={selectTypeCallback}
                            selectedComponentType={selectedComponentType} 
                            existingQuantity={0}
                            search={search}    
                        />
                    );
                }
            });
        }

        return {
            componentDivs: filteredDivs,
            categoryToFilteredTypes: categoryTypes
        };
    }, [componentTypeOptions, selectedTags, majorCategories, search, selectTypeCallback, selectedComponentType, isStock]);

    const folders = useMemo(() => {
        return Object.entries(categoryToFilteredTypes).map(([category, filteredComponentTypes]) => {
            return <ComponentTypeFolder 
                key={category} 
                search={search} 
                selectTypeCallback={selectTypeCallback} 
                category={category} 
                selectedTags={selectedTags} 
                componentTypeOptions={componentTypeOptions} 
                selectedComponentType={selectedComponentType} 
                filteredComponentTypes={filteredComponentTypes}
                isStock={isStock}
            />
        });
    }, [categoryToFilteredTypes, search, selectTypeCallback, selectedTags, componentTypeOptions, selectedComponentType, isStock]);

    const isSearchTooNarrow = 
        folders.length === 0 && 
        componentDivs.length === 0 && 
        Object.keys(componentTypeOptions).length > 0 && 
        search.trim() !== "";

    return (
        <div className="component-type-list">
            {isSearchTooNarrow && <p className="no-results-message">Your search returned no results.</p>}
            {folders}
            {/* {folders.length !== 0 && <p>Other {folders.length}</p>}  */}
            {componentDivs}
            {(folders.length !== 0 || componentDivs.length !== 0) && 
                <div className="end-of-component-types-icon-container">
                    <img src={noFileIcon} className="end-of-component-types-icon"/>
                </div>
            }
        </div>
    );
};

export default React.memo(ComponentTypeList);