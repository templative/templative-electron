import React from "react";
import "./Artdata.css"
import ArtdataItem from "./ArtdataItem"
import ResourceHeader from "../ResourceHeader"
import NewFileInput from "../NewFileInput"

export default class ArtdataList extends React.Component {   
    state = {
        doesNewArtdataFileExist: false
    }
    createArtdataFile() {
        this.setState({doesNewArtdataFileExist: true})
    }
    submitNewFilename(filename) {
        this.setState({doesNewArtdataFileExist: false})
    }
    render() {
        var divs = [];
        if (this.state.doesNewArtdataFileExist) {
            divs.push(this.state.doesNewArtdataFileExist && 
                <NewFileInput key="newFileInput" submitNewFilenameCallback={(filename)=> this.submitNewFilename(filename)}
            />)
        }
        for(var i = 0; i < this.props.filenames.length; i++) {
            var filepath = this.props.filenames[i]
            var isSelected = this.props.currentFilepath === filepath
            divs.push(<ArtdataItem isSelected={isSelected} key={filepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filepath={filepath}/>)
        }
        return <React.Fragment>
            <ResourceHeader header="Artdata" directory={this.props.directoryPath} createFileCallback={()=>this.createArtdataFile()}/>
            <div className="artdata">
                {divs}
            </div> 
        </React.Fragment> 
    }
}