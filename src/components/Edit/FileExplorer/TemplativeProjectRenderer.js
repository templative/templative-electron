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
                this.props.updateViewedFileCallback(this.props.currentFileType, newFilepath)
            }
            this.forceUpdate()
        });
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
            {/* <div className="row main-game-button-row">
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openStudioGamedataCallback()}>Studio</button>
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openGameGamedataCallback()}>Game</button>
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openComponentsCallback()}>Components</button>
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openRulesCallback()}>Rules</button>
            </div> */}
            
            { this.state.gameCompose !== undefined &&
                <div className="row file-explorer-row">
                    <ContentFileList
                        header="Templates" 
                        contentType="ART" 
                        directoryPath={this.state.templatesDirectory}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        baseFilepath={this.state.templatesDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileCallback={this.props.updateViewedFileCallback} 
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                    />
                    <ContentFileList
                        header="Overlays" 
                        contentType="ART" 
                        directoryPath={this.state.overlaysDirectory}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        baseFilepath={this.state.overlaysDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileCallback={this.props.updateViewedFileCallback} 
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                    />
                    <ContentFileList
                        header="Artdata" 
                        contentType="ARTDATA" 
                        directoryPath={this.state.artdataDirectory}
                        baseFilepath={this.state.artdataDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileCallback={this.props.updateViewedFileCallback} 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        canCreateNewFiles={true}
                        newFileExtension="json"
                        getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                    />
                    <ContentFileList
                        header="Component Gamedata" 
                        contentType="KEYVALUE_GAMEDATA" 
                        directoryPath={this.state.componentGamedataDirectory}
                        baseFilepath={this.state.componentGamedataDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileCallback={this.props.updateViewedFileCallback} 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        canCreateNewFiles={true}
                        newFileExtension="json"
                        getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                    />
                    <ContentFileList
                        header="Piece Gamedata" 
                        contentType="PIECE_GAMEDATA" 
                        directoryPath={this.state.piecesGamedataDirectory}
                        baseFilepath={this.state.piecesGamedataDirectory}
                        currentFilepath={this.props.currentFilepath} 
                        updateViewedFileCallback={this.props.updateViewedFileCallback} 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        canCreateNewFiles={true}
                        newFileExtension="json"
                        getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                        createFileCallback={this.createFile}
                        deleteFileCallback={this.deleteFile}
                        renameFileCallback={this.renameFile}
                    />
                </div>       
            }
        </React.Fragment>        
    }
}