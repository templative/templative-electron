import React from "react";
import Piece from "./Piece";
import "./GamedataViewer.css"
import EditableViewerJson from "../EditableViewerJson";

export default class PieceGamedataViewer extends EditableViewerJson {   
    state = {
        trackedKey: undefined,
        currentUpdateValue: undefined
    }

    getFilePath = (props) => {
        return props.filepath
    }
    
    addBlankKeyValuePair = () => {
        var newContents = this.state.content
        this.state.content.forEach((element, index) => {
            newContents[index][""] = ""
        });
        
        this.setState({
            content: newContents
        })
    }
    
    updateValue = (index, key, newValue) => {
        var newContents = this.state.content
        newContents[index][key] = newValue
        this.setState({
            content: newContents
        })
    }
    removeKeyValuePairFromAllPieces = (key) => {
        var newContents = this.state.content
        this.state.content.forEach((element, index) => {
            delete newContents[index][key]
        });
        this.setState({
            content: newContents
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

        var newContents = this.state.content
        this.state.content.forEach((element, index) => {
            newContents[index][newKey] = newContents[index][oldKey] !== undefined ? newContents[index][oldKey] : ""
            delete newContents[index][oldKey]
        });
        
        this.setState({
            content: newContents,
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

        if (this.state.content.length > 0) {
            Object.keys(this.state.content[0]).forEach((key) => {
                newPiece[key] = key === "quantity" ? 1 : ""
            });
        }
        var newContents = this.state.content
        newContents.unshift(newPiece)
        this.setState({
            content: newContents
        })
    }

    deletePiece = (index) => {
        var newContents = this.state.content
        newContents.splice(index,1)
        this.setState({
            content: newContents
        })
    }

    render() {
        var rows = []
        if (this.state.hasLoaded && this.state.content !== undefined) {
            rows = this.state.content.map((piece, index) => {
                return <Piece 
                    key={index} 
                    currentUpdateValue={this.state.currentUpdateValue}
                    gamedataFile={this.state.content} 
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
        }
        
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