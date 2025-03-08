import React from "react";
import StockComponentType from "./StockComponentType";
import ComponentType from "./ComponentType";
import { extractBaseNameAndColor, extractBaseNameAndSize, compareSizes } from "./ComponentUtils";

export default class ComponentTypeFolder extends React.Component { 
    state = {
        isExtended: true
    }  
   
    toggleExtended = () => {
        this.setState({isExtended: !this.state.isExtended})
    }
    
    render = () => {       
        const ComponentToRender = this.props.isStock ? StockComponentType : ComponentType;
        
        let componentContent;
        
        if (this.props.isStock) {
            // Group components by base name only (ignoring color variations)
            const groupedComponents = {};
            
            this.props.filteredComponentTypes
                .filter(key => !this.props.componentTypeOptions[key]["IsDisabled"] || 
                              this.props.componentTypeOptions[key]["IsDisabled"] === undefined)
                .forEach(key => {
                    const { baseName, color } = extractBaseNameAndColor(key, this.props.componentTypeOptions[key]["DisplayName"]);
                    
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
                            componentInfo: this.props.componentTypeOptions[key]
                        });
                    }
                });
                
            // Create the component content
            componentContent = (
                <>
                    {/* Render grouped components */}
                    {Object.entries(groupedComponents).map(([groupKey, components]) => {
                        // Extract the actual base name (remove the prefix marker if present)
                        const baseName = groupKey.includes('__') ? groupKey.split('__')[0] : groupKey;
                        
                        if (components.length > 1) {
                            // Use the first component as the representative for the group
                            const primaryComponent = components[0];
                            return (
                                <StockComponentType 
                                    key={`${primaryComponent.key}${this.props.search}`} 
                                    name={primaryComponent.key} 
                                    componentInfo={primaryComponent.componentInfo}
                                    selectTypeCallback={this.props.selectTypeCallback}
                                    selectedComponentType={this.props.selectedComponentType} 
                                    existingQuantity={0}
                                    search={this.props.search}
                                    colorVariations={components.slice(1)}  // Pass the other color variations
                                />
                            );
                        } else if (components.length === 1) {
                            // If only one component with this base name, render it normally
                            const component = components[0];
                            return (
                                <StockComponentType 
                                    key={component.key} 
                                    name={component.key} 
                                    componentInfo={component.componentInfo}
                                    selectTypeCallback={this.props.selectTypeCallback}
                                    selectedComponentType={this.props.selectedComponentType} 
                                    existingQuantity={0}
                                    search={this.props.search}    
                                />
                            );
                        }
                        return null;
                    })}
                    
                    {/* Render components without colors */}
                    {this.props.filteredComponentTypes
                        .filter(key => !this.props.componentTypeOptions[key]["IsDisabled"] || 
                                      this.props.componentTypeOptions[key]["IsDisabled"] === undefined)
                        .filter(key => {
                            const { color } = extractBaseNameAndColor(key, this.props.componentTypeOptions[key]["DisplayName"]);
                            return !color; // Only include components without a color
                        })
                        .map(key => (
                            <StockComponentType 
                                key={key} 
                                name={key} 
                                componentInfo={this.props.componentTypeOptions[key]}
                                selectTypeCallback={this.props.selectTypeCallback}
                                selectedComponentType={this.props.selectedComponentType} 
                                existingQuantity={0}
                                search={this.props.search}    
                            />
                        ))
                    }
                </>
            );
        } else {
            // For custom components, try to group by size and base name
            const groupedComponents = {};
            
            // First pass: collect all components with explicit sizes
            this.props.filteredComponentTypes
                .filter(key => !this.props.componentTypeOptions[key]["IsDisabled"] || 
                               this.props.componentTypeOptions[key]["IsDisabled"] === undefined)
                .forEach(key => {
                    const { baseName, size, isNumeric, isImplicitSize } = extractBaseNameAndSize(key, this.props.componentTypeOptions[key]["DisplayName"]);
                    
                    // Skip components with implicit size in the first pass
                    if (size && !isImplicitSize) {
                        // Create a normalized base name for grouping
                        // This will be used to match with components that don't have a size prefix
                        const normalizedBaseName = baseName.trim();
                        
                        if (!groupedComponents[normalizedBaseName]) {
                            groupedComponents[normalizedBaseName] = [];
                        }
                        
                        groupedComponents[normalizedBaseName].push({
                            key,
                            size,
                            isNumeric,
                            baseName: normalizedBaseName,
                            componentInfo: this.props.componentTypeOptions[key]
                        });
                    }
                });
            
            // Second pass: try to match components with implicit size to existing groups
            this.props.filteredComponentTypes
                .filter(key => !this.props.componentTypeOptions[key]["IsDisabled"] || 
                               this.props.componentTypeOptions[key]["IsDisabled"] === undefined)
                .forEach(key => {
                    const { baseName, size, isNumeric, isImplicitSize } = extractBaseNameAndSize(key, this.props.componentTypeOptions[key]["DisplayName"]);
                    
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
                                    componentInfo: this.props.componentTypeOptions[key]
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
                                componentInfo: this.props.componentTypeOptions[key]
                            });
                        }
                    }
                });
            
            componentContent = (
                <>
                    {/* Render grouped components by size */}
                    {Object.entries(groupedComponents).map(([groupKey, components]) => {
                        // Sort components by size
                        components.sort((a, b) => compareSizes(a.size, b.size));
                        
                        // Check if any component in this group is selected
                        const isAnyComponentSelected = components.some(comp => comp.key === this.props.selectedComponentType);
                        
                        // If a component in this group is selected, use that as the primary component
                        const selectedComponent = components.find(comp => comp.key === this.props.selectedComponentType);
                        const primaryComponent = isAnyComponentSelected ? selectedComponent : components[0];
                        
                        return (
                            <ComponentType 
                                key={`${primaryComponent.key}${this.props.search}`} 
                                name={primaryComponent.key} 
                                componentInfo={primaryComponent.componentInfo}
                                selectTypeCallback={this.props.selectTypeCallback}
                                selectedComponentType={this.props.selectedComponentType} 
                                existingQuantity={0}
                                search={this.props.search}
                                sizeVariations={components
                                    .filter(comp => comp.key !== primaryComponent.key) // Filter out the current component
                                    .map(comp => ({
                                        ...comp,
                                        baseName: groupKey
                                    }))}
                            />
                        );
                    })}
                    
                    {/* Render components without sizes */}
                    {this.props.filteredComponentTypes
                        .filter(key => !this.props.componentTypeOptions[key]["IsDisabled"] || 
                                      this.props.componentTypeOptions[key]["IsDisabled"] === undefined)
                        .filter(key => {
                            const { size } = extractBaseNameAndSize(key, this.props.componentTypeOptions[key]["DisplayName"]);
                            return !size; // Only include components without a size prefix
                        })
                        .map(key =>
                            <ComponentType 
                                key={key} 
                                name={key} 
                                componentInfo={this.props.componentTypeOptions[key]}
                                selectTypeCallback={this.props.selectTypeCallback}
                                selectedComponentType={this.props.selectedComponentType} 
                                existingQuantity={0}
                                search={this.props.search}    
                            />
                        )
                    }
                </>
            );
        }
        
        var folder = <div className="component-type-folder">
            <div className="component-type-header" onClick={this.toggleExtended}>
                <p className="rendered-component-title">{this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)}</p>
                <div className="component-output-extension-chevron">
                    {this.state.isExtended ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                        </svg>
                    }
                </div>
            </div>
            {this.state.isExtended && 
                <div className="component-output-content">
                    {componentContent}
                </div>
            }
        </div>
        return folder
            
    }
}