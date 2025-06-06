import React, { useState } from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import ContentFileList from "./ContentFiles/ContentFileList";
import "./TemplativeProjectRenderer.css"
import IconContentFileItem from "./ContentFiles/IconContentFileItem";
import artIcon from "../Icons/artIcon.svg?react"
import gamedataIcon from "../Icons/gamedataIcon.svg?react"
import ResourceHeader from "./ContentFiles/ResourceHeader";
// import GitRow from "./Git/GitRow";
import CompositionsList from "./CompositionsList";
import StockItemsList from "./StockItemsList";
import AssetsIcon from "../Icons/assetsIcon.svg?react"
import { RenderingWorkspaceContext } from '../../Render/RenderingWorkspaceProvider';


import ErrorIcon from "../../Toast/error.svg?react"

const fsOld = require('fs');
const path = require("path")
const fs = require("fs/promises")
const { exec } = require('child_process');

const ResourceSection = ({ 
    IconSource, 
    header, 
    directory, 
    isExtended, 
    baseDepth,
    contentFileListProps, 
    changeExtendedDirectoryAsyncCallback,
    templativeRootDirectoryPath,
    currentFilepath,
    updateViewedFileUsingExplorerAsyncCallback,
    directories
}) => {
    return (
        <div className="resource-section">
            <ResourceHeader 
                IconSource={IconSource}
                header={header} 
                directory={directory}
                isExtended={isExtended}
                depth={baseDepth}
                toggleExtendedAsyncCallback={() => changeExtendedDirectoryAsyncCallback(!isExtended, directory)}/>
            {isExtended && header === "Art Files" && (
                <React.Fragment>
                    <ContentFileList
                        {...contentFileListProps}
                        header="Templates" 
                        contentType="ART" 
                        acceptedFileExtensions={[".svg"]}
                        baseDepth={baseDepth + 1}
                        directoryPath={directories.templatesDirectory}
                        baseFilepath={directories.templatesDirectory}
                        filetype={"TEMPLATES"}    
                        templativeRootDirectoryPath={templativeRootDirectoryPath}
                    />
                    <ContentFileList
                        {...contentFileListProps}
                        header="Overlays" 
                        contentType="ART" 
                        acceptedFileExtensions={[".svg"]}
                        baseDepth={baseDepth + 1}
                        directoryPath={directories.overlaysDirectory}
                        baseFilepath={directories.overlaysDirectory}
                        filetype={"OVERLAYS"}    
                        templativeRootDirectoryPath={templativeRootDirectoryPath}
                    />
                </React.Fragment>
            )}
            {isExtended && header === "Art Recipe Files" && (
                <ContentFileList
                    {...contentFileListProps}
                    header="Art Recipe Files" 
                    contentType="ARTDATA"
                    baseDepth={baseDepth + 1}
                    acceptedFileExtensions={[".json"]}
                    directoryPath={directories.artdataDirectory}
                    baseFilepath={directories.artdataDirectory}
                    filetype={"ARTDATA"}    
                    templativeRootDirectoryPath={templativeRootDirectoryPath}
                />
            )}
            {isExtended && header === "Content Files" && (
                <React.Fragment>
                    <ContentFileList
                        {...contentFileListProps}
                        templativeRootDirectoryPath={templativeRootDirectoryPath}
                        header="Component" 
                        contentType="COMPONENT_GAMEDATA" 
                        baseDepth={baseDepth + 1}
                        acceptedFileExtensions={[".json"]}
                        directoryPath={directories.componentGamedataDirectory}
                        baseFilepath={directories.componentGamedataDirectory}
                        filetype={"COMPONENT_GAMEDATA"}           
                    />
                    <ContentFileList
                        {...contentFileListProps}
                        templativeRootDirectoryPath={templativeRootDirectoryPath}
                        header="Piece" 
                        contentType="PIECE_GAMEDATA" 
                        baseDepth={baseDepth + 1}
                        acceptedFileExtensions={[".json"]}
                        directoryPath={directories.piecesGamedataDirectory}
                        baseFilepath={directories.piecesGamedataDirectory}
                        filetype={"PIECE_GAMEDATA"}    
                    />
                    {/* <IconContentFileItem
                        contentType={"STUDIO_GAMEDATA"}
                        depth={baseDepth + 1}
                        currentFilepath={currentFilepath}
                        filepath={path.join(templativeRootDirectoryPath, "studio.json")}
                        updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                    />
                    <IconContentFileItem
                        contentType={"GAME_GAMEDATA"}
                        depth={baseDepth + 1}
                        currentFilepath={currentFilepath}
                        filepath={path.join(templativeRootDirectoryPath, "game.json")}
                        updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                    /> */}
                </React.Fragment>
            )}
        </div>
    );
};

