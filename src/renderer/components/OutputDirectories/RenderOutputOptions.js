import React, { useContext } from "react";
import "../Render/RenderPanel.css"
import "./OutputDirectories.css"
import RenderOutputOption from "./RenderOutputOption";
import { OutputDirectoriesContext } from './OutputDirectoriesProvider';

const RenderOutputOptions = () => {
    const { 
        directories, 
        directoryMetadata, 
        deleteOutputDirectory,
        selectedDirectory,
        setSelectedOutputDirectory 
    } = useContext(OutputDirectoriesContext);

    const handleDelete = async (directory) => {
        await deleteOutputDirectory(directory);
    };

    const handleSelect = async (directory) => {
        await setSelectedOutputDirectory(directory);
    };

    let outputDirectoryDivs = directories
        .filter(directory => directoryMetadata[directory.name])
        .map((directory) => {
            const metadata = directoryMetadata[directory.name];
            return <RenderOutputOption 
                key={directory.name}
                directory={directory}
                isSelected={selectedDirectory?.name === directory.name}
                gameDisplayName={metadata.gameDisplayName}
                componentFilter={metadata.componentFilter}
                versionName={metadata.versionName}
                versionNumber={metadata.versionNumber}
                timestamp={metadata.timestamp}
                onSelect={handleSelect}
                onDelete={handleDelete}
            />
        })
    outputDirectoryDivs = outputDirectoryDivs.reverse();

    return (
        <div className="render-output-options-container">
            <div className="header-wrapper">
                <p className="resourcesHeader">Rendered Output</p>
            </div>
            <div className="output-folder-options">
                {outputDirectoryDivs}
            </div>
        </div>
    );
}

export default RenderOutputOptions;