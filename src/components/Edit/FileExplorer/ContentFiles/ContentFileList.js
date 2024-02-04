import React from "react";
import "./ContentFiles.css"
import ContentFileItem from "./ContentFileItem"
import ResourceHeader from "./ResourceHeader";
import NewFileInput from "./NewFileInput"

import artDataIcon from "../../Icons/artDataIcon.svg"
import artIcon from "../../Icons/artIcon.svg"
import componentComposeIcon from "../../Icons/componentComposeIcon.svg"
import pieceIcon from "../../Icons/pieceIcon.svg"
import rulesIcon from "../../Icons/rulesIcon.svg"

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
                console.error(err, this.props.baseFilepath)
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
        this.#watchBasepath()
    }

    #watchBasepath = () => {
        this.#stopWatchingBasepath()
        this.watcher = fs.watch(this.props.baseFilepath, {recursive: true}, (eventType, filename) => { 
            // console.log(`The file ${filename} was ${eventType}!`); 
            this.requestNewFilesNames()
          }); 
        this.requestNewFilesNames()
    }
    componentDidUpdate = (prevProps, prevState) => {
        const isSameBaseFilepath = prevProps.baseFilepath === this.props.baseFilepath
        if (isSameBaseFilepath) {
            return
        }
        
        this.#watchBasepath()
    }

    componentWillUnmount = () => {
        this.#stopWatchingBasepath()
    }

    #stopWatchingBasepath = ()=> {
        if (this.watcher === undefined) {
            return
        }
        this.watcher.close();
        this.watcher = undefined;
    }

    startCreatingNewFile() {
        this.setState({doesNewFileExist: true})
    }

    submitNewFilename = (filename) => {
        this.setState({doesNewFileExist: false})
        var filepath = path.join(this.props.baseFilepath, `${filename}.${this.props.newFileExtension}`)
        const content = this.props.getDefaultContentForFileBasedOnFilenameCallback(this.props.contentType, filename)
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
            var referenceCount = this.props.filenameReferenceCounts[filepath]
            if (referenceCount === undefined) {
                referenceCount = 0
            }
            const isDirectory = fs.lstatSync(filepath).isDirectory() 
            if (isDirectory) {
                continue
            }
            divs.push(<ContentFileItem 
                contentType={this.props.contentType} 
                referenceCount={referenceCount}
                isSelected={isSelected} 
                key={filepath} 
                directoryPath={this.props.directoryPath}
                filepath={filepath}
                duplicateFileCallback={this.props.duplicateFileCallback}
                updateViewedFileUsingExplorerCallback={this.props.updateViewedFileUsingExplorerCallback} 
                deleteFileCallback={this.props.deleteFileCallback}
                renameFileCallback={this.props.renameFileCallback}
            />)
        }

        var createFileCallback = undefined
        if (this.props.canCreateNewFiles) {
            createFileCallback = () => this.startCreatingNewFile()
        }

        var iconSource = componentComposeIcon
        if (this.props.contentType === "RULES") {
            iconSource = rulesIcon
        }
        if (this.props.contentType === "COMPONENTS") {
            iconSource = componentComposeIcon
        }
        if (this.props.contentType === "KEYVALUE_GAMEDATA") {
            iconSource = pieceIcon
        }
        if (this.props.contentType === "KEYVALUE_GAMEDATA" || this.props.contentType === "PIECE_GAMEDATA") {
            iconSource = pieceIcon
        }
        if (this.props.contentType === "ART") {
            iconSource = artIcon
        }
        if (this.props.contentType === "ARTDATA") {
            iconSource = artDataIcon
        }

        return <div className="content-file-list">
            <ResourceHeader 
                iconSource={iconSource}
                header={this.props.header} 
                directory={this.props.directoryPath} 
                createFileCallback={createFileCallback}/> 
            <div className="content-file-list">
                {divs}
            </div> 
        </div>
    }
}