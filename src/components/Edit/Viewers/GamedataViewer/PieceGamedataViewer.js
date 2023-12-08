import React from "react";
import KeyValueInput from "./KeyValueInput"
import PieceControlInput from "./PieceControlInput"
import "./GamedataViewer.css"

const fs = window.require("fs")

const ignoredControlGamedataKeys = [
    "name", "displayName", "quantity"
]

export default class PieceGamedataViewer extends React.Component {   
    state = {
        gamedataFile: this.props.fileContents,
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
        if (filepath.split('.').pop() !== "json") {
            console.log(`No saving this file as its not json ${filepath}`)
            return
        }
        var newFileContents = JSON.stringify(fileContents, null, 4)
        fs.writeFileSync(filepath, newFileContents, 'utf-8')
    }
    jsToCsv(javascriptObject) {
        // https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
        const keys = Object.keys(javascriptObject[0])
        var csv = [
            keys.join(','),
            ...javascriptObject.map(row => keys.map(fieldName => row[fieldName]).join(','))
        ]
        csv = csv.join('\n')
        return csv
    }
    componentWillUnmount(){
        this.saveDocument(this.props.currentFilepath, this.state.gamedataFile)
    }

    addBlankKeyValuePair() {
        var newGamedataFileContents = this.state.gamedataFile
        this.state.gamedataFile.forEach((element, index) => {
            newGamedataFileContents[index][""] = ""
        });
        
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }
    
    updateValue(index, key, newValue) {
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents[index][key] = newValue
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }
    removeKeyValuePairFromAllPieces(key) {
        var newGamedataFileContents = this.state.gamedataFile
        this.state.gamedataFile.forEach((element, index) => {
            delete newGamedataFileContents[index][key]
        });
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
        console.log(`"${oldKey}"`, `"${newKey}"`)

        var newGamedataFileContents = this.state.gamedataFile
        this.state.gamedataFile.forEach((element, index) => {
            newGamedataFileContents[index][newKey] = newGamedataFileContents[index][oldKey] !== undefined ? newGamedataFileContents[index][oldKey] : ""
            delete newGamedataFileContents[index][oldKey]
        });
        
        this.setState({
            gamedataFile: newGamedataFileContents,
            trackedKey: undefined,
            currentUpdateValue: undefined
        })
    }

    freeTrackedChangedKey() {
        if (this.state.trackedKey === undefined || this.state.currentUpdateValue === undefined) {
            return
        }
        this.updateKey(this.state.trackedKey, this.state.currentUpdateValue)
    }

    addPiece() {
        var newPiece = { }

        if (this.state.gamedataFile.length > 0) {
            Object.keys(this.state.gamedataFile[0]).forEach((key) => {
                newPiece[key] = key === "quantity" ? 1 : ""
            });
        }
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents.unshift(newPiece)
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }

    deletePiece(index) {
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents.splice(index,1)
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }

    render() {
        var rows = this.state.gamedataFile.map((piece, index) => {
            var pieceKeys = Object.keys(piece).sort()
            var columns = pieceKeys
                .filter((key) => {
                    for(var c = 0; c < ignoredControlGamedataKeys.length; c++) {
                        if (key === ignoredControlGamedataKeys[c]) {
                            return false
                        }
                    };
                    return true
                }).map((key) => {
                    return <KeyValueInput 
                        key={key}
                        gamedataKey={key} value={this.state.gamedataFile[index][key]} 
                        trackedKey={this.state.trackedKey} currentUpdateValue={this.state.currentUpdateValue}
                        trackChangedKeyCallback={(key, value) => this.trackChangedKey(key, value)}
                        updateValueCallback={(key, value)=>this.updateValue(index, key, value)}
                        removeKeyValuePairCallback={(key)=>this.removeKeyValuePairFromAllPieces(key)}
                        freeTrackedChangedKeyCallback={()=> this.freeTrackedChangedKey()}
                    />
            });
            return <div className="row" key={index}>
                <PieceControlInput 
                    piece={this.state.gamedataFile[index]}
                    updateValueCallback={(key, value)=>this.updateValue(index, key, value)}
                    deleteCallback={() => this.deletePiece(index)}/>
                {columns}
                <div key="addBlankKeyValuePairButton" className="input-group input-group-sm mb-3 add-piece-key" data-bs-theme="dark">
                    <button onClick={() => this.addBlankKeyValuePair()} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">➕</button>
                </div>
            </div>
        })
        
        return <div className="row">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
                </div>
                <div className="row">
                    <div key="addPieceButton" className="input-group input-group-sm mb-3 add-piece-button" data-bs-theme="dark">
                        <button onClick={() => this.addPiece()} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">➕</button>
                    </div>
                    <div className="vertical-input-group">
                        {rows}
                    </div> 
                </div> 
            </div> 
        </div> 
    }
}