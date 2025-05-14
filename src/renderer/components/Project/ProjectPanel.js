import React from "react";
import path from "path"
import StudioGamedataViewer from "../Edit/Viewers/GamedataViewer/StudioGamedataViewer";
import GameGamedataViewer from "../Edit/Viewers/GamedataViewer/GameGamedataViewer";
import "./ProjectPanel.css"
function ProjectPanel({templativeRootDirectoryPath, saveFileAsyncCallback}) {       
    
    return <div className="project-panel">
        <div className="project-content-container">
            <h1>Project</h1>
            <div className="project-content-container-section">
                <p>My Game</p>
                <GameGamedataViewer 
                    templativeRootDirectoryPath={templativeRootDirectoryPath} 
                    filepath={path.join(templativeRootDirectoryPath, "game.json")} 
                    saveFileAsyncCallback={saveFileAsyncCallback}
                />
                <p>My Studio</p>
                <StudioGamedataViewer 
                    templativeRootDirectoryPath={templativeRootDirectoryPath} 
                    filepath={path.join(templativeRootDirectoryPath, "studio.json")} 
                    saveFileAsyncCallback={saveFileAsyncCallback}
                />
                {/* <p>My Compositions</p> */}
            </div>
        </div>
    </div>

}

export default ProjectPanel;