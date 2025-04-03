import React, { useContext } from "react";
import ComponentOutputContainer from "./ComponentOutputContainer";
import { OutputDirectoriesContext } from "../../../OutputDirectories/OutputDirectoriesProvider";
import { addSpaces } from "../../../../utility/addSpaces";

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
            
            {Object.entries(groupedComponents).length > 0 && (
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
            )}
        </React.Fragment>
    );
}