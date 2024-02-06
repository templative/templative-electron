import React from "react";
import KeyValueInput from "./KeyValueInput"

import "./GamedataViewer.css"

export default class KeyValueGamedataViewer extends React.Component {   
    state = {
        gamedataFile: this.props.fileContents,
        trackedKey: undefined,
        currentUpdateValue: undefined
    }
    componentDidUpdate = async (prevProps) => {
        if (this.props.currentFilepath === prevProps.currentFilepath) {
          return;
        }
        await this.saveDocumentAsync(prevProps.currentFilepath, this.state.gamedataFile)

        this.setState({
            gamedataFile: this.props.fileContents
        })
    }

    saveDocumentAsync = async (filepath, fileContents) =>  {
        var newFileContents = JSON.stringify(fileContents, null, 4)
        if (filepath.split('.').pop() !== "json") {
            console.log(`No saving this file as its not json ${filepath}`)
            return
        }
        await this.props.saveFileAsyncCallback(filepath, newFileContents)
    }
    componentWillUnmount = async () => {
        await this.saveDocumentAsync(this.props.currentFilepath, this.state.gamedataFile)
    }
    addBlankKeyValuePair() {
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents[""] = ""
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
            return <KeyValueInput 
                key={key}
                gamedataKey={key} value={this.state.gamedataFile[key]} 
                trackedKey={this.state.trackedKey} currentUpdateValue={this.state.currentUpdateValue}
                trackChangedKeyCallback={(key, value) => this.trackChangedKey(key, value)}
                updateValueCallback={(key, value)=>this.updateValue(key, value)}
                removeKeyValuePairCallback={(key)=>this.removeKeyValuePair(key)}
                freeTrackedChangedKeyCallback={()=> this.freeTrackedChangedKey()}
            />
        });
        
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