import React from "react";
import "../Artdata/Artdata.css"
import GamedataItem from "./GamedataItem"
import ResourceHeader from "../ResourceHeader";

export default class GamedataList extends React.Component {   
    render() {
        var divs = [];
        for(var i = 0; i < this.props.filenames.length; i++) {
            var filepath = this.props.filenames[i]
            var isSelected = this.props.currentFilepath === filepath
            divs.push(<GamedataItem gamedataType={this.props.gamedataType} isSelected={isSelected} key={filepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filepath={filepath}/>)
        }
        return <React.Fragment>
            <ResourceHeader header={this.props.header} directory={this.props.directoryPath}/> 
            <div className="artdata">
                {divs}
            </div> 
        </React.Fragment>
    }
}