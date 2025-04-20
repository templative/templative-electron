import React from "react";
import Piece from "./Piece";
import "./GamedataViewer.css"
import EditableViewerJson from "../EditableViewerJson";
import PieceTable from "./PieceTable";
import TransposedTable from "./TransposedTable";

export default class PieceGamedataViewer extends EditableViewerJson {   
    state = {
        trackedKey: undefined,
        currentUpdateValue: undefined,
        lockedKey: undefined,
        viewMode: 'list'
    }

    getFilePath = (props) => {
        return props.filepath
    }
    
    addBlankKeyValuePair = () => {
        const newContents = [...this.state.content]
        newContents.forEach((element, index) => {
            newContents[index] = { ...newContents[index], "": "" }
        });
        
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }
    
    updateValue = (index, key, newValue) => {
        const newContents = [...this.state.content]
        newContents[index] = { ...newContents[index], [key]: newValue }
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }
    removeKeyValuePairFromAllPieces = (key) => {
        const newContents = this.state.content.map(element => {
            const newElement = { ...element }
            delete newElement[key]
            return newElement
        })
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
        const newContents = [...this.state.content]
        newContents.forEach((element, index) => {
            newContents[index] = { ...newContents[index] }
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
        const newPiece = { }

        if (this.state.content.length > 0) {
            Object.keys(this.state.content[0]).forEach((key) => {
                newPiece[key] = key === "quantity" ? 1 : ""
            });
        }
        const newContents = [...this.state.content]
        newContents.unshift(newPiece)
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }
    duplicatePieceByIndex = (index) => {
        const duplicate = { ...this.state.content[index] }
        let hasName;
        do {
            duplicate["name"] = duplicate["name"] + "_copy"
            hasName = false;
            for (let index = 0; index < this.state.content.length; index++) {
                const element = this.state.content[index];
                if (duplicate["name"] === element["name"]) {
                    hasName = true
                    break;
                }
            }
        } while (hasName);

        const newContents = [...this.state.content]
        newContents.unshift(duplicate)
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }

    deletePiece = (index) => {
        const newContents = [...this.state.content]
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

    toggleViewMode = () => {
        this.setState(prevState => ({
            viewMode: prevState.viewMode === 'list' 
                ? 'table' 
                : prevState.viewMode === 'table' 
                    ? 'transposed' 
                    : 'list'
        }));
    }

    render() {
        if (this.state.failedToLoad) {
            return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.state.filepath} errorMessage={this.state.errorMessage} />
        }
        var rows = []
        if (this.state.hasLoaded && this.state.content !== undefined) {
            if (this.state.viewMode === 'list') {
                
                // If this.state.content is not an array, return []
                if (!Array.isArray(this.state.content)) {
                    return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.state.filepath} errorMessage="It is not a valid Piece Content file." />;
                }
                
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
                        deletePieceCallback={()=>this.deletePiece(index)}
                        duplicatePieceByIndexCallback={()=>this.duplicatePieceByIndex(index)}
                        trackChangedKeyCallback={this.trackChangedKey}
                        updateValueCallback={this.updateValue}
                        removeKeyValuePairFromAllPiecesCallback={this.removeKeyValuePairFromAllPieces}
                        freeTrackedChangedKeyCallback={this.freeTrackedChangedKey}
                        isPreviewEnabled={this.props.isPreviewEnabled}
                        showPreviewCallback={this.props.showPreviewCallback}
                        componentName={this.props.componentName}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    />
                })
            }
        }
        
        return <div className="pieces-viewer">
            <div className="input-group pieces-controls-input-group">
                <button 
                    onClick={() => this.addPiece()} 
                    disabled={!this.state.hasLoaded}
                    className="btn btn-outline-primary add-field-button" 
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg add-field-plus" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                    </svg>
                    Create a new Piece
                </button>
                {this.state.lockedKey === undefined &&
                    <button 
                        onClick={() => this.addBlankKeyValuePair()} 
                        disabled={!this.state.hasLoaded}
                        className="btn btn-outline-primary add-field-button" 
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg add-field-plus" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Add a Field to all Pieces
                    </button>
                }
            </div>
            {/* <button 
                onClick={this.toggleViewMode} 
                className="btn btn-outline-secondary btn-sm" 
                data-bs-theme="dark"
            >
                {this.state.viewMode === 'list' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-table" viewBox="0 0 16 16">
                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                    </svg>
                ) : this.state.viewMode === 'table' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l3.146-3.147 3.146 3.147a.5.5 0 0 0 .708-.708l-3.146-3.147 3.146-3.146a.5.5 0 0 0-.708-.708l-3.146 3.146-3.147-3.146a.5.5 0 0 0-.708.708l3.147 3.146-3.146 3.147a.5.5 0 0 0-.708.708l-3.147-3.146z"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
                )}
            </button> */}
            <div className="pieces-gamedata-row">
                {rows}
                {/* {this.state.viewMode === 'list' ? (
                    
                ) : this.state.viewMode === 'table' ? (
                    <PieceTable 
                        content={this.state.content}
                        updateValue={this.updateValue}
                        deletePiece={this.deletePiece}
                        duplicatePieceByIndex={this.duplicatePieceByIndex}
                    />
                ) : (
                    <TransposedTable 
                        content={this.state.content}
                        updateValue={this.updateValue}
                        deletePiece={this.deletePiece}
                        duplicatePieceByIndex={this.duplicatePieceByIndex}
                    />
                )} */}
            </div> 
        </div> 
    }
}