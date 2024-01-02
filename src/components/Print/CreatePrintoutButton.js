import React from "react";
import "./PrintPanel.css"

export default class CreatePrintoutButton extends React.Component {   

    render() {
        return <div className='create-printout-button-container'>
            <div className="input-group input-group-sm printout-button-controls" data-bs-theme="dark">
                    <select value={this.props.size} onChange={(e)=>{this.props.setSizeCallback(e.target.value)}} className="form-select" id="inputGroupSelect01">
                        <option value="Letter">Letter</option>
                        <option value="Tabloid">Tabloid</option>
                    </select>
                    <span className="input-group-text">Include Back?</span>
                    <div className="input-group-text">
                        <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleIsBackIncludedCallback()}} checked={this.props.isBackIncluded} aria-label="Checkbox for following text input" />
                    </div>
                    <span className="input-group-text">Draw Margins?</span>
                    <div className="input-group-text">
                        <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleAreMarginsDrawnCallback()}} checked={this.props.areMarginsDrawn} aria-label="Checkbox for following text input"/>
                    </div>
                </div>
                <button disabled={this.props.isCreatingPrintout || !this.props.hasOutputDirectoryValue} type="button" className="btn btn-outline-secondary create-printout-button" onClick={() => this.props.createPrintoutCallback()}>{this.props.isCreatingPrintout ? "Creating Printout..." : "Create Printout"}</button>            
        </div>
    }
}