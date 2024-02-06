import React from "react";

import "./GamedataViewer.css"
import Piece from "./Piece";

export default class PieceGamedataViewer extends React.Component {   
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

    saveDocumentAsync = async (filepath, fileContents) => {
        if (filepath.split('.').pop() !== "json") {
            console.log(`No saving this file as its not json ${filepath}`)
            return
        }
        var newFileContents = JSON.stringify(fileContents, null, 4)
        await this.props.saveFileAsyncCallback(filepath, newFileContents)
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
    componentWillUnmount = async () => {
        await this.saveDocumentAsync(this.props.currentFilepath, this.state.gamedataFile)
    }

    addBlankKeyValuePair = () => {
        var newGamedataFileContents = this.state.gamedataFile
        this.state.gamedataFile.forEach((element, index) => {
            newGamedataFileContents[index][""] = ""
        });
        
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }
    
    updateValue = (index, key, newValue) => {
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents[index][key] = newValue
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }
    removeKeyValuePairFromAllPieces = (key) => {
        var newGamedataFileContents = this.state.gamedataFile
        this.state.gamedataFile.forEach((element, index) => {
            delete newGamedataFileContents[index][key]
        });
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }
    trackChangedKey = (key, value) => {
        this.setState({
            trackedKey: key,
            currentUpdateValue: value
        })
    }
    updateKey = (oldKey, newKey) => {
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

    freeTrackedChangedKey = () => {
        if (this.state.trackedKey === undefined || this.state.currentUpdateValue === undefined) {
            return
        }
        this.updateKey(this.state.trackedKey, this.state.currentUpdateValue)
    }

    addPiece = () => {
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

    deletePiece = (index) => {
        var newGamedataFileContents = this.state.gamedataFile
        newGamedataFileContents.splice(index,1)
        this.setState({
            gamedataFile: newGamedataFileContents
        })
    }

    render() {
        var rows = this.state.gamedataFile.map((piece, index) => {
            return <Piece 
                key={index} 
                currentUpdateValue={this.state.currentUpdateValue}
                gamedataFile={this.state.gamedataFile} 
                trackedKey={this.state.trackedKey} 
                index={index} 
                piece={piece}
                addBlankKeyValuePairCallback={this.addBlankKeyValuePair}
                deletePieceCallback={this.deletePiece}
                trackChangedKeyCallback={this.trackChangedKey}
                updateValueCallback={this.updateValue}
                removeKeyValuePairFromAllPiecesCallback={this.removeKeyValuePairFromAllPieces}
                freeTrackedChangedKeyCallback={this.freeTrackedChangedKey}
            />
        })
        
        return <div className="row">
            <div className="col">
                <div className="row">
                    <div key="addPieceButton" className="input-group input-group-sm mb-3 add-piece-button" data-bs-theme="dark">
                        <button onClick={() => this.addPiece()} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">Create a new Piece</button>
                    </div>
                    <div className="vertical-input-group">
                        {rows}
                    </div> 
                </div> 
            </div> 
        </div> 
    }
}