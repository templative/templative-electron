import React, { useContext, useState, useEffect } from "react";
import OutputExplorer from "./RenderedOutput/OutputExplorer"
import RenderButton from "./RenderControls/RenderButton"
import "./RenderPanel.css"
import { channels } from '../../../shared/constants';
const { ipcRenderer } = window.require('electron');
import { LoggedMessages } from "../SocketedConsole/LoggedMessages"
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativeAccessTools from "../TemplativeAccessTools";
import { RenderingWorkspaceContext } from "./RenderingWorkspaceProvider";
import { OutputDirectoriesContext } from "../OutputDirectories/OutputDirectoriesProvider";
const path = require("path");

export default function RenderPanel({ templativeRootDirectoryPath, templativeMessages, changeTabsToEditAFileCallback }) {  
    const renderingContext = useContext(RenderingWorkspaceContext);
    const outputContext = useContext(OutputDirectoriesContext);
    
    const [isDebugRendering, setIsDebugRendering] = useState(false);
    const [isComplexRendering, setIsComplexRendering] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [components, setComponents] = useState([]);

    useEffect(() => {
        const loadComponents = async () => {
            if (!templativeRootDirectoryPath) {
                return
            }
            try {
                const components = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(
                    templativeRootDirectoryPath, 
                    "component-compose.json"
                );
                setComponents(components);
            }
            catch (error) {
                if (error.code === "ENOENT") {
                    console.error("component-compose.json file does not exist. Please create the file and try again.")
                    setComponents([])
                    return
                }
                else if (error.code === "INVALID_JSON") {
                    console.error("Invalid component-compose.json file. Please fix the file and try again.")
                    setComponents([])
                    return
                }
                throw error
            }
        };

        loadComponents();
        trackEvent("view_renderPanel");
    }, [templativeRootDirectoryPath]);

    const selectDirectoryAsync = async (directory) => {
        const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(
            templativeRootDirectoryPath, 
            "game-compose.json"
        );
        const outputDirectory = path.join(
            templativeRootDirectoryPath, 
            gameCompose["outputDirectory"], 
            directory
        );

        // Find the directory object that matches this path
        const dirObj = outputContext.directories.find(d => 
            path.join(d.path, d.name) === outputDirectory
        );
        
        if (dirObj) {
            await outputContext.setSelectedOutputDirectory(dirObj);
        }
    };

    const toggleComponent = (componentName) => {
        if (renderingContext.selectedComponentFilter === componentName) {
            renderingContext.setSelectedComponentFilter(undefined);
            return;
        }
        renderingContext.setSelectedComponentFilter(componentName);
    };

    const renderTemplativeProject = async () => {
        const request = {
            isDebug: isDebugRendering,
            isComplex: isComplexRendering,
            componentFilter: renderingContext.selectedComponentFilter,
            language: selectedLanguage,
            directoryPath: templativeRootDirectoryPath,
        };
        
        renderingContext.setExportOptionIndex(0);
        setIsProcessing(true);
        trackEvent("render");
        
        await ipcRenderer.invoke(channels.TO_SERVER_PRODUCE_GAME, request);
    };

    const startResize = (e) => {
        const startX = e.clientX;
        const startWidth = renderingContext.renderControlsColumnWidth;
        const container = document.querySelector('.mainBody .row');
        
        setIsResizing(true);
        
        const doDrag = (e) => {
            const containerWidth = container.offsetWidth;
            const difference = e.clientX - startX;
            const newWidth = startWidth + (difference / containerWidth * 100);
            renderingContext.setRenderControlsColumnWidth(Math.min(Math.max(8, newWidth), 50));
        };

        const stopResize = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopResize);
    };

    const handleDirectoryDelete = (deletedPath) => {
        if (outputContext.selectedDirectory && 
            path.join(outputContext.selectedDirectory.path, outputContext.selectedDirectory.name) === deletedPath) {
            outputContext.setSelectedOutputDirectory(undefined);
        }
    };

    const componentDirectoryDivs = components
        .filter(component => !component.type.startsWith("STOCK_"))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((component) => (
            <div 
                onClick={() => toggleComponent(component.name)} 
                className={renderingContext.selectedComponentFilter === component.name 
                    ? "directory component-selected-for-rendering" 
                    : "directory"
                } 
                key={component.name}
            > 
                <p className="directory-item">{component.name}</p>
            </div>
        ));
    
    return (
        <div className='mainBody'>
            <div className="row render-panel-row g-0">
                <div 
                    className="col-xs-12 col-md-7 col-lg-6 col-xl-3 render-controls-column" 
                    style={{width: `${renderingContext.renderControlsColumnWidth}%`}}
                >
                    <div 
                        className={`resize-handle${isResizing ? ' active' : ''}`} 
                        onMouseDown={startResize}
                    />
                    <div className="component-filter-container">
                        <div className="header-wrapper">
                            <p className="resourcesHeader">Composition Filter</p>
                        </div>
                        <div className="component-filter-options">
                            {componentDirectoryDivs}
                        </div>
                        <RenderButton 
                            hasComponents={components.length > 0}
                            selectedComponent={renderingContext.selectedComponentFilter} 
                            selectedLanguage={selectedLanguage} 
                            isDebugRendering={isDebugRendering}
                            isComplexRendering={isComplexRendering}
                            toggleDebugCallback={() => setIsDebugRendering(!isDebugRendering)}
                            toggleComplexCallback={() => setIsComplexRendering(!isComplexRendering)}
                            renderTemplativeProjectCallback={renderTemplativeProject}
                            setLanguageCallback={(e) => setSelectedLanguage(e.target.value)}
                        />
                    </div>
                    <LoggedMessages 
                        templativeRootDirectoryPath={templativeRootDirectoryPath} 
                        messages={templativeMessages}
                    />
                    <RenderOutputOptions 
                        selectedDirectory={outputContext.selectedDirectory}
                        templativeRootDirectoryPath={templativeRootDirectoryPath} 
                        selectDirectoryAsyncCallback={selectDirectoryAsync}
                        onDirectoryDelete={handleDirectoryDelete}
                    />
                </div>  
                <div className="outputPanel">
                    <OutputExplorer 
                        changeTabsToEditAFileCallback={changeTabsToEditAFileCallback}
                        templativeRootDirectoryPath={templativeRootDirectoryPath} 
                        outputFolderPath={outputContext.selectedDirectory 
                            ? path.join(outputContext.selectedDirectory.path, outputContext.selectedDirectory.name)
                            : undefined
                        }
                    />
                </div>       
            </div>
        </div>
    );
}