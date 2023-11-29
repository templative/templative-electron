import React from "react";

export default class TextReplacement extends React.Component {   
    
    render() {
        var isDebug = this.props.textReplacement.isDebug === true
        var isComplex = this.props.textReplacement.isComplex === true
        return <div className="row" key={this.props.textReplacement.scope + this.props.textReplacement.key + this.props.textReplacement.source}>
            <div className="input-group mb-3"  data-bs-theme="dark">
                <span className="input-group-text">🔑</span>
                <input type="text" className="form-control" onChange={()=>{}} aria-label="What key to replace..." value={this.props.textReplacement.key}/>
                <span className="input-group-text">❔</span>
                <select value={this.props.textReplacement.scope} onChange={()=>{}} className="form-select" id="inputGroupSelect01">
                    <option value="global">Global</option>
                    <option value="studio">Studio</option>
                    <option value="game">Game</option>
                    <option value="component">Component</option>
                    <option value="piece">Piece</option>
                    <option value="utility">Utility</option>
                </select>
                <input type="text" className="form-control" onChange={()=>{}} aria-label="What key to get from the scope..." value={this.props.textReplacement.source}/>
                <span className="input-group-text">🪲</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{}} checked={isDebug} aria-label="Checkbox for following text input" />
                </div>
                <span className="input-group-text">🔎</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{}} checked={isComplex} aria-label="Checkbox for following text input"/>
                </div>
            </div>
        </div> 
    }
}