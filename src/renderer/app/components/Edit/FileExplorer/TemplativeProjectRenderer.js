import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import ContentFileList from "./ContentFiles/ContentFileList";
import "./TemplativeProjectRenderer.css"
import IconContentFileItem from "./ContentFiles/IconContentFileItem";
import artIcon from "../Icons/artIcon.svg"
import gamedataIcon from "../Icons/gamedataIcon.svg"
import ResourceHeader from "./ContentFiles/ResourceHeader";
import GitRow from "./Git/GitRow";

const fsOld = require('fs');
const path = require("path")
const fs = require("fs/promises")
const { exec } = require('child_process');

export default class TemplativeProjectRenderer extends React.Component {   
    state = {
        gameCompose: undefined,
        filenameReferenceCounts: {},
        templatesDirectory: undefined,
        overlaysDirectory: undefined,
        artdataDirectory: undefined,
        piecesGamedataDirectory: undefined,
        componentGamedataDirectory: undefined,
        hasGit: false,
        githubToken: false,
        componentCompose: undefined
    }

    createFileAsync = async (filepath, contents) => {
        const directory = path.dirname(filepath)
        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(filepath, contents, {}, () => {
            this.forceUpdate()
        })
    }
    deleteFileAsync = async (filepath) => {
        var filepathStats = await fs.lstat(filepath)
        const isDirectory = filepathStats.isDirectory()
        if (isDirectory) {
            await fs.rm(filepath, { recursive: true, force: true });
            return
        }
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
        try {
            const componentCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json");
            const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json");
    
            if (!componentCompose || !gameCompose) {
                console.error("Error: One of the JSON files is missing or could not be parsed.");
                return;
            }
    
            let filenameReferenceCounts = {};
    
            for (let component of componentCompose) {
                filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "componentGamedataDirectory", component, "componentGamedataFilename");
                filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "piecesGamedataDirectory", component, "piecesGamedataFilename");
                filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "artdataDirectory", component, "artdataFrontFilename");
                filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "artdataDirectory", component, "artdataBackFilename");
                filenameReferenceCounts = await this.#addComponentComposeReferencesAsync(filenameReferenceCounts, gameCompose, "artdataDirectory", component, "artdataDieFaceFilename");
            }
    
            this.setState({ filenameReferenceCounts });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
    componentDidMount = async () => {
        await this.#parseComponentComposeAsync()
    }
    #parseComponentComposeAsync = async () => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json");
        var componentCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json");
        await this.#saveComponentComposeFileCountAsync()
        
        this.#closeComponentComposeListener()
        var componentComposeFilepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json")        
        this.componentComposeWatcher = fsOld.watch(componentComposeFilepath, {}, async () => {
            await this.#saveComponentComposeFileCountAsync()
            const updatedComponentCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json");
            this.setState({ componentCompose: updatedComponentCompose });
        });
        
        this.setState({
            gameCompose: gameCompose,
            componentCompose: componentCompose,
            gameCrafterAdsDirectory: path.join(this.props.templativeRootDirectoryPath, "gamecrafter"),
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
            case "COMPONENT_GAMEDATA":
                return `{"displayName": "${filename}", "pieceDisplayName": "${filename}" }`
            case "ARTDATA":
                return `{ "name":"${filename}", "templateFilename": "", "overlays": [], "textReplacements": [], "styleUpdates": [] }`
            default:
                return "";
        }
    }

    render() {
        if (this.state.gameCompose === undefined) {
            return null
        }

        // Bundle common callbacks and props
        const commonCallbacks = {
            updateViewedFileUsingExplorerAsyncCallback: this.props.updateViewedFileUsingExplorerAsyncCallback,
            createFileAsyncCallback: this.createFileAsync,
            deleteFileAsyncCallback: this.deleteFileAsync,
            renameFileAsyncCallback: this.renameFileAsync,
            duplicateFileAsyncCallback: this.duplicateFileAsync,
            changeExtendedFileTypeAsyncCallback: this.props.changeExtendedFileTypeAsyncCallback,
            changeExtendedDirectoryAsyncCallback: this.props.changeExtendedDirectoryAsyncCallback
        }

        const commonProps = {
            templativeRootDirectoryPath: this.props.templativeRootDirectoryPath,
            currentFilepath: this.props.currentFilepath,
            extendedFileTypes: this.props.extendedFileTypes,
            extendedDirectories: this.props.extendedDirectories,
            filenameReferenceCounts: this.state.filenameReferenceCounts
        }

        const contentFileListProps = {
            ...commonProps,
            ...commonCallbacks,
            canCreateNewFiles: true,
            newFileExtension: "json",
            getDefaultContentForFileBasedOnFilenameCallback: this.getDefaultContentForFileBasedOnFilename,
        }

        const gamedataDirectory = path.join(this.props.templativeRootDirectoryPath, "gamedata")
        const artDirectory = path.join(this.props.templativeRootDirectoryPath, "art")
        const isGameDataExtended = this.props.extendedDirectories.has(gamedataDirectory);
        const isArtExtended = this.props.extendedDirectories.has(artDirectory);
        
        return <div className="row file-explorer-row g-0">
            <div className="col file-explorer-col">
                <div className="content-files-container">
                    <ResourceHeader 
                        iconSource={artIcon}
                        header="Art Files" 
                        directory={artDirectory}
                        isExtended={isArtExtended}
                        depth={0}
                        toggleExtendedAsyncCallback={() => this.props.changeExtendedDirectoryAsyncCallback(!isArtExtended, artDirectory)}/>
                    {isArtExtended &&
                        <React.Fragment>
                            <ContentFileList
                                {...contentFileListProps}
                                header="Templates" 
                                contentType="ART" 
                                baseDepth={1}
                                directoryPath={this.state.templatesDirectory}
                                baseFilepath={this.state.templatesDirectory}
                                filetype={"TEMPLATES"}    
                            />
                            <ContentFileList
                                {...contentFileListProps}
                                header="Overlays" 
                                contentType="ART" 
                                baseDepth={1}
                                directoryPath={this.state.overlaysDirectory}
                                baseFilepath={this.state.overlaysDirectory}
                                filetype={"OVERLAYS"}    
                            />
                        </React.Fragment>
                    }
                    <div className="file-explorer-spacing"/>
                    <ContentFileList
                        {...contentFileListProps}
                        header="Art Recipe Files" 
                        contentType="ARTDATA"
                        baseDepth={0}
                        directoryPath={this.state.artdataDirectory}
                        baseFilepath={this.state.artdataDirectory}
                        filetype={"ARTDATA"}    
                    />
                    <div className="file-explorer-spacing"/>

                    <ResourceHeader 
                        iconSource={gamedataIcon}
                        header="Content Files" 
                        directory={gamedataDirectory}
                        isExtended={isGameDataExtended}
                        depth={0}
                        toggleExtendedAsyncCallback={() => this.props.changeExtendedDirectoryAsyncCallback(!isGameDataExtended, gamedataDirectory)}/>
                    {isGameDataExtended &&
                        <React.Fragment>
                            <ContentFileList
                                {...contentFileListProps}
                                header="Component" 
                                contentType="COMPONENT_GAMEDATA" 
                                baseDepth={1}
                                directoryPath={this.state.componentGamedataDirectory}
                                baseFilepath={this.state.componentGamedataDirectory}
                                filetype={"COMPONENT_GAMEDATA"}    
                            />
                            <ContentFileList
                                {...contentFileListProps}
                                header="Piece" 
                                contentType="PIECE_GAMEDATA" 
                                baseDepth={1}
                                directoryPath={this.state.piecesGamedataDirectory}
                                baseFilepath={this.state.piecesGamedataDirectory}
                                filetype={"PIECE_GAMEDATA"}    
                            />
                            <IconContentFileItem
                                contentType={"STUDIO_GAMEDATA"}
                                depth={1}
                                currentFilepath={this.props.currentFilepath}
                                filepath={path.join(this.props.templativeRootDirectoryPath, "studio.json")}
                                updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                            />
                            <IconContentFileItem
                                contentType={"GAME_GAMEDATA"}
                                depth={1}
                                currentFilepath={this.props.currentFilepath}
                                filepath={path.join(this.props.templativeRootDirectoryPath, "game.json")}
                                updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                                />
                        </React.Fragment>
                    } 
                    <div className="file-explorer-spacing"/>
                    
                    {/* <IconContentFileItem
                        contentType={"COMPONENTS"}
                        currentFilepath={this.props.currentFilepath}
                        filepath={path.join(this.props.templativeRootDirectoryPath, "component-compose.json")}
                        updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                    /> */}
                    {this.state.componentCompose.map(composition => 
                        <IconContentFileItem
                            contentType={"UNIFIED_COMPONENT"}
                            currentFilepath={this.props.currentFilepath}
                            filepath={path.join(this.props.templativeRootDirectoryPath, `component-compose.json#${composition.name}`)}
                            updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                        />
                    )}
                </div>
                
                <GitRow templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/>
            </div>
            
        </div>   
    }
}