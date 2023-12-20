import React from "react";
import "./RenderPanel.css"
const {shell} = window.require('electron')
const path = window.require("path")

export default class RenderOutputOption extends React.Component {  
    state = {
        isHovering: false
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    openFolder() {
        shell.openPath(path.join(this.props.directory.path, this.props.directory.name));
    }
    render() {
        return <div className={`resourceHeaderWrapper directory ${this.state.selectedDirectory === this.props.directory && "selected"}`} 
                onClick={()=>this.props.selectDirectory(this.props.directory.name)}
                onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut}
            >
            <div className="resourceHeaderContent" >
                <p className="directory-item">{this.props.directory.name}</p>
            </div>
            <div className="resourceHeaderControls" >
                {this.state.isHovering &&
                    <button onClick={()=> this.openFolder()} className="btn btn-dark add-file-button">↗️</button>
                }
            </div>
        </div>
        
    }
}