import React from "react";
import "../Render/RenderPanel.css"
const {shell} = require('electron')
const path = require("path")

export default class DirectoryOption extends React.Component {  
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
        if (this.props.directory === undefined) {
            return
        }
        if (this.props.directory.path === undefined || this.props.directory.name === undefined) {
            return
        }
        shell.openPath(path.join(this.props.directory.path, this.props.directory.name));
    }
    getDirectoryPath = () => path.join(this.props.directory.path, this.props.directory.name)

    render() {
        const isSelected = this.props.selectedDirectory === this.props.directory.name
        return <div className={`resourceheader-wrapper directory ${isSelected && "selected-directory"}`} 
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