import React from "react";
import "../../ArtdataViewer.css"

export default class ScopedValueInput extends React.Component {   
    
    render() {
        return <React.Fragment>
                <span className="input-group-text">❔</span>
                <select value={this.props.scope} onChange={(event)=>this.props.changeScopeCallback(this.props.index, event.target.value)} className="form-select scope-select" id="inputGroupSelect01">
                    <option value="global">Global</option>
                    <option value="studio">Studio</option>
                    <option value="game">Game</option>
                    <option value="component">Component</option>
                    <option value="piece">Piece</option>
                    <option value="utility">Utility</option>
                </select>
                <input type="text" className="form-control" onChange={()=>{}} aria-label="What key to get from the scope..." value={this.props.source}/>
            </React.Fragment>
    }
}