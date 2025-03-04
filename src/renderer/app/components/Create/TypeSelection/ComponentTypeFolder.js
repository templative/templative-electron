import React from "react";
import ComponentType from "./ComponentType";
import StockComponentType from "./StockComponentType";
import ColorGroupedStockComponents from "./ColorGroupedStockComponents";
import { extractBaseNameAndColor } from "./ComponentTypeList";
import { allColorVariations } from "../../../../../shared/stockComponentColors";

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
                        
                        // Only create a color group if there are multiple components with the same base name
                        if (components.length > 1) {
                            return (
                                <ColorGroupedStockComponents
                                    key={`${groupKey}${this.props.search}`}
                                    baseName={baseName}
                                    components={components}
                                    selectTypeCallback={this.props.selectTypeCallback}
                                    selectedComponentType={this.props.selectedComponentType}
                                    search={this.props.search}
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
            // For non-stock components, keep the original behavior
            componentContent = (
                <>
                    {
                        this.props.filteredComponentTypes
                            .filter(key => !this.props.componentTypeOptions[key]["IsDisabled"] || 
                                          this.props.componentTypeOptions[key]["IsDisabled"] === undefined)
                            .map(key =>
                                <ComponentType key={key} 
                                    name={key} componentInfo={this.props.componentTypeOptions[key]}
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