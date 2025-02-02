import React, { useContext } from "react";
import ComponentOutputContainer from "./ComponentOutputContainer";
import { OutputDirectoriesContext } from "../../../OutputDirectories/OutputDirectoriesProvider";

const addSpaces = (str) => {
    return str
        .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
        .replace(/(\d+)(mm|cm)/g, '$1$2')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
        .trim();
};

export default function RenderedImages({ templativeRootDirectoryPath, changeTabsToEditAFileCallback }) {
    const { typeQuantities, groupedComponents } = useContext(OutputDirectoriesContext);


    return (
        <React.Fragment>
            <div className="component-count-list">
                {Object.keys(typeQuantities)
                    .sort((a, b) => a.localeCompare(b))
                    .map(type => (
                        <p key={type} className="component-count-list-item">
                            {typeQuantities[type]}x {addSpaces(type)} Pieces
                        </p>
                    ))
                }
            </div>
            
            {Object.entries(groupedComponents).length > 0 ? (
                Object.entries(groupedComponents).map(([name, data]) => (
                    <ComponentOutputContainer 
                        key={name} 
                        componentName={name}
                        componentType={data.type}
                        componentDirectories={data.directories}
                        imageFiles={data.imageFiles}
                        templativeRootDirectoryPath={templativeRootDirectoryPath}  
                        changeTabsToEditAFileCallback={changeTabsToEditAFileCallback}
                    />
                ))
            ) : (
                <div className="no-components-message">
                    No rendered components found
                </div>
            )}
        </React.Fragment>
    );
}