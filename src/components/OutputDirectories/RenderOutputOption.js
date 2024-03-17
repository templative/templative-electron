import React from "react";
import "../Render/RenderPanel.css"
const {shell} = require('electron')
const path = require("path")

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
    getDirectoryPath = () => path.join(this.props.directory.path, this.props.directory.name)

    render() {
        const isSelected = this.props.selectedDirectory === this.getDirectoryPath()
        return <div className={`resourceHeaderWrapper directory ${isSelected && "selected-output-directory"}`} 
                onClick={async () => await this.props.selectDirectoryAsyncCallback(this.props.directory.name)}
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