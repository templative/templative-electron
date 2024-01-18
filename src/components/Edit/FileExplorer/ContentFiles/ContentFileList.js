import React from "react";
import "./ContentFiles.css"
import ContentFileItem from "./ContentFileItem"
import ResourceHeader from "./ResourceHeader";
import NewFileInput from "./NewFileInput"

const fs = window.require("fs")
const path = window.require("path")

export default class ContentFileList extends React.Component {
    watcher = undefined
    state = {
        doesNewFileExist: false,
        filenames: []
    }
    requestNewFilesNames = () => {
        fs.readdir(this.props.baseFilepath, { recursive: true }, (err, filenames) => {
            if (err) {
                console.log(err, this.props.baseFilepath)
                return;
            }
            var filepaths = []
            filenames.forEach(element => {
                var filepath = path.join(this.props.baseFilepath, element)
                if (filepath.split(".").pop() === "md") {
                    return;
                }
                if (filepath.split(".").pop() === "DS_Store") {
                    return;
                }
                filepaths.push(filepath)
            });
            this.setState({filenames: filepaths})
            this.forceUpdate()
        })
        
    }

    componentDidMount = () => {
        this.watcher = fs.watch(this.props.baseFilepath, {recursive: true}, (eventType, filename) => { 
            console.log(`The file ${filename} was ${eventType}!`); 
            this.requestNewFilesNames()
          }); 
        this.requestNewFilesNames()
    }
    componentWillUnmount = () => {
        if (this.watcher !== undefined) {
            this.watcher.close();
            this.watcher = undefined;
        }
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

        for(var i = 0; i < this.state.filenames.length; i++) {
            var filepath = this.state.filenames[i]
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