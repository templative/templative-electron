import React from "react";
import "./Art.css"
const path = window.require("path");
const shell = window.require('electron').shell;
var debounceDurationMilliseconds = 3000

export default class ArtItem extends React.Component {   
    state = {
        isHovering: false,
        lastLaunchTime: this.getCurrentTime()
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    getCurrentTime() {
        return new Date().getTime()
    }
    openFile = () => {
        if (this.getCurrentTime() - this.state.lastLaunchTime < debounceDurationMilliseconds) {
            return
        }
        shell.openPath(this.props.filepath);
        this.setState({
            lastLaunchTime: this.getCurrentTime()
        })
    }
    parsePathForCommonPath() {
        return path.relative(this.props.baseFilepath, this.props.filepath).split(".")[0]
    }
    render() {
        var callback = () => this.props.updateViewedFileCallback("ART", this.props.filepath)
        return <div className="artItemWrapper"
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >
            <p className="artItem" onClick={callback}>
                {this.parsePathForCommonPath()} 
                {this.state.isHovering &&
                    <button onClick={()=> this.openFile()}className="btn btn-dark goto">🡭</button>
                }
            </p>
        </div>
    }
}