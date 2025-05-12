import React from "react";
import "./ContentFiles.css"
import ContentFileItem from "./ContentFileItem"
import ResourceHeader from "./ResourceHeader";
import NewFileInput from "./NewFileInput"

import FontsIcon from "../../Icons/fontIcon.svg?react"
import TheGameCrafterAdsIcon from "../../Icons/theGameCrafterAds.svg?react"
import artDataIcon from "../../Icons/artDataIcon.svg?react"
import artIcon from "../../Icons/artIcon.svg?react"
import componentIcon from "../../Icons/componentIcon.svg?react"
import componentComposeIcon from "../../Icons/componentComposeIcon.svg?react"
import pieceIcon from "../../Icons/pieceIcon.svg?react"
import rulesIcon from "../../Icons/rulesIcon.svg?react"
import ContentFolderItem from "./ContentFolderItem";

const fsOld = require('fs');
const fs = require("fs/promises")
const path = require("path")

export default class ContentFileList extends React.Component {
    watcher = undefined
    state = {
        doesNewFileExist: false,
        fileItems: [],
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
    
    readDirectoryRecursively = async (dir, basepath) => {
        let results = [];
        
        try {
            const list = await fs.readdir(dir, { withFileTypes: true });
            
            for (const dirent of list) {
                const filePath = path.resolve(dir, dirent.name);
                
                if (dirent.isDirectory()) {
                    results = results.concat(await this.readDirectoryRecursively(filePath, basepath));
                }
                results.push({ path: filePath, isDirectory: dirent.isDirectory() });
            }
            
            return results;
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
            return [];
        }
    }
    #requestNewFilesNamesAsync = async () => {
        if (!this.props.baseFilepath) return;
        
        const baseFilePathDepth = this.props.baseFilepath.replace(/\\/g, '/').split("/").length;
        
        try {
            const items = await this.readDirectoryRecursively(this.props.baseFilepath);
            
            const fileItems = items
                .filter(item => {
                    const filename = path.basename(item.path);
                    const ext = path.extname(item.path);
                    return ext !== '.md' && filename !== '.DS_Store';
                })
                .map(item => {
                    const depth = path.normalize(item.path).split(path.sep).length;
                    return {
                        depthRelativeToBasepath: depth - baseFilePathDepth,
                        absoluteFilepath: item.path,
                        isDirectory: item.isDirectory
                    };
                })
                .sort((a, b) => a.absoluteFilepath.localeCompare(b.absoluteFilepath));
            this.setState({ fileItems });
        } catch (error) {
            console.error(`Error processing files in ${this.props.baseFilepath}:`, error);
            this.setState({ fileItems: [] });
        }
    }
    componentDidMount = async () => {
        await this.#watchBasepathAsync()
    }
    #watchBasepathAsync = async () => {
        this.#stopWatchingBasepath()  
        try {
            fs.mkdir(this.props.baseFilepath, {recursive: true})
        }
        catch (error) {
            if (error.code !== "EEXIST") {
                throw error;
            }
        }
        try {
            this.componentComposeWatcher = fsOld.watch(this.props.baseFilepath, {recursive: true}, async (event, filename) => {
                await this.#requestNewFilesNamesAsync()
            })
        }
        catch (error) {
            console.error(`Error watching basepath ${this.props.baseFilepath}:`, error);
        }
        
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

    startCreatingNewFileAsync() {
        this.setState({doesNewFileExist: true})
    }

    submitNewFilenameAsync = async (filename) => {
        this.setState({doesNewFileExist: false})
        var filepath = path.join(this.props.baseFilepath, `${filename}.${this.props.newFileExtension}`)
        const content = this.props.getDefaultContentForFileBasedOnFilenameCallback(this.props.contentType, filename)
        await this.props.createFileAsyncCallback(filepath, content)
    }

    cancelFileCreation = () => {
        this.setState({doesNewFileExist: false})
    }
    toggleExtendedAsync = async () => {
        await this.props.changeExtendedFileTypeAsyncCallback(!this.props.extendedFileTypes.has(this.props.filetype), this.props.filetype);
    }

