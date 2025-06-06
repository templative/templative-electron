import React, { useState } from "react";
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

    const toggleExtended = () => {
        setIsExtended(!isExtended);
    };

    const editComponent = () => {
        const filepath = path.join(templativeRootDirectoryPath, `component-compose.json#${componentName}`);
        changeTabsToEditAFileCallback("UNIFIED_COMPONENT", filepath);
    };

    const extendedChevron = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
        </svg>
    );

    const collapsedChevron = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
    );

    return (
        <div className="renderedComponent">
            <div className="component-output-header">
                <p className="rendered-component-title editable-output-component-title" onClick={editComponent}>
                    {componentName}
                    {componentType && 
                        <span className="rendered-component-type"> - {addSpaces(componentType)}</span>
                    }
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor" className="bi bi-pencil edit-component-output-icon" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </p>
                
                <div className="component-output-extension-chevron" onClick={toggleExtended}>
                    {isExtended ? extendedChevron : collapsedChevron}
                </div>
            </div>
            {isExtended && componentDirectories.map(dir => (
                <ComponentOutputDirectory 
                    key={dir}
                    componentDirectory={dir}
                    imageFiles={imageFiles[dir]}
                />
            ))}
        </div>
    );
}
