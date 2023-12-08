import React from "react";
import ArtItem from "./ArtItem";
import ResourceHeader from "../ResourceHeader";

export default class ArtList extends React.Component {   
    render() {
        var divs = [];
        for(var i = 0; i < this.props.filenames.length; i++) {
            var filepath = this.props.filenames[i]
            var isSelected = this.props.currentFilepath === filepath
            divs.push(
                <ArtItem 
                    directoryPath={this.props.directoryPath} 
                    isSelected={isSelected} 
                    updateViewedFileCallback={this.props.updateViewedFileCallback} 
                    key={filepath} 
                    filename={filepath} 
                    filepath={filepath}
                />    
            )
        }
        return <React.Fragment>
            <ResourceHeader header={this.props.header} directory={this.props.directoryPath}/>
            <div className="artList">
                {divs}
            </div> 
        </React.Fragment>
    }
}