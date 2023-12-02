import React from "react";
import "./GamedataViewer.css"
const fs = window.require("fs")

export default class KeyValueGamedataViewer extends React.Component {   
    state = {
        gamedataFile: Object.assign({}, this.props.fileContents),
        trackedKey: undefined,
        currentUpdateValue: undefined
    }
    componentDidUpdate(prevProps) {
        if (this.props.filename === prevProps.filename) {
          return;
        }
        this.saveDocument(prevProps.currentFilepath, this.state.gamedataFile)

        this.setState({
            gamedataFile: this.props.fileContents
        })
    }

    saveDocument(filepath, fileContents) {
        var newFileContents = JSON.stringify(fileContents, null, 4)
        // fs.writeFileSync(filepath, newFileContents, 'utf-8')
    }
    componentWillUnmount(){
        this.saveDocument(this.props.currentFilepath, this.state.gamedataFile)
    }
    addBlankKeyValuePair() {
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents[" "] = ""
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }
    
    updateValue(key, newValue) {
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents[key] = newValue
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }
    removeKeyValuePair(key) {
        var newGamedataFileContents = this.state.gamedataFile
        delete newGamedataFileContents[key]
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }
    trackChangedKey(key, value) {
        this.setState({
            trackedKey: key,
            currentUpdateValue: value
        })
    }
    updateKey(oldKey, newKey) {
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents[newKey] = newGamedataFileContents[oldKey]
        delete newGamedataFileContents[oldKey]
        this.setState({
            gamedataFile: newGamedataFileContents,
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
        var keys = Object.keys(this.state.gamedataFile)
        keys = keys.sort()
        var rows = keys.map((key) => {
            var isUndeleteable = key === "name" || key === "displayName"
            return <div className="input-group input-group-sm mb-3" data-bs-theme="dark" key={key}>
                <span className="input-group-text">🔒</span>
                { isUndeleteable ? 
                    <span className="input-group-text locked-key-text" id="basic-addon3">{key}</span>
                    :
                    <input type="text" className="form-control key-field" 
                        onChange={(event) => this.trackChangedKey(key, event.target.value)} 
                        onBlur={()=>this.freeTrackedChangedKey()}
                        aria-label="What key to get from the scope..." 
                        value={this.state.trackedKey === key ? this.state.currentUpdateValue : key}/>
                }
                
                <span className="input-group-text">🔑</span>
                <input type="text" className="form-control value-field" 
                    onChange={(event)=>this.updateValue(key, event.target.value)} 
                    aria-label="What key to get from the scope..." 
                    value={this.state.gamedataFile[key]}/>

                { !isUndeleteable &&
                    <button onClick={()=>this.removeKeyValuePair(key)} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">🗑️</button>
                }
                
          </div>
        });
        
        return <div className="row tableContainer">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
                </div>
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