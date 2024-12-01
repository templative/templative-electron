import React from "react";
import EditableViewerJson from "./EditableViewerJson";
import "./SettingsViewer.css"

export default class SettingsViewer extends EditableViewerJson {       
    
    updateValue(key, newValue) {
        const newGamedataFileContents = { ...this.state.content }
        newGamedataFileContents[key] = newValue
        this.setState({
            content: newGamedataFileContents
        }, async () => this.autosave())
    }

    getFilePath = (props) => {
        return this.props.filepath
    }

    render() {
        if (!this.state.hasLoaded || this.state.content === undefined) {
            return null;
        }       
        
        return <React.Fragment><div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text">Is Git Enabled?</span>
                    
                <select value={this.state.content["isGitEnabled"] || "false"} onChange={(event)=>this.updateValue("isGitEnabled", event.target.value)} className="form-select scope-select">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
        </React.Fragment>
    }
}