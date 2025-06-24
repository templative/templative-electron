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
        <div className="render-controls-left">
            <div className="input-group input-group-sm render-input-group" data-bs-theme="dark">
                    <span className="input-group-text soft-label flex-grow-1">✂️ Cut to Border</span>
                    <div className="input-group-text soft-label no-left-border">
                        <input className="form-check-input mt-0 no-left-border" type="checkbox" value="" onChange={()=>{ renderingContext.toggleClipping()}} checked={renderingContext.isClipping} title="If true, hides the bleed area. Useful for printing."/>
                    </div>
                </div>
                <div className="input-group input-group-sm render-input-group" data-bs-theme="dark">
                    <button type="button" disabled={!hasComponents} className="btn btn-primary render-button" onClick={() => renderTemplativeProjectCallback()}>
                        Render {selectedComponent !== undefined ? selectedComponent : "All"}</button>
                </div>
        </div>
        <div className="render-controls-right">
            <TutorialQuestionMark tutorialName="Render a Project" />
        </div>
    </div>
}