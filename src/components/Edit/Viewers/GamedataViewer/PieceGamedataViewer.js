import React from "react";
import Piece from "./Piece";
import "./GamedataViewer.css"
import EditableViewerJson from "../EditableViewerJson";

export default class PieceGamedataViewer extends EditableViewerJson {   
    state = {
        trackedKey: undefined,
        currentUpdateValue: undefined,
        lockedKey: undefined
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
        }, async () => this.autosave())
    }
    
    updateValue = (index, key, newValue) => {
        var newContents = this.state.content
        newContents[index][key] = newValue
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }
    removeKeyValuePairFromAllPieces = (key) => {
        var newContents = this.state.content
        this.state.content.forEach((element, index) => {
            delete newContents[index][key]
        });
        this.setState({
            content: newContents
        }, async () => this.autosave())
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
        }, async () => this.autosave())
    }

    freeTrackedChangedKey = () => {
        if (this.state.trackedKey === undefined || this.state.currentUpdateValue === undefined) {
            return
        }
        if (this.state.lockedKey !== undefined && this.state.trackedKey === this.state.lockedKey) {
            this.setState({lockedKey: this.state.currentUpdateValue})
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
        }, async () => this.autosave())
    }
    duplicatePieceByIndex = (index) => {
        var duplicate = Object.assign({},this.state.content[index])
        do {
            duplicate["name"] = duplicate["name"] + "_copy"
            var hasName = false
            for (let index = 0; index < this.state.content.length; index++) {
                const element = this.state.content[index];
                if (duplicate["name"] === element["name"]) {
                    hasName = true
                    break;
                }
            }
        } while (hasName);

        var newContents = this.state.content
        newContents.unshift(duplicate)
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }

    deletePiece = (index) => {
        var newContents = this.state.content
        newContents.splice(index,1)
        this.setState({
            content: newContents
        })
    }
    toggleLock = (key) => {
        if (this.state.lockedKey !== undefined) {
            this.setState({lockedKey: undefined})
            return
        }
        this.setState({lockedKey: key})
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
                    toggleLockCallback={this.toggleLock}
                    lockedKey={this.state.lockedKey}
                    addBlankKeyValuePairCallback={this.addBlankKeyValuePair}
                    deletePieceCallback={()=>this.deletePiece(index)}
                    duplicatePieceByIndexCallback={()=>this.duplicatePieceByIndex(index)}
                    trackChangedKeyCallback={this.trackChangedKey}
                    updateValueCallback={this.updateValue}
                    removeKeyValuePairFromAllPiecesCallback={this.removeKeyValuePairFromAllPieces}
                    freeTrackedChangedKeyCallback={this.freeTrackedChangedKey}
                />
            })
        }
        
        return <div className="row pieces-viewer">
            <div className="col">
                <div className="row add-pieces-gamedata-row">
                    <div key="addPieceButton" className="input-group input-group-sm mb-3 add-piece-button" data-bs-theme="dark">
                        <button onClick={() => this.addPiece()} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg add-field-plus" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Create a new Piece
                        </button>
                    </div>
                </div>
                <div className="row pieces-gamedata-row">
                    <div className="vertical-input-group">
                        {rows}
                    </div> 
                </div> 
            </div> 
        </div> 
    }
}