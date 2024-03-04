import React from "react";
import KeyValueInput from "./KeyValueInput"
import EditableViewerJson from "../EditableViewerJson";
import "./GamedataViewer.css"

export default class KeyValueGamedataViewer extends EditableViewerJson {   
    state = {
        trackedKey: undefined,
        currentUpdateValue: undefined
    }
    getFilePath = (props) => {
        return props.filepath
    }
    
    addBlankKeyValuePair() {
        var newGamedataFileContents = this.state.content
        newGamedataFileContents[""] = ""
        this.setState({
            content: newGamedataFileContents
        })
    }
    
    updateValue(key, newValue) {
        var newGamedataFileContents = this.state.content
        newGamedataFileContents[key] = newValue
        this.setState({
            content: newGamedataFileContents
        })
    }
    removeKeyValuePair(key) {
        var newGamedataFileContents = this.state.content
        delete newGamedataFileContents[key]
        this.setState({
            content: newGamedataFileContents
        })
    }
    trackChangedKey(key, value) {
        this.setState({
            trackedKey: key,
            currentUpdateValue: value
        })
    }
    updateKey(oldKey, newKey) {
        var newGamedataFileContents = this.state.content
        newGamedataFileContents[newKey] = newGamedataFileContents[oldKey]
        delete newGamedataFileContents[oldKey]
        this.setState({
            content: newGamedataFileContents,
            trackedKey: undefined,
            currentUpdateValue: undefined
        })
    }
    freeTrackedChangedKey() {
        if (this.state.trackedKey === undefined) {
            return
        }
        this.updateKey(this.state.trackedKey, this.state.currentUpdateValue)
    }
    render() {
        var rows = []
        if (this.state.hasLoaded && this.state.content !== undefined) {
            var keys = Object.keys(this.state.content)
            keys = keys.sort()
            rows = keys.map((key) => {
                return <KeyValueInput 
                    key={key}
                    gamedataKey={key} value={this.state.content[key]} 
                    trackedKey={this.state.trackedKey} currentUpdateValue={this.state.currentUpdateValue}
                    trackChangedKeyCallback={(key, value) => this.trackChangedKey(key, value)}
                    updateValueCallback={(key, value)=>this.updateValue(key, value)}
                    removeKeyValuePairCallback={(key)=>this.removeKeyValuePair(key)}
                    freeTrackedChangedKeyCallback={()=> this.freeTrackedChangedKey()}
                />
            });
        }
        
        
        return <div className="row tableContainer">
            <div className="col">
                <div className="vertical-input-group">
                    {rows}
                    <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                        <button onClick={() => this.addBlankKeyValuePair()} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">➕</button>
                    </div>
                </div>
            </div>
        </div>
    }
}