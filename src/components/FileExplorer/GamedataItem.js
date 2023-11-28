import React from "react";
import "./Gamedata.css"
const path = window.require("path");

export default class GamedataItem extends React.Component {   
    render() {
        var callback = () => this.props.updateViewedFileCallback(this.props.gamedataType, this.props.filepath)
        return <div className={this.props.isSelected ? "gamedataItemWrapper selected" : "gamedataItemWrapper"} key={this.props.filepath} onClick={callback}>
            <p className="gamedataItem">{path.parse(this.props.filepath).name}</p>
        </div>
    }
}