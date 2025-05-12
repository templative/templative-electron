import React, { useContext } from "react";
import ComponentTypeFolder from "./ComponentTypeFolder";
import NoFileIcon from "../../Edit/noFileIcon.svg?react";
import { RenderingWorkspaceContext } from "../../Render/RenderingWorkspaceProvider";

const ComponentTypeList = ({ 
    majorCategoryOrder,
    componentMajorCategories,
    typeInfo,
    search,
    unit,
    selectTypeCallback,
    selectedComponentType,
    isStock,
    isShowingTemplates=false,
    hasLoadedComponents
}) => {   
    const context = useContext(RenderingWorkspaceContext);

    const folders = majorCategoryOrder.map((category) => {
        const categoryInfo = componentMajorCategories[category];        
        return <ComponentTypeFolder 
            key={category} 
            unit={unit}
            hasLoadedComponents={hasLoadedComponents}
            search={search} 
            isShowingTemplates={isShowingTemplates}
            selectTypeCallback={selectTypeCallback} 
            category={category} 
            categoryInfo={categoryInfo} 
            selectedComponentType={selectedComponentType} 
            isStock={isStock}
        />
    })
    
    const hasSelectedComponent = context.selectedComponentType !== undefined;

    return (
        <div className={`component-type-picking-row ${hasSelectedComponent ? 'has-selected-component' : ''}`}>
            <div className="component-type-list">
                {folders}
                <div className="end-of-component-types-icon-container">
                    <NoFileIcon className="end-of-component-types-icon"/>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ComponentTypeList);