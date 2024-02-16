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
            }).map((key) => {
                return <KeyValueInput 
                    key={key}
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
                deleteCallback={() => this.props.deletePieceCallback(this.props.index)}
            />
            
            {keyValueRows}
            
            <div key="addBlankKeyValuePairButton" className={`input-group input-group-sm mb-3 add-piece-key ${shouldShowPlusSign && "show-add-piece-key"}`} data-bs-theme="dark">
                <button 
                    onClick={() => this.props.addBlankKeyValuePairCallback()} 
                    className="btn btn-outline-secondary add-button" 
                    type="button"
                >
                    ➕
                </button>
            </div>
            
        </div>
    }
}
