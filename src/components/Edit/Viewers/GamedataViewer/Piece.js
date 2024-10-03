import React from "react";
import KeyValueInput from "./KeyValueInput"
import PieceControlInput from "./PieceControlInput"

import "./GamedataViewer.css"

const ignoredControlGamedataKeys = [
    "name", "displayName", "quantity"
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
        return <div className="row piece-row" 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >        
            <PieceControlInput 
                piece={this.props.piece}
                updateValueCallback={(key, value)=>this.props.updateValueCallback(this.props.index, key, value)}
                deleteCallback={this.props.deletePieceCallback}
                duplicatePieceByIndexCallback={this.props.duplicatePieceByIndexCallback}
            />
            
            {keyValueRows}
            
            {this.props.lockedKey === undefined && 
                <div key="addBlankKeyValuePairButton" className={`input-group input-group-sm mb-3 add-piece-key ${shouldShowPlusSign && "show-add-piece-key"}`} data-bs-theme="dark">
                    <button 
                        onClick={() => this.props.addBlankKeyValuePairCallback()} 
                        className="btn btn-outline-secondary add-button" 
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg add-field-plus" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Add Field to all Pieces
                    </button>
                </div>
            }
            
            
        </div>
    }
}
