import React from "react";
import "./ContentFiles.css"
import ContentFileItem from "./ContentFileItem"
import ResourceHeader from "./ResourceHeader";
import NewFileInput from "./NewFileInput"

const path = window.require("path")

export default class ContentFileList extends React.Component {
    state = {
        doesNewFileExist: false
    }
    startCreatingNewFile() {
        this.setState({doesNewFileExist: true})
    }

    submitNewFilename = (filename) => {
        this.setState({doesNewFileExist: false})
        var filepath = path.join(this.props.baseFilepath, `${filename}.${this.props.newFileExtension}`)
        const content = this.props.getDefaultContentForFileBasedOnFilenameCallback(this.props.contentType, filename)
        console.log(content)
        this.props.createFileCallback(filepath, content)
    }

    cancelFileCreation = () => {
        this.setState({doesNewFileExist: false})
    }

    render() {
        var divs = [];
        if (this.state.doesNewFileExist) {
            divs.push( 
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
            divs.push(<ContentFileItem 
                contentType={this.props.contentType} 
                isSelected={isSelected} 
                key={filepath} 
                filepath={filepath}
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                deleteFileCallback={this.props.deleteFileCallback}
                renameFileCallback={this.props.renameFileCallback}
            />)
        }

        var createFileCallback = undefined
        if (this.props.canCreateNewFiles) {
            createFileCallback = () => this.startCreatingNewFile()
        }

        return <React.Fragment>
            <ResourceHeader 
                header={this.props.header} 
                directory={this.props.directoryPath} 
                createFileCallback={createFileCallback}/> 
            <div className="content-file-list">
                {divs}
            </div> 
        </React.Fragment>
    }
}