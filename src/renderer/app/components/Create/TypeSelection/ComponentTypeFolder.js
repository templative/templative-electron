import React, { useState } from "react";
import StockComponentType from "./StockComponentType";
import ComponentType from "./ComponentType";
import { Color } from "three";

const ComponentTypeFolder = ({
    search, 
    isShowingTemplates,
    selectTypeCallback, 
    category, 
    categoryInfo, 
    selectedComponentType, 
    isStock
}) => {
    const [isExtended, setIsExtended] = useState(true);
    
    const toggleExtended = () => {
        setIsExtended(!isExtended);
    };
    const ComponentToRender = ComponentType//isStock ? StockComponentType : ComponentType;
    
    // Create the component content
    const components = Object.entries(categoryInfo).map(([baseName, componentInfo]) => 
        <ComponentToRender
            key={baseName}
            isStock={isStock}
            name={baseName}
            componentInfo={componentInfo}
            selectTypeCallback={(selectedBaseComponent, selectedSize, selectedColor, selectedType) => selectTypeCallback(category, selectedBaseComponent, selectedSize, selectedColor, selectedType)}
            selectedComponentType={selectedComponentType}
            existingQuantity={0}
            isShowingTemplates={isShowingTemplates || false}
            search={search}
        />
    ).filter(component => component != null);
    if (components.length === 0) {
        // No matching the search
        return null;
    }
    const extendedChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
    </svg>
    const collapsedChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
    </svg>
    
    return (
        <div className="component-type-folder">
            <div className="component-type-header" onClick={toggleExtended}>
                <p className="rendered-component-title">{category}</p>
                <div className="component-output-extension-chevron">
                    {isExtended ? extendedChevron : collapsedChevron}
                </div>
            </div>
            {isExtended && 
                <div className="component-output-content">
                    {components}
                </div>
            }
        </div>
    );
};

export default ComponentTypeFolder;