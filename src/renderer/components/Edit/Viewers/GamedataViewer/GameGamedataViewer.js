import React from "react";
import KeyValueInput from "./KeyValueInput"
import EditableViewerJson from "../EditableViewerJson";
import "./GamedataViewer.css"
const ignoredControlGamedataKeys = [
    "name", "quantity", "category", "longDescription", "shortDescription", "maxPlayers", "minPlayers", "minAge", "playTime", "version", "versionName", "coolFactors"
]
import FileLoadFailure  from "../FileLoadFailure";
export default class GameGamedataViewer extends EditableViewerJson {   
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
    static preventNonNumbers = (e) => {
        if (e.key === "Backspace" || e.key === "Tab") {
            return
        }
        if(/[0-9\b]/.test(e.key)) {
            return
        }
        e.preventDefault();
    }
    
    updateCoolFactors = (index, value) => {
        const coolFactors = Array.isArray(this.state.content["coolFactors"]) 
            ? [...this.state.content["coolFactors"]] 
            : ["", "", ""];
        
        coolFactors[index] = value.trim();
        this.updateValue("coolFactors", coolFactors);
    }
    
    render() {
        if (this.state.failedToLoad) {
            return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.state.filepath} errorMessage={this.state.errorMessage} />
        }
        if (!this.state.hasLoaded || this.state.content === undefined) {
            return null;
        }

        var rows = []
        if (Array.isArray(this.state.content)) {
            return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.state.filepath} errorMessage="It is not a valid Game Content file." />;
        }
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
        
        
        return <div className="tableContainer gamedata-viewer">
            <div className="vertical-input-group">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text input-group-text soft-label">name</span>
                    <input type="text" className="form-control value-field no-left-border" 
                        onChange={(event)=> this.updateValue("name", event.target.value.replace(/[<>:"/\\|?*]/g, ""))} 
                        value={this.state.content["name"]}/>
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">

                    <span className="input-group-text input-group-text soft-label">category</span>
                        
                    <select value={this.state.content["category"]} onChange={(event)=>this.updateValue("category", event.target.value)} className="form-select scope-select no-left-border">
                        <option value="Board Games">Board Games</option>
                        <option value="Card Games">Card Games</option>
                        <option value="Dice Games">Dice Games</option>
                        <option value="RPGs">RPGs</option>
                        <option value="War Games">War Games</option>
                    </select>
                        
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text input-group-text soft-label">minAge</span>
                    <select value={this.state.content["minAge"]} onChange={(event)=>this.updateValue("minAge", event.target.value)} className="form-select scope-select no-left-border">
                        <option value="12+">12+</option>
                        <option value="18+">18+</option>
                    </select>
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text input-group-text soft-label">playTime</span>
                    <select value={this.state.content["playTime"]} onChange={(event)=>this.updateValue("playTime", event.target.value)} className="form-select scope-select no-left-border">
                        <option value="<30">{"<30"}</option>
                        <option value="30-60">30-60</option>
                        <option value="60-90">60-90</option>
                        <option value="90-120">90-120</option>
                        <option value=">120">{">120"}</option>
                    </select>
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text input-group-text soft-label">minPlayers</span>
                    <input type="number" className="form-control value-field no-left-border" 
                        onChange={(event)=> this.updateValue("minPlayers",event.target.value.toString())} 
                        value={this.state.content["minPlayers"]}/>

                    <span className="input-group-text input-group-text soft-label">maxPlayers</span>
                    <input type="number" className="form-control value-field no-left-border" 
                        onChange={(event)=>this.updateValue("maxPlayers", event.target.value.toString())} 
                        value={this.state.content["maxPlayers"]}/>
                </div>
            </div>
            <div className="vertical-input-group">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text input-group-text soft-label">versionName</span>
                    <input type="text" className="form-control value-field no-left-border" 
                        onChange={(event)=> this.updateValue("versionName", event.target.value)} 
                        value={this.state.content["versionName"]}/>
                </div>
            </div>
            <div className="vertical-input-group">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text input-group-text soft-label">shortDescription</span>
                    <input type="text" className="form-control value-field no-left-border" 
                        onChange={(event)=> this.updateValue("shortDescription", event.target.value)} 
                        value={this.state.content["shortDescription"]}/>
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text input-group-text soft-label">longDescription</span>
                    <textarea rows={5} className="form-control value-field no-left-border" 
                        onChange={(event)=> this.updateValue("longDescription",event.target.value)} 
                        value={this.state.content["longDescription"]}/>
                </div>
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text input-group-text soft-label">Cool Factors</span>
                    {[0, 1, 2].map((index) => {
                        const coolFactors = Array.isArray(this.state.content["coolFactors"])
                            ? this.state.content["coolFactors"]
                            : ["", "", ""];
                        return (
                            <input 
                                key={index}
                                type="text" 
                                className={`form-control value-field ${index === 0 ? 'no-left-border' : ''}`}
                                onChange={(event) => this.updateCoolFactors(index, event.target.value)} 
                                value={coolFactors[index] || ""}
                                placeholder={`Factor ${index + 1}`}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="vertical-input-group">
                {rows}
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <button onClick={() => this.addBlankKeyValuePair()} className="btn btn-outline-secondary add-button" type="button" id="button-addon1" disabled={!this.state.hasLoaded}>
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