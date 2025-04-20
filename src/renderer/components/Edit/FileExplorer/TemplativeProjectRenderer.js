import React, { useState } from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import ContentFileList from "./ContentFiles/ContentFileList";
import "./TemplativeProjectRenderer.css"
import IconContentFileItem from "./ContentFiles/IconContentFileItem";
import artIcon from "../Icons/artIcon.svg?react"
import gamedataIcon from "../Icons/gamedataIcon.svg?react"
import ResourceHeader from "./ContentFiles/ResourceHeader";
import GitRow from "./Git/GitRow";
import CompositionsList from "./CompositionsList";
import StockItemsList from "./StockItemsList";

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
                depth={0}
                toggleExtendedAsyncCallback={() => changeExtendedDirectoryAsyncCallback(!isExtended, directory)}/>
            {isExtended && header === "Art Files" && (
                <React.Fragment>
                    <ContentFileList
                        {...contentFileListProps}
                        header="Templates" 
                        contentType="ART" 
                        baseDepth={1}
                        directoryPath={directories.templatesDirectory}
                        baseFilepath={directories.templatesDirectory}
                        filetype={"TEMPLATES"}    
                    />
                    <ContentFileList
                        {...contentFileListProps}
                        header="Overlays" 
                        contentType="ART" 
                        baseDepth={1}
                        directoryPath={directories.overlaysDirectory}
                        baseFilepath={directories.overlaysDirectory}
                        filetype={"OVERLAYS"}    
                    />
                </React.Fragment>
            )}
            {isExtended && header === "Art Recipe Files" && (
                <ContentFileList
                    {...contentFileListProps}
                    header="Art Recipe Files" 
                    contentType="ARTDATA"
                    baseDepth={0}
                    directoryPath={directories.artdataDirectory}
                    baseFilepath={directories.artdataDirectory}
                    filetype={"ARTDATA"}    
                />
            )}
            {isExtended && header === "Content Files" && (
                <React.Fragment>
                    <ContentFileList
                        {...contentFileListProps}
                        header="Component" 
                        contentType="COMPONENT_GAMEDATA" 
                        baseDepth={1}
                        directoryPath={directories.componentGamedataDirectory}
                        baseFilepath={directories.componentGamedataDirectory}
                        filetype={"COMPONENT_GAMEDATA"}    
                    />
                    <ContentFileList
                        {...contentFileListProps}
                        header="Piece" 
                        contentType="PIECE_GAMEDATA" 
                        baseDepth={1}
                        directoryPath={directories.piecesGamedataDirectory}
                        baseFilepath={directories.piecesGamedataDirectory}
                        filetype={"PIECE_GAMEDATA"}    
                    />
                    <IconContentFileItem
                        contentType={"STUDIO_GAMEDATA"}
                        depth={1}
                        currentFilepath={currentFilepath}
                        filepath={path.join(templativeRootDirectoryPath, "studio.json")}
                        updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                    />
                    <IconContentFileItem
                        contentType={"GAME_GAMEDATA"}
                        depth={1}
                        currentFilepath={currentFilepath}
                        filepath={path.join(templativeRootDirectoryPath, "game.json")}
                        updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                    />
                </React.Fragment>
            )}
        </div>
    );
};

export default class TemplativeProjectRenderer extends React.Component {   
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
        var gameCompose;
        try {
            gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json");
            if (!Array.isArray(gameCompose)) {
                this.setState({ failedToLoad: true, failedToLoadMessage: "The game-compose.json file is not a valid array." })
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
        
        this.#closeComponentComposeListener()
        var componentComposeFilepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json")        
        this.componentComposeWatcher = fsOld.watch(componentComposeFilepath, {}, async () => {
            await this.#saveComponentComposeFileCountAsync()
            const updatedComponentCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json");
            this.setState({ componentCompose: updatedComponentCompose });
        });
        
        this.setState({
            gameCompose: gameCompose,
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
        const artRecipeDirectory = path.join(this.props.templativeRootDirectoryPath, "artdata")
        const isGameDataExtended = this.props.extendedDirectories.has(gamedataDirectory);
        const isArtExtended = this.props.extendedDirectories.has(artDirectory);
        const isArtRecipeExtended = this.props.extendedDirectories.has(artRecipeDirectory);
        
        return <div className="row file-explorer-row g-0">
            <div className="col file-explorer-col">
                <div className="content-files-container">
                    <div className="actual-files">
                    {this.state.templatesDirectory !== this.state.overlaysDirectory ? (
                        <ResourceSection 
                            IconSource={artIcon}
                            header="Art Files"
                            directory={artDirectory}
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
                            directoryPath={this.state.templatesDirectory}
                            baseFilepath={this.state.templatesDirectory}
                            filetype={"ART"}      
                        />
                    )}
                    <ContentFileList
                        {...contentFileListProps}
                        header="Art Recipe Files" 
                        contentType="ARTDATA"
                        baseDepth={0}
                        directoryPath={artRecipeDirectory}
                        baseFilepath={artRecipeDirectory}
                        filetype={"ARTDATA"}    
                    />
                    
                    <ResourceSection 
                        IconSource={gamedataIcon}
                        header="Content Files"
                        directory={gamedataDirectory}
                        isExtended={isGameDataExtended}
                        contentFileListProps={contentFileListProps}
                        changeExtendedDirectoryAsyncCallback={this.props.changeExtendedDirectoryAsyncCallback}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        currentFilepath={this.props.currentFilepath}
                        updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                        directories={{
                            componentGamedataDirectory: this.state.componentGamedataDirectory,
                            piecesGamedataDirectory: this.state.piecesGamedataDirectory
                        }}
                    />
                    </div>
                    <div className="compositions">
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
                        />
                        <StockItemsList 
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            componentCompose={this.props.componentCompose}
                            saveComponentComposeAsync={this.props.saveComponentComposeAsync}
                            currentFilepath={this.props.currentFilepath}
                            updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                            updateRouteCallback={this.props.updateRouteCallback}
                            deleteCompositionCallbackAsync={this.props.deleteCompositionAsync}
                            duplicateCompositionCallbackAsync={this.props.duplicateCompositionAsync}
                            toggleDisableCompositionCallbackAsync={this.props.toggleDisableCompositionAsync}
                        />
                    </div>
                </div>
                
                <GitRow templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/>
            </div>
            
        </div>   
    }
}