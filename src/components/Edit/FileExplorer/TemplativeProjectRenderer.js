import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import ContentFileList from "./ContentFiles/ContentFileList";
import "./TemplativeProjectRenderer.css"

const path = window.require("path")
const fs = window.require("fs")

export default class TemplativeProjectRenderer extends React.Component {   
    state = {
        gameCompose: undefined,
        filenameReferenceCounts: {},
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
    #attemptAddFileReferenceCount(filenameReferenceCounts, filepath) {
        if (!fs.existsSync(filepath)) {
            return filenameReferenceCounts
        }
        if (filenameReferenceCounts[filepath] === undefined) {
            filenameReferenceCounts[filepath] = 0
        }
        filenameReferenceCounts[filepath] = filenameReferenceCounts[filepath] + 1
        return filenameReferenceCounts
    }
    #addComponentComposeReferences(filenameReferenceCounts, gameCompose, gameComposeField, component, componentKey) {
        const referencedFilename = component[componentKey]
        if (referencedFilename === undefined) {
            return filenameReferenceCounts
        }
        var filepath = path.join(this.props.templativeRootDirectoryPath, gameCompose[gameComposeField], `${referencedFilename}.json`)
        filenameReferenceCounts = this.#attemptAddFileReferenceCount(filenameReferenceCounts, filepath)
        return filenameReferenceCounts
    }
    #saveComponentComposeFileCount = () => {
        var componentCompose = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "component-compose.json");
        var gameCompose = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "game-compose.json")
        var filenameReferenceCounts = {}
        for (let index = 0; index < componentCompose.length; index++) {
            const component = componentCompose[index];
            filenameReferenceCounts = this.#addComponentComposeReferences(filenameReferenceCounts, gameCompose, "componentGamedataDirectory", component, "componentGamedataFilename")
            filenameReferenceCounts = this.#addComponentComposeReferences(filenameReferenceCounts, gameCompose, "piecesGamedataDirectory", component, "piecesGamedataFilename")
            filenameReferenceCounts = this.#addComponentComposeReferences(filenameReferenceCounts, gameCompose, "artdataDirectory", component, "artdataFrontFilename")
            filenameReferenceCounts = this.#addComponentComposeReferences(filenameReferenceCounts, gameCompose, "artdataDirectory", component, "artdataBackFilename")
        }
        this.setState({filenameReferenceCounts: filenameReferenceCounts})
    }
    componentDidMount() {
        var gameCompose = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "game-compose.json");
        this.#saveComponentComposeFileCount()
        this.componentComposeWatcher = fs.watch(path.join(this.props.templativeRootDirectoryPath, "component-compose.json"), {}, (_, fileName) => { 
            this.#saveComponentComposeFileCount()
        }); 
        this.setState({
            gameCompose: gameCompose,
            templatesDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artTemplatesDirectory),
            overlaysDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artInsertsDirectory),
            artdataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artdataDirectory),
            piecesGamedataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.piecesGamedataDirectory),
            componentGamedataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.componentGamedataDirectory),
        })
    }
    componentWillUnmount = () => {
        if (this.componentComposeWatcher !== undefined) {
            this.componentComposeWatcher.close();
            this.componentComposeWatcher = undefined;
        }
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
                        filenameReferenceCounts={this.state.filenameReferenceCounts}
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
                        filenameReferenceCounts={this.state.filenameReferenceCounts}
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
                        filenameReferenceCounts={this.state.filenameReferenceCounts}
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
                        filenameReferenceCounts={this.state.filenameReferenceCounts}
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
                        filenameReferenceCounts={this.state.filenameReferenceCounts}
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