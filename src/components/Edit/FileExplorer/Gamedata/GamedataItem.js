import React from "react";
import "./Gamedata.css"
const path = window.require("path");

export default class GamedataItem extends React.Component {   
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
        var callback = () => this.props.updateViewedFileCallback(this.props.gamedataType, this.props.filepath)
        return <div 
            className={this.props.isSelected ? "gamedataItemWrapper selected" : "gamedataItemWrapper"} 
            key={this.props.filepath} 
            
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >
            <div className="filename-content" onClick={callback}>
                <p className="gamedataItem">{path.parse(this.props.filepath).name}</p>
            </div>
            <div className="file-controls">
                {(this.state.isHovering && this.props.deleteFileCallback !== undefined && !this.props.isSelected) &&
                    <button onClick={()=> this.props.deleteFileCallback(this.props.filepath)}className="btn btn-dark removeGamedataItem">🗑️</button>
                }
            </div>
        </div>
    }
}