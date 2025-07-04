import React, { useContext } from "react";
import { RenderingWorkspaceContext } from "../RenderingWorkspaceProvider";
import TutorialQuestionMark from "../../Tutorial/TutorialQuestionMark";

export default function RenderButton({ 
    hasComponents, 
    selectedComponent,  
    renderTemplativeProjectCallback 
}) {
    const renderingContext = useContext(RenderingWorkspaceContext);
    return <div className="render-controls">
        <div className="input-group input-group-sm render-input-group" data-bs-theme="dark">
            <button 
                type="button" 
                disabled={!hasComponents} 
                className="btn btn-primary render-button" 
                onClick={() => renderTemplativeProjectCallback()}
            >
                Render {selectedComponent !== undefined ? selectedComponent : "All"}
            </button>
            <TutorialQuestionMark tutorialName="Render a Project" />
        </div>
    </div>
}