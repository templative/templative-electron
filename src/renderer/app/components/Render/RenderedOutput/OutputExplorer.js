import React, { useContext } from "react";
import "./OutputExplorer.css"
import PrintPanel from "./PrintExporting/PrintPanel";
import UploadPanel from "./Upload/UploadPanel";
import SimulatorPanel from "./Simulator/SimulatorPanel"
import PlaygroundPanel from "./Playground/PlaygroundPanel";
import RenderedImages from "./RenderedImages/RenderedImages";
import RulesViewer from "./Rules/RulesViewer";
import { PostRenderOptions, RenderingWorkspaceContext } from "../RenderingWorkspaceProvider";
import { OutputDirectoriesContext } from "../../OutputDirectories/OutputDirectoriesProvider";
const {shell} = require('electron')
const path = require('path');

export default function OutputExplorer({ outputFolderPath, templativeRootDirectoryPath, changeTabsToEditAFileCallback }) {
    const renderingContext = useContext(RenderingWorkspaceContext);
    const { 
        directoryMetadata,
        renderProgress,
        typeQuantities,
        uploadComponents,
        gameCrafterUrl,
        gameJsonFile
    } = useContext(OutputDirectoriesContext);
    
    const metadata = outputFolderPath 
        ? directoryMetadata[path.basename(outputFolderPath)] || {}
        : {};

    const openGameCrafterFolder = () => {
        shell.openPath(path.join(templativeRootDirectoryPath, "gamecrafter"));
    }

    const outputName = outputFolderPath 
        ? outputFolderPath.split(path.sep).pop() 
        : "";

    const percentageDone = (renderProgress.done / renderProgress.total) * 100;
    const style = { "width": `${percentageDone}%` };

    const views = [
        <RenderedImages 
            templativeRootDirectoryPath={templativeRootDirectoryPath}
            changeTabsToEditAFileCallback={changeTabsToEditAFileCallback}
        />,
        <RulesViewer outputFolderPath={outputFolderPath} />,
        <SimulatorPanel 
            templativeRootDirectoryPath={templativeRootDirectoryPath}  
            outputFolderPath={outputFolderPath} 
            changeTabsToEditAFileCallback={changeTabsToEditAFileCallback}
        />,
        <PlaygroundPanel 
            templativeRootDirectoryPath={templativeRootDirectoryPath}  
            outputFolderPath={outputFolderPath} 
            changeTabsToEditAFileCallback={changeTabsToEditAFileCallback}
        />,
        <PrintPanel 
            templativeRootDirectoryPath={templativeRootDirectoryPath}  
            outputFolderPath={outputFolderPath}
        />,
        <UploadPanel 
            templativeRootDirectoryPath={templativeRootDirectoryPath}  
            outputFolderPath={outputFolderPath} 
            changeTabsToEditAFileCallback={changeTabsToEditAFileCallback}
            gameJsonFile={gameJsonFile}
            gameCrafterUrl={gameCrafterUrl}
            uploadComponents={uploadComponents}
            openFolder={openGameCrafterFolder}
        />
    ];
    
    return (
        <React.Fragment>
            <div className="row render-progress-row">
                <div className="col">
                    {outputName && (
                        <>
                            <div className="output-header-container">
                                <p className="output-folder-name">{metadata.gameDisplayName}</p>
                                <p className="output-folder-version-info">- {metadata.versionName}</p>
                                <p className="output-folder-version-info">v{metadata.versionNumber}</p>
                                <p className="output-folder-component-filter">{metadata.componentFilter}</p>
                                {metadata.timestamp && 
                                    <p className="outputFolderName output-folder-date">{metadata.timestamp}</p>
                                }
                            </div>
                        
                            {percentageDone < 100 ? (
                                <div className="progress render-progress-bar-outer">
                                    <div 
                                        className={`progress-bar render-progress-bar-inner ${
                                            percentageDone !== 100 && "progress-bar-striped progress-bar-animated"
                                        }`} 
                                        role="progressbar" 
                                        style={style}
                                        aria-valuenow={percentageDone.toString()} 
                                        aria-valuemin="0" 
                                        aria-valuemax="100"
                                    />
                                </div>
                            ) : (
                                <div className="post-render-options">
                                    {PostRenderOptions.map((option, index) => (
                                        <p 
                                            key={`tab-${option}`}
                                            className={renderingContext.exportOptionIndex === index ? "selected-post-render-option" : ""}
                                            onClick={() => renderingContext.setExportOptionIndex(index)}
                                        >
                                            {option}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="row render-output-row">
                <div className="col">
                    {views[renderingContext.exportOptionIndex]}
                </div>
            </div>
        </React.Fragment>
    );
}