import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import ContentFileList from "./ContentFiles/ContentFileList";
import "./TemplativeProjectRenderer.css"

const fsOld = require('fs');
const path = require("path")
const fs = require("fs/promises")

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
    deleteFileAsync = async (filepath) => {
        console.log(`Deleting ${filepath}`)
        await fs.unlink(filepath, (err) => {
            if (err !== null) {
                console.error(err);
                return
            }
            if (this.props.currentFilepath === filepath) {
                this.props.clearViewedFileCallback()
            }
            this.props.closeTabIfOpenByFilepathCallback(filepath)
        });
    }
    #attemptAddFileReferenceCountAsync = async (filenameReferenceCounts, filepath) => {
        var fileExists = TemplativeProjectRenderer.#doesFileExist(filepath)
        if (!fileExists) {
            return filenameReferenceCounts
        }
        var count = (filenameReferenceCounts[filepath] !== undefined ? filenameReferenceCounts[filepath] : 0) + 1
        filenameReferenceCounts[filepath] = count
        return filenameReferenceCounts
    }
    #addComponentComposeReferencesAsync = async (filenameReferenceCounts, gameCompose, gameComposeField, component, componentKey) => {
        const referencedFilename = component[componentKey]
        if (referencedFilename === undefined) {
            return filenameReferenceCounts
        }
        var filepath = path.join(this.props.templativeRootDirectoryPath, gameCompose[gameComposeField], `${referencedFilename}.json`)
        return await this.#attemptAddFileReferenceCountAsync(filenameReferenceCounts, filepath)
    }
    #saveComponentComposeFileCountAsync = async () => {
        var componentCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json");
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var filenameReferenceCounts = {}
        for (let index = 0; index < componentCompose.length; index++) {
            const component = componentCompose[index];
            filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "componentGamedataDirectory", component, "componentGamedataFilename")
            filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "piecesGamedataDirectory", component, "piecesGamedataFilename")
            filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "artdataDirectory", component, "artdataFrontFilename")
            filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "artdataDirectory", component, "artdataBackFilename")
            filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "artdataDirectory", component, "artdataDieFaceFilename")
        }
        this.setState({filenameReferenceCounts: filenameReferenceCounts})
    }
    componentDidMount = async () => {
        await this.#parseComponentComposeAsync()
    }
    #parseComponentComposeAsync = async () => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json");
        await this.#saveComponentComposeFileCountAsync()
        
        this.#closeComponentComposeListener()
        var componentComposeFilepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json")        
        this.componentComposeWatcher = fsOld.watch(componentComposeFilepath, {}, async () => {
            await this.#saveComponentComposeFileCountAsync()
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

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.templativeRootDirectoryPath === this.props.templativeRootDirectoryPath) {
            return
        }
        await this.#parseComponentComposeAsync()
    }

    #closeComponentComposeListener = () => {
        if (this.componentComposeWatcher === undefined) {
            return
        }
        this.componentComposeWatcher.close();
        this.componentComposeWatcher = undefined;
    }

    componentWillUnmount = () => {
        this.#closeComponentComposeListener()
    }

    renameFileAsync = async (originalFilepath, newFilepath) => {
        if (await TemplativeProjectRenderer.#doesFileExist(newFilepath)) {
            return
        }
        const possibleCreatedDirectory = path.parse(newFilepath).dir
        await fs.mkdir(possibleCreatedDirectory, {recursive: true})
        await fs.rename(originalFilepath, newFilepath)
            
        if (this.props.currentFilepath === originalFilepath) {
            await this.props.updateViewedFileUsingExplorerAsyncCallback(this.props.currentFileType, newFilepath)
        }
        this.forceUpdate()        
    }
    static #doesFileExist = async (filepath) => {
        try {
            await fs.access(filepath, fs.constants.F_OK)
            return true
        }
        catch {
            return false
        }
    }
    static #getCopiedFilepathAsync = async (filepath) => {
        const parsedPath = path.parse(filepath)
        var newFilepath = path.join(parsedPath.dir, `${parsedPath.name}_Copy${path.extname(filepath)}`)
        const fileExists = await TemplativeProjectRenderer.#doesFileExist(newFilepath)
        if (fileExists) {
            return await TemplativeProjectRenderer.#getCopiedFilepathAsync(newFilepath)
        }
        return newFilepath 
        
        
    }
    duplicateFileAsync = async (filepath) => {
        const newFilepath = await TemplativeProjectRenderer.#getCopiedFilepathAsync(filepath)
        var contentsBuffer = await fs.readFile(filepath)
        await fs.writeFile(newFilepath, contentsBuffer.toString(), "utf-8")        
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
                <div className="row file-explorer-row g-0">
                    <div className="col">
                        <ContentFileList
                            header="Templates" 
                            contentType="ART" 
                            filenameReferenceCounts={this.state.filenameReferenceCounts}
                            directoryPath={this.state.templatesDirectory}
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            baseFilepath={this.state.templatesDirectory}
                            currentFilepath={this.props.currentFilepath} 
                            updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback} 
                            createFileCallback={this.createFile}
                            deleteFileAsyncCallback={this.deleteFileAsync}
                            renameFileAsyncCallback={this.renameFileAsync}
                            duplicateFileAsyncCallback={this.duplicateFileAsync}
                        />
                        <ContentFileList
                            header="Overlays" 
                            contentType="ART" 
                            filenameReferenceCounts={this.state.filenameReferenceCounts}
                            directoryPath={this.state.overlaysDirectory}
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            baseFilepath={this.state.overlaysDirectory}
                            currentFilepath={this.props.currentFilepath} 
                            updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback} 
                            createFileCallback={this.createFile}
                            deleteFileAsyncCallback={this.deleteFileAsync}
                            renameFileAsyncCallback={this.renameFileAsync}
                            duplicateFileAsyncCallback={this.duplicateFileAsync}
                        />
                        <ContentFileList
                            header="Artdata" 
                            contentType="ARTDATA" 
                            filenameReferenceCounts={this.state.filenameReferenceCounts}
                            directoryPath={this.state.artdataDirectory}
                            baseFilepath={this.state.artdataDirectory}
                            currentFilepath={this.props.currentFilepath} 
                            updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback} 
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            canCreateNewFiles={true}
                            newFileExtension="json"
                            getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                            createFileCallback={this.createFile}
                            deleteFileAsyncCallback={this.deleteFileAsync}
                            renameFileAsyncCallback={this.renameFileAsync}
                            duplicateFileAsyncCallback={this.duplicateFileAsync}
                        />
                        <ContentFileList
                            header="Component Gamedata" 
                            contentType="KEYVALUE_GAMEDATA" 
                            filenameReferenceCounts={this.state.filenameReferenceCounts}
                            directoryPath={this.state.componentGamedataDirectory}
                            baseFilepath={this.state.componentGamedataDirectory}
                            currentFilepath={this.props.currentFilepath} 
                            updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback} 
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            canCreateNewFiles={true}
                            newFileExtension="json"
                            getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                            createFileCallback={this.createFile}
                            deleteFileAsyncCallback={this.deleteFileAsync}
                            renameFileAsyncCallback={this.renameFileAsync}
                            duplicateFileAsyncCallback={this.duplicateFileAsync}
                        />
                        <ContentFileList
                            header="Piece Gamedata" 
                            contentType="PIECE_GAMEDATA" 
                            filenameReferenceCounts={this.state.filenameReferenceCounts}
                            directoryPath={this.state.piecesGamedataDirectory}
                            baseFilepath={this.state.piecesGamedataDirectory}
                            currentFilepath={this.props.currentFilepath} 
                            updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback} 
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            canCreateNewFiles={true}
                            newFileExtension="json"
                            getDefaultContentForFileBasedOnFilenameCallback={this.getDefaultContentForFileBasedOnFilename}
                            createFileCallback={this.createFile}
                            deleteFileAsyncCallback={this.deleteFileAsync}
                            renameFileAsyncCallback={this.renameFileAsync}
                            duplicateFileAsyncCallback={this.duplicateFileAsync}
                        />
                </div>
            </div>       
            }
        </React.Fragment>        
    }
}