import React, { useState, useContext } from "react";
import ComponentOutputDirectory from "./ComponentOutputDirectory";
const path = require('path');
import { addSpaces } from "../../../../utility/addSpaces";

export default function ComponentOutputContainer({ 
    componentName, 
    componentType, 
    componentDirectories, 
    imageFiles,
    templativeRootDirectoryPath, 
    changeTabsToEditAFileCallback 
}) {
    const [isExtended, setIsExtended] = useState(true);
    const [rotationDegrees, setRotationDegrees] = useState(0);
    
    if (componentType.startsWith("STOCK_")) {
        return null;
    }
    
    const rotateAllImages = () => {
        console.log("rotateAllImages");
        setRotationDegrees((rotationDegrees + 90) % 360);
    }
    const toggleExtended = () => {
        setIsExtended(!isExtended);
    };

    const editComponent = () => {
        const filepath = path.join(templativeRootDirectoryPath, `component-compose.json#${componentName}`);
        changeTabsToEditAFileCallback("UNIFIED_COMPONENT", filepath);
    };

    const extendedChevron = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
        </svg>
    );

    const collapsedChevron = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
    );

    const rotateIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
    </svg>
    
    const editCompositionIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
    </svg>
    return (
        <div className="renderedComponent">
            <div className="component-output-header">
                <div className="component-output-header-left">
                <p className="rendered-component-title editable-output-component-title" >
                    {componentName}
                    {componentType && 
                        <span className="rendered-component-type"> {addSpaces(componentType)}</span>
                    }
                </p>
                </div>
                <div className="component-output-header-right">
                    <div className="" title="Rotate All Composition Images" onClick={rotateAllImages}>{rotateIcon}</div>
                    <div className="" title="Edit Composition" onClick={editComponent}>{editCompositionIcon}</div>
                    <div className="component-output-chevron" onClick={toggleExtended}>
                        {isExtended ? extendedChevron : collapsedChevron}
                    </div>
                </div>
            </div>
            {isExtended && componentDirectories.map(dir => (
                <ComponentOutputDirectory 
                    key={dir}
                    componentDirectory={dir}
                    imageFiles={imageFiles[dir]}
                    rotationDegrees={rotationDegrees}
                    componentType={componentType}
                />
            ))}
        </div>
    );
}
