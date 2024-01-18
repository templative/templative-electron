import React from "react";
import "./Artdata.css"
import ArtdataItem from "./ArtdataItem"
import ResourceHeader from "../ResourceHeader"
import NewFileInput from "../NewFileInput"

const path = window.require("path")

export default class ArtdataList extends React.Component {   
    state = {
        doesNewArtdataFileExist: false
    }
    createArtdataFile() {
        this.setState({doesNewArtdataFileExist: true})
    }
    submitNewFilename = (filename) => {
        this.setState({doesNewArtdataFileExist: false})
        if (filename === "") {
            return;
        }
        var filepath = path.join(this.props.baseFilepath, `${filename}.json`)
        this.props.createFileCallback(filepath, `{ "name":"${filename}", "templateFilename": "", "overlays": [], "textReplacements": [], "styleUpdates": [] }`)
    }
    cancelFileCreation = () => {
        this.setState({doesNewArtdataFileExist: false})
    }
    render() {
        var divs = [];
        if (this.state.doesNewArtdataFileExist) {
            divs.push(this.state.doesNewArtdataFileExist && 
                <NewFileInput 
                    key="newFileInput" 
                    cancelFileCreationCallback={this.cancelFileCreation}
                    submitNewFilenameCallback={this.submitNewFilename}
                />
            )
        }
        for(var i = 0; i < this.props.filenames.length; i++) {
            var filepath = this.props.filenames[i]
            var isSelected = this.props.currentFilepath === filepath
            divs.push(<ArtdataItem 
                isSelected={isSelected} 
                key={filepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filepath={filepath}
                deleteFileCallback={this.props.deleteFileCallback}
                renameFileCallback={this.props.renameFileCallback}
            />)
        }
        return <React.Fragment>
            <ResourceHeader header="Artdata" directory={this.props.directoryPath} createFileCallback={()=>this.createArtdataFile()}/>
            <div className="artdata">
                {divs}
            </div> 
        </React.Fragment> 
    }
}