import React from "react";
import "./GamedataViewer.css"

export default class PieceControlInput extends React.Component {   
    render() {
        Object.keys(this.props.piece).forEach(element => console.log(element))
        return <div key="main-row" className="input-group input-group-sm mb-3 piece-control-input" data-bs-theme="dark">
            <span className="input-group-text">name</span>
            <input type="text" className="form-control value-field" 
                onChange={(event)=>this.props.updateValueCallback("name", event.target.value)} 
                aria-label="What key to get from the scope..." 
                value={this.props.piece["name"]}/>
            <span className="input-group-text">displayName</span>
            <input type="text" className="form-control value-field" 
                onChange={(event)=>this.props.updateValueCallback("displayName", event.target.value)} 
                aria-label="What key to get from the scope..." 
                value={this.props.piece["displayName"]}/>
            <span className="input-group-text">quantity</span>
            <input type="text" className="form-control value-field" 
                onChange={(event)=>this.props.updateValueCallback("quantity", event.target.value)} 
                aria-label="What key to get from the scope..." 
                value={this.props.piece["quantity"]}/>
            <button onClick={()=>this.props.deleteCallback(this.props.index)} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">🗑️</button>
        </div>
    }
}