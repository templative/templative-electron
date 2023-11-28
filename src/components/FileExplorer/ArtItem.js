import React from "react";
import "./Art.css"
const path = window.require("path");

export default class ArtItem extends React.Component {   
    state = {isHovering: false}
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    render() {
        var callback = () => this.props.updateViewedFileCallback("ART", this.props.filepath)
        return <div className="artItemWrapper"
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >
            <p className="artItem" onClick={callback}>
                {path.parse(this.props.filename).name} {this.state.isHovering && <button className="btn btn-dark goto">🡭</button>}
            </p>
        </div>
    }
}