export default class TemplativeProjectRenderer extends React.Component {   
    static contextType = RenderingWorkspaceContext;

    state = {
        gameCompose: undefined,
        failedToLoad: false,
        failedToLoadMessage: null,
        filenameReferenceCounts: {},
        templatesDirectory: undefined,
        overlaysDirectory: undefined,
        artdataDirectory: undefined,
        piecesGamedataDirectory: undefined,
        componentGamedataDirectory: undefined,
        hasGit: false,
        githubToken: false,
        isAssetsExtended: false,
        isFontsExtended: false,
        isGameCrafterAdsExtended: false,
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
        try {
            await fs.unlink(filepath);
        }
        catch (error) {
            if (error.code === "ENOENT") {
                console.error("File does not exist:", filepath);
                return
            }
            throw error
        }
        if (this.props.currentFilepath === filepath) {
            this.props.clearViewedFileCallback()
        }
        this.props.closeTabIfOpenByFilepathCallback(filepath)
    }
    #attemptAddFileReferenceCountAsync = async (filenameReferenceCounts, filepath) => {
        var fileExists = await TemplativeProjectRenderer.#doesFileExist(filepath)
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
    #ensureDirectoriesExistAsync = async (gameCompose) => {
        const directories = [
            path.join(this.props.templativeRootDirectoryPath, gameCompose.artTemplatesDirectory),
            path.join(this.props.templativeRootDirectoryPath, gameCompose.artInsertsDirectory),
            path.join(this.props.templativeRootDirectoryPath, gameCompose.artdataDirectory),
            path.join(this.props.templativeRootDirectoryPath, gameCompose.piecesGamedataDirectory),
            path.join(this.props.templativeRootDirectoryPath, gameCompose.componentGamedataDirectory),
            path.join(this.props.templativeRootDirectoryPath, "fonts"),
            path.join(this.props.templativeRootDirectoryPath, "gamecrafter"),
        ]
        
