import React, { useMemo, useContext } from "react";
import {componentTypeHasAllFilteredTags, matchesSearch} from "../TagFilter"
import ComponentTypeFolder from "./ComponentTypeFolder";
import ComponentType from "./ComponentType";
import StockComponentType from "./StockComponentType";
import { extractBaseNameAndSize, compareSizes, extractBaseNameAndColor } from "./ComponentUtils";
import noFileIcon from "../../Edit/noFileIcon.svg";
import { RenderingWorkspaceContext } from "../../Render/RenderingWorkspaceProvider";

const ComponentTypeList = ({ 
    componentTypeOptions,
    selectedTags,
    majorCategories,
    search,
    selectTypeCallback,
    selectedComponentType,
    isStock,
    isShowingTemplates=false
}) => {   
    const context = useContext(RenderingWorkspaceContext);
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
                
                if (components.length > 1) {
                    // Use the first component as the representative for the group
                    const primaryComponent = components[0];
                    filteredDivs.push(
                        <StockComponentType 
                            key={`${primaryComponent.key}${search}`} 
                            name={primaryComponent.key} 
                            componentInfo={primaryComponent.componentInfo}
                            selectTypeCallback={selectTypeCallback}
                            selectedComponentType={selectedComponentType} 
                            existingQuantity={0}
                            search={search}
                            colorVariations={components.slice(1)}  // Pass the other color variations
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
            // For non-stock components, group by size and base name
            const groupedComponents = {};
            
            // First pass: collect all components with explicit sizes
            uncategorizedKeys.forEach(key => {
                const { baseName, size, isNumeric, isImplicitSize } = extractBaseNameAndSize(key, componentTypeOptions[key]["DisplayName"]);
                
                // Skip components with implicit size in the first pass
                if (size && !isImplicitSize) {
                    // Create a normalized base name for grouping
                    const normalizedBaseName = baseName.trim();
                    
                    if (!groupedComponents[normalizedBaseName]) {
                        groupedComponents[normalizedBaseName] = [];
                    }
                    
                    groupedComponents[normalizedBaseName].push({
                        key,
                        size,
                        isNumeric,
                        baseName: normalizedBaseName,
                        componentInfo: componentTypeOptions[key]
                    });
                }
            });

            // Second pass: try to match components with implicit size to existing groups
            uncategorizedKeys.forEach(key => {
                const { baseName, size, isNumeric, isImplicitSize } = extractBaseNameAndSize(key, componentTypeOptions[key]["DisplayName"]);
                
                // Only process components with implicit size in the second pass
                if (size && isImplicitSize) {
                    // Try to find a matching group by checking if this component's name matches any existing group's base name
                    let matched = false;
                    
                    // Check if this component's name (without any prefix) matches any group's base name
                    for (const [groupKey, components] of Object.entries(groupedComponents)) {
                        // If the component name is the same as the group's base name, it's a match
                        if (key === groupKey || baseName === groupKey) {
                            components.push({
                                key,
                                size,
                                isNumeric,
                                isImplicitSize,
                                baseName: groupKey, // Use the group's base name for consistency
                                componentInfo: componentTypeOptions[key]
                            });
                            matched = true;
                            break;
                        }
                    }
                    
                    // If no match was found, create a new group
                    if (!matched) {
                        const normalizedBaseName = baseName.trim();
                        if (!groupedComponents[normalizedBaseName]) {
                            groupedComponents[normalizedBaseName] = [];
                        }
                        
                        groupedComponents[normalizedBaseName].push({
                            key,
                            size,
                            isNumeric,
                            isImplicitSize,
                            baseName: normalizedBaseName,
                            componentInfo: componentTypeOptions[key]
                        });
                    }
                }
            });

            // Handle components without any size
            uncategorizedKeys.forEach(key => {
                const { baseName, size } = extractBaseNameAndSize(key, componentTypeOptions[key]["DisplayName"]);
                
                if (!size) {
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
                            isShowingTemplates={isShowingTemplates}
                        />
                    );
                }
            });

            // Add grouped components to the filtered divs
            Object.entries(groupedComponents).forEach(([groupKey, components]) => {
                // Sort components by size
                components.sort((a, b) => compareSizes(a.size, b.size));
                
                // Check if any component in this group is selected
                const isAnyComponentSelected = components.some(comp => comp.key === selectedComponentType);
                
                // If a component in this group is selected, use that as the primary component
                const selectedComponent = components.find(comp => comp.key === selectedComponentType);
                const componentToUse = isAnyComponentSelected ? selectedComponent : components[0];
                
                filteredDivs.push(
                    <ComponentType 
                        key={`${componentToUse.key}${search}`} 
                        name={componentToUse.key} 
                        componentInfo={componentToUse.componentInfo}
                        selectTypeCallback={selectTypeCallback}
                        selectedComponentType={selectedComponentType} 
                        existingQuantity={0}
                        search={search}
                        isShowingTemplates={isShowingTemplates}
                        sizeVariations={components
                            .filter(comp => comp.key !== componentToUse.key) // Filter out the current component
                            .map(comp => ({
                                ...comp,
                                baseName: groupKey
                            }))}
                    />
                );
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
                isShowingTemplates={isShowingTemplates}
                selectTypeCallback={selectTypeCallback} 
                category={category} 
                selectedTags={selectedTags} 
                componentTypeOptions={componentTypeOptions} 
                selectedComponentType={selectedComponentType} 
                filteredComponentTypes={filteredComponentTypes}
                isStock={isStock}
            />
        });
    }, [categoryToFilteredTypes, search, selectTypeCallback, selectedTags, componentTypeOptions, selectedComponentType, isStock, isShowingTemplates]);

    const isSearchTooNarrow = 
        folders.length === 0 && 
        componentDivs.length === 0 && 
        Object.keys(componentTypeOptions).length > 0 && 
        search.trim() !== "";

    const hasSelectedComponent = context.selectedComponentType !== undefined;

    return (
        <div className={`component-type-picking-row ${hasSelectedComponent ? 'has-selected-component' : ''}`}>
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
        </div>
    );
};

export default React.memo(ComponentTypeList);