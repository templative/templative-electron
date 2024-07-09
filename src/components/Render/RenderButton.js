import React from "react";
import langaugeInfo from "./languageOptions";
import "./RenderPanel.css"

export default class RenderButton extends React.Component {   
    render() {
        var languageOptions = langaugeInfo.map((language) => {
            return <option key={language.code} value={language.code}>{language.name}</option>
        })
        return <div className="render-controls">
                <div className="input-group input-group-sm render-input-group" data-bs-theme="dark">
                    <span className="input-group-text locked">🎙️</span>
                    <select disabled value={this.props.selectedLanguage} onChange={(language)=>{this.props.setLanguageCallback(language)}} className="form-select locked" id="inputGroupSelect01">
                        {languageOptions}
                    </select>
                    
                    <div className="input-group-text locked">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug bug-margin" viewBox="0 0 16 16">
                            <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
                        </svg>
                        <input disabled className="form-check-input mt-0 " type="checkbox" value="" onChange={()=>{ this.props.toggleDebugCallback()}} checked={this.props.isDebugRendering} />
                    </div>
                    {/* <span className="input-group-text">🔎</span>
                    <div className="input-group-text">
                        <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleComplexCallback()}} checked={this.props.isComplexRendering} aria-label="Checkbox for following text input"/>
                    </div> */}
                </div>
                <div className="input-group input-group-sm render-input-group" data-bs-theme="dark">
                    {/* <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span */}
                    <button type="button" className="btn btn-outline-secondary renderButton" onClick={() => this.props.renderTemplativeProjectCallback()}>
                        Render {this.props.selectedComponent !== undefined ? this.props.selectedComponent : "All"}</button>
                </div>
        </div>
    }
}