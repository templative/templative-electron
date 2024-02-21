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

const fsOld = require('fs');
const fs = require("fs/promises")
const path = require("path")

export default class ContentFileList extends React.Component {
    watcher = undefined
    state = {
        doesNewFileExist: false,
        filenames: []
    }
    static #filterNonContentFiles = async (filepaths) => {
        // return filepaths
        var filteredFilepaths = []
        for (let index = 0; index < filepaths.length; index++) {
            const filepath = filepaths[index];
            var filepathStats = await fs.lstat(filepath)
            const isDirectory = filepathStats.isDirectory()
            if (isDirectory) {
                continue
            }
            const isReadMe = filepath.split(".").pop() === "md"
            const isMacFolderInfo = filepath.split(".").pop() === "DS_Store"
            if (isReadMe || isMacFolderInfo) {
                continue;
            }
            filteredFilepaths.push(filepath)
        }
        return filteredFilepaths
    }
    static #sortAlphabetically = (a, b) => {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }
    #requestNewFilesNamesAsync = async () => {
        var filenamesRelativeToBasepath = await fs.readdir(this.props.baseFilepath, { recursive: true })
        var filepaths = filenamesRelativeToBasepath
            .sort(ContentFileList.#sortAlphabetically)
            .map((filenameRelativeToBasepath) => path.join(this.props.baseFilepath, filenameRelativeToBasepath))        
        filepaths = await ContentFileList.#filterNonContentFiles(filepaths)
        this.setState({filenames: filepaths})
    }
    componentDidMount = async () => {
        await this.#watchBasepathAsync()
    }
    #watchBasepathAsync = async () => {
        this.#stopWatchingBasepath()                
        this.componentComposeWatcher = fsOld.watch(this.props.baseFilepath, {recursive: true}, async (event, filename) => {
            console.log(event, filename)
            await this.#requestNewFilesNamesAsync()
        })
            
        await this.#requestNewFilesNamesAsync()
    }
    
    componentDidUpdate = async (prevProps, prevState) => {
        const isSameBaseFilepath = prevProps.baseFilepath === this.props.baseFilepath
        if (isSameBaseFilepath) {
            return
        }

        await this.#watchBasepathAsync()
    }

    componentWillUnmount = () => {
        this.#stopWatchingBasepath()
    }

    #stopWatchingBasepath = () => {
        if (this.componentComposeWatcher === undefined) {
            return
        }
        this.componentComposeWatcher.close();
        this.componentComposeWatcher = undefined;
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
        // console.log(this.state)
        for(var i = 0; i < this.state.filenames.length; i++) {
            var filepath = this.state.filenames[i]
            // console.log(filepath)
            var isSelected = this.props.currentFilepath === filepath
            var referenceCount = this.props.filenameReferenceCounts[filepath]
            if (referenceCount === undefined) {
                referenceCount = 0
            }
            
            divs.push(<ContentFileItem 
                contentType={this.props.contentType} 
                referenceCount={referenceCount}
                isSelected={isSelected} 
                key={filepath} 
                directoryPath={this.props.directoryPath}
                filepath={filepath}
                duplicateFileAsyncCallback={this.props.duplicateFileAsyncCallback}
                updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback} 
                deleteFileAsyncCallback={this.props.deleteFileAsyncCallback}
                renameFileAsyncCallback={this.props.renameFileAsyncCallback}
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