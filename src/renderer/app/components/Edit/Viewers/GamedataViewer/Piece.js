import React from "react";
import KeyValueInput from "./KeyValueInput"
import "./GamedataViewer.css"
import PieceControls from "./PieceControls.js";
import { channels } from "../../../../../../shared/constants";
const { ipcRenderer } = require('electron');


const ignoredControlGamedataKeys = [
    "name","quantity"
]

export default class Piece extends React.Component {   
    state = {
        isHovering: false
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    previewPiece = async () => {
        const data = {
            componentFilter: this.props.componentName,
            pieceFilter: this.props.piece["name"],
            language: "en",
            directoryPath: this.props.templativeRootDirectoryPath
        }
        try {
            this.props.showPreviewCallback()
            await ipcRenderer.invoke(channels.TO_SERVER_PREVIEW_PIECE, data);
        } catch (error) {
            console.error("Error in preview:", error);
        }
    }
    
    render() {        
        var pieceKeys = Object.keys(this.props.piece).sort()
        var keyValueRows = pieceKeys
            .filter((key) => {
                for(var c = 0; c < ignoredControlGamedataKeys.length; c++) {
                    if (key === ignoredControlGamedataKeys[c]) {
                        return false
                    }
                };
                return true
            })
            .filter((key) => {
                return this.props.lockedKey === undefined || key === this.props.lockedKey
            })
            .map((key) => {
                return <KeyValueInput 
                    key={key}
                    hasLockPotential={true}
                    isLocked={this.props.lockedKey !== undefined}
                    toggleLockCallback={this.props.toggleLockCallback}
                    gamedataKey={key} value={this.props.gamedataFile[this.props.index][key]} 
                    trackedKey={this.props.trackedKey} currentUpdateValue={this.props.currentUpdateValue}
                    trackChangedKeyCallback={(key, value) => this.props.trackChangedKeyCallback(key, value)}
                    updateValueCallback={(key, value)=>this.props.updateValueCallback(this.props.index, key, value)}
                    removeKeyValuePairCallback={(key)=>this.props.removeKeyValuePairFromAllPiecesCallback(key)}
                    freeTrackedChangedKeyCallback={()=> this.props.freeTrackedChangedKeyCallback()}
                />
        });
        var shouldShowPlusSign = this.state.isHovering
        shouldShowPlusSign = true // I dont like the hover
        return <div className="vertical-input-group piece-controls-and-keys" 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >        
            <PieceControls 
                piece={this.props.piece}
                isPreviewEnabled={this.props.isPreviewEnabled}
                deleteCallback={this.props.deletePieceCallback}
                duplicatePieceByIndexCallback={this.props.duplicatePieceByIndexCallback}
                previewPieceCallback={this.previewPiece}
                updateValueCallback={(key, value)=>this.props.updateValueCallback(this.props.index, key, value)}
            />    
            {keyValueRows}
            
        </div>
    }
}
