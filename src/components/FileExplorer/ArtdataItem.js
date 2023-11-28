import React from "react";
import "./Artdata.css"
const path = window.require("path");

export default class ArtdataItem extends React.Component {   
    render() {
        var callback = () => this.props.updateViewedFileCallback("ARTDATA", this.props.filepath)
        return <div className={this.props.isSelected ? "artdataItemWrapper selected" : "artdataItemWrapper"} key={this.props.filepath} onClick={callback}>
            <p className="artdataItem">{path.parse(this.props.filepath).name}</p>
        </div>
    }
}