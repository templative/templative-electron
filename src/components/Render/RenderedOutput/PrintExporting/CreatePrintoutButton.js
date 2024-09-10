import React from "react";
import "./PrintPanel.css"

export default class CreatePrintoutButton extends React.Component {   

    render() {
        var buttonMessage = "Select an Output Directory"
        if (this.props.isCreating) {
            buttonMessage = "Creating Printout..."
        }
        else if (this.props.hasOutputDirectoryValue) {
            buttonMessage = "Create Printout"
        }
        return <div className='vertical-input-group printout-controls'>
            <div className="input-group input-group-sm printout-button-controls" data-bs-theme="dark">
                <select value={this.props.size} onChange={(e)=>{this.props.setSizeCallback(e.target.value)}} className="form-select" id="inputGroupSelect01">
                    <option value="Letter">Letter</option>
                    <option value="Tabloid">Tabloid</option>
                </select>
                
            </div>
            <div className="input-group input-group-sm printout-button-controls" data-bs-theme="dark">
                <span className="input-group-text printout-flex-checkbox">Include Back?</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleIsBackIncludedCallback()}} checked={this.props.isBackIncluded} aria-label="Checkbox for following text input" />
                </div>
                {/* <span className="input-group-text">Draw Margins?</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleAreMarginsDrawnCallback()}} checked={this.props.areMarginsDrawn} aria-label="Checkbox for following text input"/>
                </div> */}
            </div>
            <div className="input-group input-group-sm printout-button-controls " data-bs-theme="dark">
                <button disabled={this.props.isCreatingPrintout || !this.props.hasOutputDirectoryValue} type="button" className="btn btn-outline-secondary create-printout-button" onClick={() => this.props.createPrintoutCallback()}>{buttonMessage}</button>            
            </div>
        </div>
    }
}