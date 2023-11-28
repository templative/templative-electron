import React from "react";
import "./Artdata.css"
import ArtdataItem from "./ArtdataItem"

export default class ArtdataList extends React.Component {   
    render() {
        var divs = [];
        for(var i = 0; i < this.props.filenames.length; i++) {
            var filepath = this.props.filenames[i]
            var isSelected = this.props.currentFilepath === filepath
            divs.push(<ArtdataItem isSelected={isSelected} key={filepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filepath={filepath}/>)
        }
        return <div className="artdata">
            {divs}
        </div> 
    }
}