    render() {
        var divs = [];
        if (this.state.doesNewFileExist) {
            divs.push( 
                <NewFileInput 
                    key="newFileInput" 
                    cancelFileCreationCallback={this.cancelFileCreation}
                    submitNewFilenameAsyncCallback={this.submitNewFilenameAsync}
                />
            )
        }
        for(var i = 0; i < this.state.fileItems.length; i++) {
            var fileItem = this.state.fileItems[i]
            
            const acceptedFileExtensions = this.props.acceptedFileExtensions
            if (acceptedFileExtensions.length > 0) {
                const ext = path.extname(fileItem.absoluteFilepath)
                if (!acceptedFileExtensions.includes(ext)) {
                    continue
                }
            }
            
            const effectiveDepth = fileItem.depthRelativeToBasepath + (this.props.baseDepth || 0);
            
            var isVisible = false
            if (fileItem.depthRelativeToBasepath === 1) {
                isVisible = true
            }
            else {
                if (this.props.extendedDirectories.has(path.dirname(fileItem.absoluteFilepath))){
                    isVisible = true
                }
            }
            if (!isVisible) {
                continue
            }
            var isSelected = this.props.currentFilepath !== undefined && path.normalize(this.props.currentFilepath) === path.normalize(fileItem.absoluteFilepath)
            if (fileItem.isDirectory) {
                divs.push(<ContentFolderItem 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    contentType={this.props.contentType}
                    isSelected={isSelected} 
                    key={fileItem.absoluteFilepath} 
                    directoryPath={this.props.directoryPath}
                    filepath={fileItem.absoluteFilepath}
                    depth={effectiveDepth}
                    duplicateFileAsyncCallback={this.props.duplicateFileAsyncCallback}
                    updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback} 
                    deleteFolderAsyncCallback={this.props.deleteFileAsyncCallback}
                    renameFileAsyncCallback={this.props.renameFileAsyncCallback}
                    isExtended={this.props.extendedDirectories.has(fileItem.absoluteFilepath)}
                    changeExtendedDirectoryAsyncCallback={this.props.changeExtendedDirectoryAsyncCallback}
                />)
                continue
            }
            var referenceCount = 1
            if (this.props.filenameReferenceCounts !== undefined) {
                referenceCount = this.props.filenameReferenceCounts[path.normalize(fileItem.absoluteFilepath)]
                if (referenceCount === undefined) {
                    referenceCount = 0
                }
            }
            divs.push(<ContentFileItem 
                contentType={this.props.contentType} 
                referenceCount={referenceCount}
                isSelected={isSelected} 
                key={fileItem.absoluteFilepath} 
                directoryPath={this.props.directoryPath}
                filepath={fileItem.absoluteFilepath}
                depth={effectiveDepth}
                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                duplicateFileAsyncCallback={this.props.duplicateFileAsyncCallback}
                updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback} 
                deleteFileAsyncCallback={this.props.deleteFileAsyncCallback}
                renameFileAsyncCallback={this.props.renameFileAsyncCallback}
            />)
        }

        var startCreatingNewFileAsyncCallback = undefined
        if (this.props.canCreateNewFiles) {
            startCreatingNewFileAsyncCallback = async () => await this.startCreatingNewFileAsync()
        }

        const iconMap = {
            "RULES": rulesIcon,
            "COMPONENTS": componentComposeIcon,
            "COMPONENT_GAMEDATA": componentIcon,
            "PIECE_GAMEDATA": pieceIcon,
            "ART": artIcon,
            "ARTDATA": artDataIcon,
            "GAMECRAFTER_ADS": TheGameCrafterAdsIcon,
            "FONTS": FontsIcon
        }

        var IconSource = iconMap[this.props.contentType] || componentComposeIcon
        var isExtended = this.props.extendedFileTypes.has(this.props.filetype)
        return <div className="content-file-list">
            <ResourceHeader 
                depth={this.props.baseDepth}
                IconSource={IconSource}
                header={this.props.header} 
                directory={this.props.directoryPath} 
                isExtended={isExtended}
                toggleExtendedAsyncCallback={this.toggleExtendedAsync}
                startCreatingNewFileAsyncCallback={startCreatingNewFileAsyncCallback}/>
            {isExtended &&
                <div className="content-file-list">
                    {divs}
                </div> 
            } 
        </div>
    }
}