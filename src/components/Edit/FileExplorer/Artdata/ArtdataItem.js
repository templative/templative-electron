import React from "react";
import "./Artdata.css"
const path = window.require("path");

export default class ArtdataItem extends React.Component { 
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
        var callback = () => this.props.updateViewedFileCallback("ARTDATA", this.props.filepath)
        return <div 
            className={this.props.isSelected ? "artdataItemWrapper selected" : "artdataItemWrapper"} 
            key={this.props.filepath} 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >
            <div className="filename-content" onClick={callback}>
                <p className="artdataItem">{path.parse(this.props.filepath).name}</p>
            </div>
            <div className="file-controls">
                {(this.state.isHovering && this.props.deleteFileCallback !== undefined && !this.props.isSelected) &&
                    <button onClick={()=> this.props.deleteFileCallback(this.props.filepath)}className="btn btn-dark removeArtdataButton">🗑️</button>
                }
            </div>
            
        </div>
    }
}