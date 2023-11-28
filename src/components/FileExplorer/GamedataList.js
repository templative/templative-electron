import React from "react";
import "./Artdata.css"
import GamedataItem from "./GamedataItem"

export default class GamedataList extends React.Component {   
    render() {
        var divs = [];
        for(var i = 0; i < this.props.filenames.length; i++) {
            var filepath = this.props.filenames[i]
            var isSelected = this.props.currentFilepath === filepath
            divs.push(<GamedataItem gamedataType={this.props.gamedataType} isSelected={isSelected} key={this.props.filepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filepath={filepath}/>)
        }
        return <div className="artdata">
            {divs}
        </div> 
    }
}