        for (const directory of directories) {
            try {
                await fs.mkdir(directory, { recursive: true });
            } catch (error) {
                if (error.code !== "EEXIST") {
                    console.error(`Failed to create directory ${directory}:`, error);
                }
            }
        }
    }
    #parseComponentComposeAsync = async () => {
        var gameCompose;
        try {
            gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json");
            if (Array.isArray(gameCompose)) {
                this.setState({ failedToLoad: true, failedToLoadMessage: "The game-compose.json file is invalid." })
                return
            }
            this.setState({ failedToLoad: false, failedToLoadMessage: null })
        }
        catch (error) {
            if (error.code === "ENOENT") {
                console.error("game-compose.json file does not exist. Please create the file and try again.")
                this.setState({ failedToLoad: true, failedToLoadMessage: "game-compose.json file does not exist. Please create the file and try again." })
                return
            }
            if (error.code === "INVALID_JSON") {
                console.error("Invalid game-compose.json file. Please fix the file and try again.")
                this.setState({ failedToLoad: true, failedToLoadMessage: "Invalid game-compose.json file. Please fix the file and try again." })
                return
            }
            this.setState({ failedToLoad: true, failedToLoadMessage: "An unknown error occurred." })
            return;
        }
        await this.#saveComponentComposeFileCountAsync()
        await this.#ensureDirectoriesExistAsync(gameCompose)
        
        this.#closeComponentComposeListener()
        var componentComposeFilepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json")        
        this.componentComposeWatcher = fsOld.watch(componentComposeFilepath, {}, async () => {
            await this.#saveComponentComposeFileCountAsync()
            const updatedComponentCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json");
            this.setState({ componentCompose: updatedComponentCompose });
        });
        
        this.setState({
            gameCompose: gameCompose,
            templatesDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artTemplatesDirectory),
            fontsDirectory: path.join(this.props.templativeRootDirectoryPath, "fonts"),
            gameCrafterAdsDirectory: path.join(this.props.templativeRootDirectoryPath, "gamecrafter"),
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
        await this.props.trackChangedFilepathAsync(originalFilepath, newFilepath)
            
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
                return `{"name": "${filename}" }`
            case "ARTDATA":
                return `{ "name":"${filename}", "templateFilename": "", "overlays": [], "textReplacements": [], "styleUpdates": [] }`
            default:
                return "";
        }
    }

    render() {
        if (this.state.failedToLoad) {
            return <div className="row file-explorer-row g-0">
                <div className="col file-explorer-col">
                    <div className="project-didnt-load-container">
                        <ErrorIcon className="project-didnt-load-icon"/>
                        <p>Failed to load your project. { this.state.failedToLoadMessage !== null ? this.state.failedToLoadMessage : ""}</p>
                    </div>
                </div>
            </div>
        }
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
        const artRecipeDirectory = path.join(this.props.templativeRootDirectoryPath, "artdata")
        const isGameDataExtended = this.props.extendedDirectories.has(gamedataDirectory);
        const isArtExtended = this.props.extendedDirectories.has(artDirectory);
        const isArtRecipeExtended = this.props.extendedDirectories.has(artRecipeDirectory);
        
        return <div className="row file-explorer-row g-0">
            <div className="col file-explorer-col">
                <CompositionsList 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    componentCompose={this.props.componentCompose}
                    saveComponentComposeAsync={this.props.saveComponentComposeAsync}
                    currentFilepath={this.props.currentFilepath}
                    updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                    updateRouteCallback={this.props.updateRouteCallback}
                    deleteCompositionCallbackAsync={this.props.deleteCompositionAsync}
                    duplicateCompositionCallbackAsync={this.props.duplicateCompositionAsync}
                    toggleDisableCompositionCallbackAsync={this.props.toggleDisableCompositionAsync}
                    updateComponentComposeFieldAsync={this.props.updateComponentComposeFieldAsync}
                    isExtended={this.context.isCompositionsExtended}
                    toggleExtendedCallback={this.context.toggleCompositionsExtended}
                />
                <StockItemsList 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    componentCompose={this.props.componentCompose}
                    saveComponentComposeAsync={this.props.saveComponentComposeAsync}
                    currentFilepath={this.props.currentFilepath}
                    updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                    updateRouteCallback={this.props.updateRouteCallback}
                    deleteStockCompositionsWithNameAsync={this.props.deleteStockCompositionsWithNameAsync}
                    toggleDisableStockCompositionAsync={this.props.toggleDisableStockCompositionAsync}
                    duplicateStockCompositionAsync={this.props.duplicateStockCompositionAsync}
                    renameStockCompositionAsync={this.props.renameStockCompositionAsync}
                    isExtended={this.context.isStockCompositionsExtended}
                    toggleExtendedCallback={this.context.toggleStockCompositionsExtended}
                />
                
                            
                {this.state.templatesDirectory !== this.state.overlaysDirectory ? (
                    <ResourceSection 
                        IconSource={artIcon}
                        header="Art Files"
                        baseDepth={0}
                        directory={artDirectory}
                        filenameReferenceCounts={this.state.filenameReferenceCounts}
                        isExtended={isArtExtended}
                        contentFileListProps={contentFileListProps}
                        changeExtendedDirectoryAsyncCallback={this.props.changeExtendedDirectoryAsyncCallback}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        currentFilepath={this.props.currentFilepath}
                        updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                        directories={{
                            templatesDirectory: this.state.templatesDirectory,
                            overlaysDirectory: this.state.overlaysDirectory,
                        }}
                    />
                ) : (
                    <ContentFileList
                        {...contentFileListProps}
                        header="Art Files" 
                        contentType="ART"
                        baseDepth={0}
                        filenameReferenceCounts={this.state.filenameReferenceCounts}
                        acceptedFileExtensions={[".svg"]}
                        directoryPath={this.state.templatesDirectory}
                        baseFilepath={this.state.templatesDirectory}
                        filetype={"ART"}      
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    />
                )}
                <ContentFileList
                    {...contentFileListProps}
                    header="Art Recipes" 
                    contentType="ARTDATA"
                    baseDepth={0}
                    directoryPath={artRecipeDirectory}
                    filenameReferenceCounts={this.state.filenameReferenceCounts}
                    baseFilepath={artRecipeDirectory}
                    filetype={"ARTDATA"}    
                    acceptedFileExtensions={[".json"]}
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                />
                
                <ContentFileList
                    {...contentFileListProps}
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    header="Component Content" 
                    contentType="COMPONENT_GAMEDATA" 
                    baseDepth={0}
                    acceptedFileExtensions={[".json"]}
                    directoryPath={this.state.componentGamedataDirectory}
                    baseFilepath={this.state.componentGamedataDirectory}
                    filetype={"COMPONENT_GAMEDATA"}           
                />
                <ContentFileList
                    {...contentFileListProps}
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    header="Piece Content" 
                    contentType="PIECE_GAMEDATA" 
                    baseDepth={0}
                    acceptedFileExtensions={[".json"]}
                    directoryPath={this.state.piecesGamedataDirectory}
                    baseFilepath={this.state.piecesGamedataDirectory}
                    filetype={"PIECE_GAMEDATA"}    
                />
            </div>
            
            {/* <GitRow templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> */}
        </div>   
    }
}