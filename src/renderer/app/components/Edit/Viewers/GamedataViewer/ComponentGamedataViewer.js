import React from "react";
import KeyValueInput from "./KeyValueInput"
import EditableViewerJson from "../EditableViewerJson";
import "./GamedataViewer.css"
const ignoredControlGamedataKeys = [
    "displayName"
]
export default class ComponentGamedataViewer extends EditableViewerJson {   
    state = {
        trackedKey: undefined,
        currentUpdateValue: undefined
    }
    getFilePath = (props) => {
        return props.filepath
    }
    
    addBlankKeyValuePair() {
        const newGamedataFileContents = { ...this.state.content }
        newGamedataFileContents[""] = ""
        this.setState({
            content: newGamedataFileContents
        }, async () => this.autosave())
    }
    
    updateValue(key, newValue) {
        const newGamedataFileContents = { ...this.state.content }
        newGamedataFileContents[key] = newValue
        this.setState({
            content: newGamedataFileContents
        }, async () => this.autosave())
    }
    removeKeyValuePair(key) {
        const newGamedataFileContents = { ...this.state.content }
        delete newGamedataFileContents[key]
        this.setState({
            content: newGamedataFileContents
        }, async () => this.autosave())
    }
    trackChangedKey(key, value) {
        this.setState({
            trackedKey: key,
            currentUpdateValue: value
        })
    }
    updateKey(oldKey, newKey) {
        const newGamedataFileContents = { ...this.state.content }
        newGamedataFileContents[newKey] = newGamedataFileContents[oldKey]
        delete newGamedataFileContents[oldKey]
        this.setState({
            content: newGamedataFileContents,
            trackedKey: undefined,
            currentUpdateValue: undefined
        }, async () => this.autosave())
    }
    freeTrackedChangedKey() {
        if (this.state.trackedKey === undefined) {
            return
        }
        this.updateKey(this.state.trackedKey, this.state.currentUpdateValue)
    }
    
    static preventSpaces = (e) => {
        if (/[\s]/.test(e.key)) {
            e.preventDefault();
        }
    }
    static preventCommas = (e) => {
        if (/,/.test(e.key)) {
            e.preventDefault();
        }
    }
    static preventNonNumbers = (e) => {
        if (e.key === "Backspace" || e.key === "Tab") {
            return
        }
        if(/[0-9\b]/.test(e.key)) {
            return
        }
        e.preventDefault();
    }
    
    static updateCoolFactors = (index, value) => {
        
    }
    
    render() {
        if (!this.state.hasLoaded || this.state.content === undefined) {
            return null;
        }

        var rows = [];
        var keys = Object.keys(this.state.content)
        keys = keys.sort()
        keys = keys.filter((key) => {
            for(var c = 0; c < ignoredControlGamedataKeys.length; c++) {
                if (key === ignoredControlGamedataKeys[c]) {
                    return false
                }
            };
            return true
        })
        rows = keys.map((key) => {
            return <KeyValueInput 
                key={key}
                hasLockPotential={false}
                gamedataKey={key} 
                value={this.state.content[key]} 
                trackedKey={this.state.trackedKey} 
                currentUpdateValue={this.state.currentUpdateValue}
                trackChangedKeyCallback={(key, value) => this.trackChangedKey(key, value)}
                updateValueCallback={(key, value)=>this.updateValue(key, value)}
                removeKeyValuePairCallback={(key)=>this.removeKeyValuePair(key)}
                freeTrackedChangedKeyCallback={()=> this.freeTrackedChangedKey()}
            />
        });
        
        return <div className="tableContainer">
            <div className="vertical-input-group">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text soft-label">displayName</span>
                    <input type="text" className="form-control value-field no-left-border" 
                        onChange={(event)=>this.updateValue("displayName", event.target.value)} 
                        value={this.state.content["displayName"]}/>                            
                </div>
                {rows}
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <button onClick={() => this.addBlankKeyValuePair()} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg add-field-plus" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Add Field to Component
                    </button>
                </div>
            </div>
        </div>
    }
}