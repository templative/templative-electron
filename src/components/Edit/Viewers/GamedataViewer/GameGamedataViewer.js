import React from "react";
import KeyValueInput from "./KeyValueInput"
import EditableViewerJson from "../EditableViewerJson";
import "./GamedataViewer.css"
const ignoredControlGamedataKeys = [
    "name", "displayName", "quantity", "category", "longDescription", "shortDescription", "maxPlayers", "minPlayers", "minAge", "playTime", "version", "versionName", "coolFactors"
]
export default class GameGamedataViewer extends EditableViewerJson {   
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
        }, async () => this.autosave())
    }
    
    updateValue(key, newValue) {
        var newGamedataFileContents = this.state.content
        newGamedataFileContents[key] = newValue
        this.setState({
            content: newGamedataFileContents
        }, async () => this.autosave())
    }
    removeKeyValuePair(key) {
        var newGamedataFileContents = this.state.content
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
        var newGamedataFileContents = this.state.content
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

        var rows = []
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
                gamedataKey={key} value={this.state.content[key]} 
                trackedKey={this.state.trackedKey} currentUpdateValue={this.state.currentUpdateValue}
                trackChangedKeyCallback={(key, value) => this.trackChangedKey(key, value)}
                updateValueCallback={(key, value)=>this.updateValue(key, value)}
                removeKeyValuePairCallback={(key)=>this.removeKeyValuePair(key)}
                freeTrackedChangedKeyCallback={()=> this.freeTrackedChangedKey()}
            />
        });
        
        
        return <div className="tableContainer">
            <div className="vertical-input-group">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text">name</span>
                    <input type="text" className="form-control value-field" 
                        onKeyDown={GameGamedataViewer.preventSpaces}
                        onChange={(event)=> this.updateValue("name", event.target.value.replace(/\s/g, ""))} 
                        value={this.state.content["name"]}/>

                    <span className="input-group-text">displayName</span>
                    <input type="text" className="form-control value-field" 
                        onChange={(event)=>this.updateValue("displayName", event.target.value)} 
                        value={this.state.content["displayName"]}/>
                    <span className="input-group-text">category</span>
                        
                    <select value={this.state.content["category"]} onChange={(event)=>this.updateValue("category", event.target.value)} className="form-select scope-select">
                        <option value="Board Games">Board Games</option>
                        <option value="Card Games">Card Games</option>
                        <option value="Dice Games">Dice Games</option>
                        <option value="RPGs">RPGs</option>
                        <option value="War Games">War Games</option>
                    </select>
                        
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text">minAge</span>
                    <select value={this.state.content["minAge"]} onChange={(event)=>this.updateValue("minAge", event.target.value)} className="form-select scope-select">
                        <option value="12+">12+</option>
                        <option value="18+">18+</option>
                    </select>
                    <span className="input-group-text">playTime</span>
                    <select value={this.state.content["playTime"]} onChange={(event)=>this.updateValue("playTime", event.target.value)} className="form-select scope-select">
                        <option value="<30">{"<30"}</option>
                        <option value="30-60">30-60</option>
                        <option value="60-90">60-90</option>
                        <option value="90-120">90-120</option>
                        <option value=">120">{">120"}</option>
                    </select>
                    <span className="input-group-text">minPlayers</span>
                    <input type="number" className="form-control value-field" 
                        onKeyDown={GameGamedataViewer.preventSpaces}
                        onChange={(event)=> this.updateValue("minPlayers",event.target.value.toString())} 
                        value={this.state.content["minPlayers"]}/>

                    <span className="input-group-text">maxPlayers</span>
                    <input type="number" className="form-control value-field" 
                        onChange={(event)=>this.updateValue("maxPlayers", event.target.value.toString())} 
                        value={this.state.content["maxPlayers"]}/>
                </div>
            </div>
            <div className="vertical-input-group">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text">versionName</span>
                    <input type="text" className="form-control value-field" 
                        // onKeyDown={GameGamedataViewer.preventSpaces}
                        onChange={(event)=> this.updateValue("versionName", event.target.value)} 
                        value={this.state.content["versionName"]}/>

                    <span className="input-group-text">version</span>
                    <input type="text" className="form-control value-field" 
                        onChange={(event)=>this.updateValue("displayName", event.target.value)} 
                        aria-label="What key to get from the version..." 
                        value={this.state.content["version"]}/>
                </div>
            </div>
            <div className="vertical-input-group">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text">shortDescription</span>
                    <input type="text" className="form-control value-field" 
                        // onKeyDown={GameGamedataViewer.preventSpaces}
                        onChange={(event)=> this.updateValue("shortDescription", event.target.value)} 
                        value={this.state.content["shortDescription"]}/>
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text">longDescription</span>
                    <textarea rows={5} className="form-control value-field" 
                        // onKeyDown={GameGamedataViewer.preventSpaces}
                        onChange={(event)=> this.updateValue("longDescription",event.target.value)} 
                        value={this.state.content["longDescription"]}/>
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text">coolFactors (comma seperated)</span>
                    <input type="text" className="form-control value-field" 
                        // onKeyDown={GameGamedataViewer.preventSpaces}
                        onChange={(event)=> this.updateValue("coolFactors", event.target.value)} 
                        value={this.state.content["coolFactors"]}/>
                </div>
            </div>
            <div className="vertical-input-group">
                {rows}
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <button onClick={() => this.addBlankKeyValuePair()} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg add-field-plus" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Add Field to Game
                    </button>
                </div>
            </div>
        </div>
    }
}