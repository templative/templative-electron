import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import ContentFileList from "./ContentFiles/ContentFileList";
import "./TemplativeProjectRenderer.css"

const path = window.require("path")
const fs = window.require("fs")

export default class TemplativeProjectRenderer extends React.Component {   
    state = {
        gameCompose: undefined,
        templatesDirectory: undefined,
        overlaysDirectory: undefined,
        artdataDirectory: undefined,
        piecesGamedataDirectory: undefined,
        componentGamedataDirectory: undefined
    }

    createFile = (filepath, contents) => {
        fs.writeFile(filepath, contents, {}, () => {
            this.forceUpdate()
        })
    }
    deleteFile = (filepath) => {
        console.log(`Deleting ${filepath}`)
        fs.unlink(filepath, (err) => {
            if (err !== null) {
                console.log(err);
                return
            }
            if (this.props.currentFilepath === filepath) {
                this.props.clearViewedFileCallback()
            }
            this.forceUpdate()
        });
    }
    
    componentDidMount() {
        var gameCompose = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "game-compose.json");
        
        this.setState({
            gameCompose: gameCompose,

            templatesDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artTemplatesDirectory),
            overlaysDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artInsertsDirectory),
            artdataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artdataDirectory),
            piecesGamedataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.piecesGamedataDirectory),
            componentGamedataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.componentGamedataDirectory),
        })
    }
    renameFile = (originalFilepath, newFilename) => {
        
        const originalDirectory = path.parse(originalFilepath).dir
        const filenameWithExtension = `${newFilename}.${originalFilepath.split('.').pop()}` 
        const newFilepath = path.join(originalDirectory, filenameWithExtension)
        fs.rename(originalFilepath, newFilepath, (err) => {
            if (err !== null) {
                console.log(err);
                return
            }
            if (this.props.currentFilepath === originalFilepath) {
                this.props.updateViewedFileUsingExplorerCallback(this.props.currentFileType, newFilepath)
            }
            this.forceUpdate()
        });
    }
    static #getCopiedFilepath(filepath) {
        const parsedPath = path.parse(filepath)
        var newFilepath = path.join(parsedPath.dir, `${parsedPath.name}_Copy${path.extname(filepath)}`)
        if (fs.existsSync(newFilepath)) {
            return TemplativeProjectRenderer.#getCopiedFilepath(newFilepath)
        }
        return newFilepath 
    }
    duplicateFile = (filepath) => {
        const newFilepath = TemplativeProjectRenderer.#getCopiedFilepath(filepath)
        
        fs.readFile(filepath, (readError, data) => {
            if (readError) {
                console.log(`Error duplicating ${path.parse(filepath).name} during read: ${readError}`)
                return
            }
            fs.writeFile(newFilepath, data, (writeError) => {
                if (writeError) {
                    console.log(`Error writing ${path.parse(newFilepath).name} ${writeError}`)
                }
            })
        })
        
    }
    getDefaultContentForFileBasedOnFilename = (filetype, filename) => {
        switch (filetype) {
            case "PIECE_GAMEDATA":
                return "[]"
            case "KEYVALUE_GAMEDATA":
                return `{"displayName": "${filename}", "pieceDisplayName": "${filename}" }`
            case "ARTDATA":
                return `{ "name":"${filename}", "templateFilename": "", "overlays": [], "textReplacements": [], "styleUpdates": [] }`
            default:
                return "";
        }
    }
    render() {
        return <React.Fragment>            
            { this.state.gameCompose !== undefined &&
                <div className="row file-explorer-row">
                    <ContentFileList
                        header="Templates" 
                        contentType="ART" 
                        directoryPath={this.state.templatesDirectory}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        baseFilepath={this.state.templatesDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileUsingExplorerCallback={this.props.updateViewedFileUsingExplorerCallback} 
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                        duplicateFileCallback={this.duplicateFile}
                    />
                    <ContentFileList
                        header="Overlays" 
                        contentType="ART" 
                        directoryPath={this.state.overlaysDirectory}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        baseFilepath={this.state.overlaysDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileUsingExplorerCallback={this.props.updateViewedFileUsingExplorerCallback} 
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                        duplicateFileCallback={this.duplicateFile}
                    />
                    <ContentFileList
                        header="Artdata" 
                        contentType="ARTDATA" 
                        directoryPath={this.state.artdataDirectory}
                        baseFilepath={this.state.artdataDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileUsingExplorerCallback={this.props.updateViewedFileUsingExplorerCallback} 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        canCreateNewFiles={true}
                        newFileExtension="json"
                        getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                        duplicateFileCallback={this.duplicateFile}
                    />
                    <ContentFileList
                        header="Component Gamedata" 
                        contentType="KEYVALUE_GAMEDATA" 
                        directoryPath={this.state.componentGamedataDirectory}
                        baseFilepath={this.state.componentGamedataDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileUsingExplorerCallback={this.props.updateViewedFileUsingExplorerCallback} 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        canCreateNewFiles={true}
                        newFileExtension="json"
                        getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                        duplicateFileCallback={this.duplicateFile}
                    />
                    <ContentFileList
                        header="Piece Gamedata" 
                        contentType="PIECE_GAMEDATA" 
                        directoryPath={this.state.piecesGamedataDirectory}
                        baseFilepath={this.state.piecesGamedataDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileUsingExplorerCallback={this.props.updateViewedFileUsingExplorerCallback} 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        canCreateNewFiles={true}
                        newFileExtension="json"
                        getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                        duplicateFileCallback={this.duplicateFile}
                    />
                </div>       
            }
        </React.Fragment>        
    }
}