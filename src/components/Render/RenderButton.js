import React from "react";
import langaugeInfo from "./languageOptions";
import "./RenderPanel.css"

export default class RenderButton extends React.Component {   
    render() {
        var languageOptions = langaugeInfo.map((language) => {
            return <option key={language.code} value={language.code}>{language.name}</option>
        })
        return <div>
                <div className="input-group input-group-sm mb-3 renderInputGroup" data-bs-theme="dark">
                    <span className="input-group-text">🎙️</span>
                    <select value={this.props.selectedLanguage} onChange={(language)=>{this.props.setLanguageCallback(language)}} className="form-select" id="inputGroupSelect01">
                        {languageOptions}
                    </select>
                    <span className="input-group-text">🪲</span>
                    <div className="input-group-text">
                        <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleDebugCallback()}} checked={this.props.isDebugRendering} aria-label="Checkbox for following text input" />
                    </div>
                    <span className="input-group-text">🔎</span>
                    <div className="input-group-text">
                        <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleComplexCallback()}} checked={this.props.isComplexRendering} aria-label="Checkbox for following text input"/>
                    </div>
                </div>
                <div className="input-group input-group-sm mb-3 renderInputGroup" data-bs-theme="dark">
                    {/* <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span */}
                    <button type="button" className="btn btn-outline-secondary renderButton" onClick={() => this.props.runTempaltiveCallback()}>
                        Render {this.props.selectedComponent !== undefined ? this.props.selectedComponent : "All"}</button>
                    
                </div>
        </div>
    }
}