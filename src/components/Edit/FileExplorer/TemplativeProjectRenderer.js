import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import ContentFileList from "./ContentFiles/ContentFileList";
import "./TemplativeProjectRenderer.css"

const path = window.require("path")
const fs = window.require("fs")

export default class TemplativeProjectRenderer extends React.Component {   
    state = {
        gameCompose: undefined,
        templateFilenames: [],
        overlayFilenames: [],
        artdataFilenames: [],
        globalGamedataFilenames: [],
        componentGamedataFilenames: [],
        pieceGamedataFilenames: [],
        templatesDirectory: "./",
        overlaysDirectory: "./",
    }

    createFile = (filepath, contents) => {
        fs.writeFileSync(filepath, contents)
        
        this.setState({
            templateFilenames: TemplativeAccessTools.getTemplateFilenames(this.props.templativeRootDirectoryPath),
            overlayFilenames: TemplativeAccessTools.getOverlayFilenames(this.props.templativeRootDirectoryPath),
            artdataFilenames: TemplativeAccessTools.getArtdataFilenames(this.props.templativeRootDirectoryPath),
            globalGamedataFilenames: TemplativeAccessTools.getStudioAndGamedataFilenames(this.props.templativeRootDirectoryPath),
            componentGamedataFilenames: TemplativeAccessTools.getComponentGamedataFilenames(this.props.templativeRootDirectoryPath),
            pieceGamedataFilenames: TemplativeAccessTools.getPieceGamedataFilenames(this.props.templativeRootDirectoryPath)
        })
    }
    deleteFile = (filepath) => {
        fs.unlink(filepath, (err) => {
            if (err !== null) {
                console.log(err);
                return
            }
            this.setState({
                templateFilenames: TemplativeAccessTools.getTemplateFilenames(this.props.templativeRootDirectoryPath),
                overlayFilenames: TemplativeAccessTools.getOverlayFilenames(this.props.templativeRootDirectoryPath),
                artdataFilenames: TemplativeAccessTools.getArtdataFilenames(this.props.templativeRootDirectoryPath),
                globalGamedataFilenames: TemplativeAccessTools.getStudioAndGamedataFilenames(this.props.templativeRootDirectoryPath),
                componentGamedataFilenames: TemplativeAccessTools.getComponentGamedataFilenames(this.props.templativeRootDirectoryPath),
                pieceGamedataFilenames: TemplativeAccessTools.getPieceGamedataFilenames(this.props.templativeRootDirectoryPath)
            })
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

            templateFilenames: TemplativeAccessTools.getTemplateFilenames(this.props.templativeRootDirectoryPath),
            overlayFilenames: TemplativeAccessTools.getOverlayFilenames(this.props.templativeRootDirectoryPath),
            artdataFilenames: TemplativeAccessTools.getArtdataFilenames(this.props.templativeRootDirectoryPath),
            globalGamedataFilenames: TemplativeAccessTools.getStudioAndGamedataFilenames(this.props.templativeRootDirectoryPath),
            componentGamedataFilenames: TemplativeAccessTools.getComponentGamedataFilenames(this.props.templativeRootDirectoryPath),
            pieceGamedataFilenames: TemplativeAccessTools.getPieceGamedataFilenames(this.props.templativeRootDirectoryPath)
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
            this.setState({
                templateFilenames: TemplativeAccessTools.getTemplateFilenames(this.props.templativeRootDirectoryPath),
                overlayFilenames: TemplativeAccessTools.getOverlayFilenames(this.props.templativeRootDirectoryPath),
                artdataFilenames: TemplativeAccessTools.getArtdataFilenames(this.props.templativeRootDirectoryPath),
                globalGamedataFilenames: TemplativeAccessTools.getStudioAndGamedataFilenames(this.props.templativeRootDirectoryPath),
                componentGamedataFilenames: TemplativeAccessTools.getComponentGamedataFilenames(this.props.templativeRootDirectoryPath),
                pieceGamedataFilenames: TemplativeAccessTools.getPieceGamedataFilenames(this.props.templativeRootDirectoryPath)
            })
            if (this.props.currentFilepath === originalFilepath) {
                this.props.updateViewedFileCallback(this.props.currentFileType, newFilepath)
            }
            this.forceUpdate()
        });
    }
    getDefaultContentForFileBasedOnFilename = (filetype, filename) => {
        switch (filetype) {
            case "PIECE_GAMEDATA":
                return `{"displayName": "${filename}", "pieceDisplayName": "${filename}" }`
            case "KEYVALUE_GAMEDATA":
                return "[]"
            case "ARTDATA":
                return `{ "name":"${filename}", "templateFilename": "", "overlays": [], "textReplacements": [], "styleUpdates": [] }`
            default:
                return "";
        }
        
    }
    render() {
        return <React.Fragment>
            <div className="row main-game-button-row">
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openStudioGamedataCallback()}>Studio</button>
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openGameGamedataCallback()}>Game</button>
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openComponentsCallback()}>Components</button>
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openRulesCallback()}>Rules</button>
            </div>
            
            <div className="row file-explorer-row">
                <ContentFileList
                    header="Templates" 
                    contentType="ART" 
                    baseFilepath={this.state.templatesDirectory}
                    currentFilepath={this.props.currentFilepath} 
                    updateViewedFileCallback={this.props.updateViewedFileCallback} 
                    filenames={this.state.templateFilenames}
                    createFileCallback={this.createFile}
                    deleteFileCallback={this.deleteFile}
                    renameFileCallback={this.renameFile}
                />
                <ContentFileList
                    header="Overlays" 
                    contentType="ART" 
                    baseFilepath={this.state.overlaysDirectory}
                    currentFilepath={this.props.currentFilepath} 
                    updateViewedFileCallback={this.props.updateViewedFileCallback} 
                    filenames={this.state.overlayFilenames}
                    createFileCallback={this.createFile}
                    deleteFileCallback={this.deleteFile}
                    renameFileCallback={this.renameFile}
                />
                <ContentFileList
                    header="Artdata" 
                    contentType="ARTDATA" 
                    baseFilepath={this.state.artdataDirectory}
                    currentFilepath={this.props.currentFilepath} 
                    updateViewedFileCallback={this.props.updateViewedFileCallback} 
                    filenames={this.state.artdataFilenames}
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
                    baseFilepath={this.state.componentGamedataDirectory}
                    currentFilepath={this.props.currentFilepath} 
                    updateViewedFileCallback={this.props.updateViewedFileCallback} 
                    filenames={this.state.componentGamedataFilenames}
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
                    baseFilepath={this.state.piecesGamedataDirectory}
                    currentFilepath={this.props.currentFilepath} 
                    updateViewedFileCallback={this.props.updateViewedFileCallback} 
                    filenames={this.state.pieceGamedataFilenames}
                    canCreateNewFiles={true}
                    newFileExtension="json"
                    getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                    createFileCallback={this.createFile}
                    deleteFileCallback={this.deleteFile}
                    renameFileCallback={this.renameFile}
                />
            </div>       
        </React.Fragment>        
    }
}