import React from "react";
import "./PrintPanel.css"
import TutorialQuestionMark from "../../../Tutorial/TutorialQuestionMark";
export default class CreatePrintoutButton extends React.Component {   

    render() {
        var buttonMessage = "Select an Output Directory"
        if (this.props.isCreating) {
            buttonMessage = "Creating Printout..."
        }
        else if (this.props.hasOutputDirectoryValue) {
            buttonMessage = "Create Printout"
        }
        return <div className="printout-controls-container">
            <div className='vertical-input-group printout-controls'>
            <div className="input-group input-group-sm printout-button-controls" data-bs-theme="dark">
                <select value={this.props.size} onChange={(e)=>{this.props.setSizeCallback(e.target.value)}} className="form-select printout-size-select" id="inputGroupSelect01">
                    <option value="LETTER">Letter</option>
                    <option value="TABLOID">Tabloid</option>
                    <option value="A0">A0</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="A3">A3</option>
                    <option value="A4">A4</option>
                    <option value="A5">A5</option>
                    <option value="LEGAL">Legal</option>
                </select>
                
            </div>
            <div className="input-group input-group-sm printout-button-controls" data-bs-theme="dark">
                <span className="input-group-text printout-flex-checkbox" title="When checked, the back of each component will be included in the printout." onClick={()=>{ this.props.toggleIsBackIncludedCallback()}}>Include the Back of Compositions?</span>
                <div className="input-group-text no-left-border">
                    <input className="form-check-input mt-0" title="When checked, the back of each component will be included in the printout." type="checkbox" value="" onChange={()=>{ this.props.toggleIsBackIncludedCallback()}} checked={this.props.isBackIncluded} aria-label="Checkbox for following text input" />
                </div>
                <span className="input-group-text soft-label">Draw Borders?</span>
                <div className="input-group-text soft-label no-left-border">
                    <input className="form-check-input mt-0 no-left-border" type="checkbox" value="" onChange={()=>{ this.props.toggleAreBordersDrawnCallback()}} checked={this.props.areBordersDrawn} aria-label="Checkbox for following text input"/>
                </div>
            </div>
            <div className="input-group input-group-sm printout-button-controls " data-bs-theme="dark">
                <button disabled={this.props.isCreatingPrintout || !this.props.hasOutputDirectoryValue} type="button" className="btn btn-primary create-printout-button" onClick={() => this.props.createPrintoutCallback()}>{buttonMessage}</button>            
            </div>
        </div>
        <TutorialQuestionMark tutorialName="Create a Print and Play" />
        </div>
    }
}