import React from "react";
import ArtItem from "./ArtItem";

export default class ArtList extends React.Component {   
    render() {
        var divs = [];
        for(var i = 0; i < this.props.filenames.length; i++) {
            var filepath = this.props.filenames[i]
            var isSelected = this.props.currentFilepath === filepath
            divs.push(
                <ArtItem isSelected={isSelected} updateViewedFileCallback={this.props.updateViewedFileCallback} key={filepath} filename={filepath} filepath={filepath}/>    
            )
        }
        return <div className="artList">
            {divs}
        </div> 
    }
}