import React, { useState, useContext } from "react";
import path from "path"
import StudioGamedataViewer from "../Edit/Viewers/GamedataViewer/StudioGamedataViewer";
import GameGamedataViewer from "../Edit/Viewers/GamedataViewer/GameGamedataViewer";
import "./ProjectPanel.css"
import TheGameCrafterAdsView from "./TheGameCrafterAdsView";
import { RenderingWorkspaceContext } from "../Render/RenderingWorkspaceProvider";

function ProjectPanel({templativeRootDirectoryPath, saveFileAsyncCallback}) {       
    const { selectedProjectTab, setSelectedProjectTab } = useContext(RenderingWorkspaceContext);

    const tabs = [
        {
            name: "Game Content",
            component: <GameGamedataViewer 
            templativeRootDirectoryPath={templativeRootDirectoryPath} 
            filepath={path.join(templativeRootDirectoryPath, "game.json")} 
            saveFileAsyncCallback={saveFileAsyncCallback}
        />
        },
        {
            name: "Studio Content",
            component: <StudioGamedataViewer 
            templativeRootDirectoryPath={templativeRootDirectoryPath} 
            filepath={path.join(templativeRootDirectoryPath, "studio.json")} 
            saveFileAsyncCallback={saveFileAsyncCallback}
        />
        },
        {
            name: "TGC Ads",
            component: <TheGameCrafterAdsView templativeRootDirectoryPath={templativeRootDirectoryPath}/>
        }
    ]

    return <div className="project-panel">
        <div className="project-workspace">
            <div className="project-sidebar">
                {tabs.map((tab) => {
                    var isActive = selectedProjectTab === tab.name;
                    return <div key={tab.name} className={`project-sidebar-item ${isActive ? "active" : ""}`} onClick={() => setSelectedProjectTab(tab.name)}>{tab.name}</div>
                })}
            </div>
            <div className="project-content-container">
                {tabs.find((tab) => tab.name === selectedProjectTab)?.component}
            </div>
        </div>
    </div>

}

export default ProjectPanel;