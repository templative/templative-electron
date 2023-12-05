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
    render() {
        var callback = () => this.props.updateViewedFileCallback("ART", this.props.filepath)
        return <div className="artItemWrapper"
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >
            <p className="artItem" onClick={callback}>
                {path.parse(this.props.filename).name} 
                {this.state.isHovering &&
                    <button onClick={()=> this.openFile()}className="btn btn-dark goto">🡭</button>
                }
            </p>
        </div>
    }
}