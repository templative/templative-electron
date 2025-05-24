import React from "react";
import TopNavbar from './TopNavbar';
import EditPanel from './Edit/EditPanel';
import RenderPanel from './Render/RenderPanel';
// import MapPanel from './Map/MapPanel';
import {HashRouter, Routes, Route } from "react-router-dom";
import CreatePanel from "./Create/CreatePanel";
import { TOP_NAVBAR_ITEMS } from "./Routes";
import { TabbedFile } from "./Edit/TabbedFile";
import TemplativeAccessTools from "./TemplativeAccessTools";
import { RenderingWorkspaceProvider } from "./Render/RenderingWorkspaceProvider";
import { OutputDirectoriesProvider } from "./OutputDirectories/OutputDirectoriesProvider";
import RulesEditor from "./Edit/Viewers/RulesEditor";
import { trackEvent } from "@aptabase/electron/renderer";
import AccountView from "./Account/AccountView";
import FontsView from "./Fonts/FontsView";
const { ipcRenderer } = window.require('electron');
const { getSyncKey } = require("./Edit/Viewers/GamedataViewer/PieceSyncingManager");
const { channels } = require("../../shared/constants");
const path = require("path");
const fs = require("fs/promises");
import { COMPONENT_INFO } from "../../shared/componentInfo";
import { STOCK_COMPONENT_INFO } from "../../shared/stockComponentInfo";
import ProjectPanel from "./Project/ProjectPanel";

export default class EditProjectView extends React.Component {
  
    state = {
        currentRoute: "create",
        tabbedFiles: [
            // new TabbedFile("COMPONENTS", path.join(this.props.templativeRootDirectoryPath, "component-compose.json"), true),
        ],
        italicsTabFilepath: undefined,
        currentFileType: undefined,
        currentFilepath: undefined,

        extendedFileTypes: new Set(),
        extendedDirectories: new Set(),
        gameCompose: {},
        componentCompose: [], // Store the parsed component-compose.json
    }
    changeExtendedDirectoryAsync = (isExtended, directory) => {
        var isAlreadyExtended = this.state.extendedDirectories.has(directory)
        
        var copiedExtendedDirectories = this.state.extendedDirectories
        if (isAlreadyExtended && !isExtended) {
            copiedExtendedDirectories.delete(directory)
        }
        if (!isAlreadyExtended && isExtended) {
            copiedExtendedDirectories.add(directory)
        }
        this.setState({extendedDirectories: copiedExtendedDirectories})
    }
    changeTabsToEditAFile = (type, filepath) => {
        var tabbedFiles = [...this.state.tabbedFiles]
        if (!EditProjectView.#hasTabAlready(type, filepath, tabbedFiles)) {
            tabbedFiles.push(new TabbedFile(type, filepath))
        }
        this.setState({
            currentRoute: "edit", 
            currentFileType: type,
            currentFilepath: filepath,
            tabbedFiles: tabbedFiles})
    }
    changeExtendedFileTypeAsync = (isExtended, filetype) => {
        var isAlreadyExtended = this.state.extendedFileTypes.has(filetype)
        var copiedExtendedFileTypes = this.state.extendedFileTypes
        if (isAlreadyExtended && !isExtended) {
            copiedExtendedFileTypes.delete(filetype)
        }
        if (!isAlreadyExtended && isExtended) {
            copiedExtendedFileTypes.add(filetype)
        }
        this.setState({extendedFileTypes: copiedExtendedFileTypes})
    }

    static #csvToJS = (csv) => {
        var lines = csv.split("\n");
        var result = [];
        var headers=lines[0].split(",");
        
        for(var i=1;i<lines.length;i++){
            if (lines[i].trim().length === 0) {
                continue;
            }
            var obj = {};
            // THis doesnt handle ,"Add this, then add that",
            var currentline=lines[i].split(",");
        
            for(var j=0;j<headers.length;j++){
                obj[headers[j].trim()] = currentline[j];
            }
        
            result.push(obj);
        }
        return result;
    }
    
    updateViewedFileUsingTabAsync = async (filetype, filepath) => {
        var fileExists = await EditProjectView.doesFileExist(filepath)
        if (!fileExists) {
            this.closeTabIfOpenByFilepath(filepath);
            return
        }
        this.setState({
            currentFileType: filetype,
            currentFilepath: filepath,
            filename: path.parse(filepath).name,
            tabbedFiles: EditProjectView.#addTabbedFile(filetype, filepath, this.state.tabbedFiles),
        })
    }
    updateViewFileAsync = async (filetype, filepath, filename) => {
        const hasItalicsFile = this.state.italicsTabFilepath !== undefined
        const isAddingItalicsFile = this.state.italicsTabFilepath === filepath
        const isSolidifyingItalicsTab = hasItalicsFile && isAddingItalicsFile
        
        if (isSolidifyingItalicsTab) {
            this.setState({
                currentFileType: filetype,
                currentFilepath: filepath,
                filename: filename,
                italicsTabFilepath: undefined
            })
            return
        }
        const hasTabAlready = EditProjectView.#hasTabAlready(filetype, filepath, this.state.tabbedFiles)
        const isChangingItalicsTab = hasItalicsFile && !hasTabAlready
        if (isChangingItalicsTab) {
            this.setState({
                currentFileType: filetype,
                currentFilepath: filepath,
                filename: filename,
                tabbedFiles: EditProjectView.#replaceItalicsTabWithTab(this.state.italicsTabFilepath, filetype, filepath, this.state.tabbedFiles),
                italicsTabFilepath: filepath
            })
            return
        }
        this.setState({
            currentFileType: filetype,
            currentFilepath: filepath,
            filename: filename,
            tabbedFiles: EditProjectView.#addTabbedFile(filetype, filepath, this.state.tabbedFiles),
            italicsTabFilepath: !hasTabAlready ? filepath : this.state.italicsTabFilepath
        })
    }
    updateViewedFileToUnifiedAsync = async(componentName) => {
        trackEvent("view_unified_component", { componentName })
        var componentComposeFilepath = path.join(this.props.templativeRootDirectoryPath, `component-compose.json`)
        var fileExists = await EditProjectView.doesFileExist(componentComposeFilepath)
        if (!fileExists) {
            return
        }
        var filetype = "UNIFIED_COMPONENT"
        this.state.componentCompose.forEach(element => {
            if (element.name === componentName && element.type.startsWith("STOCK_")) {
                filetype = "UNIFIED_STOCK"
            }
        });
        const filepath = `${componentComposeFilepath}#${componentName}`
        await this.updateViewFileAsync(filetype, filepath, componentName)        
    }
    updateViewedFileUsingExplorerAsync = async (filetype, filepath) => {
        var filename = path.parse(filepath).name
        await this.updateViewFileAsync(filetype, filepath, filename)        
    }
    clickIntoFile = () => {
        if (this.state.italicsTabFilepath !== this.state.currentFilepath) {
            return
        }
        this.setState({
            italicsTabFilepath: undefined
        })
    }
    
    clearViewedFile = () => {
        this.setState({
            currentFileType: undefined,
            currentFilepath: undefined,
            filename: undefined
        })
    }
    static doesFileExist = async (filepath) => {
        try {
            await fs.access(filepath, fs.constants.F_OK)
            return true
        }
        catch {
            return false
        }
    }
    saveFileAsync = async (filepath, stringFileContents) => {
        if (filepath === undefined || stringFileContents === undefined) {
            return
        }
        var fileExists = await EditProjectView.doesFileExist(filepath)
        if (!fileExists) {
            return
        }
        var existingContents = await fs.readFile(filepath)
        var existingContent = existingContents.toString()
        if (existingContent === stringFileContents) {
            return
        }
        await fs.writeFile(filepath, stringFileContents, 'utf-8')
    }
    closeTabIfOpenByFilepath = (filepath) => {
        const tabIndex = this.state.tabbedFiles.findIndex(tab => tab.filepath === filepath);
        if (tabIndex !== -1) {
            this.closeTabAtIndexAsync(tabIndex);
        }
    }
    
    loadGameComposeAsync = async () => {
        const filepath = path.join(this.props.templativeRootDirectoryPath, "game-compose.json");
        const content = await TemplativeAccessTools.loadFileContentsAsJson(filepath);
        if (!content["syncKeys"]) {
            content["syncKeys"] = {};
        }
        this.setState({ gameCompose: content });
    }
    saveGameComposeAsync = async (gameCompose) => {
        const filepath = path.join(this.props.templativeRootDirectoryPath, "game-compose.json");
        await this.saveFileAsync(filepath, JSON.stringify(gameCompose, null, 2));
    }
    addGameComposeSyncKeyAsync = async (pieceContentName, syncKey) => {
        const gameCompose = this.state.gameCompose;
        if (!gameCompose["syncKeys"]) {
            gameCompose["syncKeys"] = {};
        }

        if (!syncKey) {
            delete gameCompose["syncKeys"][pieceContentName]
        }
        else {
            // Extract just the key from the Google Sheets URL
            const keyMatch = syncKey.match(/key=([^&]+)/);
            const key = keyMatch ? keyMatch[1] : syncKey;
            gameCompose["syncKeys"][pieceContentName] = key;
        }
        
        await this.saveGameComposeAsync(gameCompose);
    }
    componentDidMount = async () => {
        ipcRenderer.on(channels.GIVE_OPEN_SETTINGS, this.handleOpenSettings);

        await this.loadComponentComposeAsync();
        await this.loadGameComposeAsync();
    }

    componentDidUpdate = async (prevProps) => {
        if (prevProps.templativeRootDirectoryPath === this.props.templativeRootDirectoryPath) {
            return
        }
        this.setState({
            tabbedFiles: [],
            italicsTabFilepath: undefined,
            currentFileType: undefined,
            currentFilepath: undefined,
        })

        await this.loadComponentComposeAsync();
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_OPEN_SETTINGS);
    }

    handleOpenSettings = () => {
        var settingsPath = path.join(require('os').homedir(), "Documents", "Templative", "settings.json");
        this.changeTabsToEditAFile("SETTINGS", settingsPath);
    }

    updateRoute = (route) => {
        this.setState({currentRoute: route})
    }

    static #hasTabAlready = (filetype, filepath, tabbedFiles) => {
        for (let index = 0; index < tabbedFiles.length; index++) {
            const tabbedFile = tabbedFiles[index];
            if (tabbedFile.filetype === filetype && tabbedFile.filepath === filepath) {
                return true
            }
        }
        return false
    }
    static #addTabbedFile(filetype, filepath, tabbedFiles) {
        if (EditProjectView.#hasTabAlready(filetype, filepath, tabbedFiles)) {
            return tabbedFiles
        }
        tabbedFiles.push(new TabbedFile(filetype, filepath))
        return tabbedFiles
    }
    static #replaceItalicsTabWithTab(italicsTabFilepath, filetype, filepath, tabbedFiles) {
        for (let index = 0; index < tabbedFiles.length; index++) {
            const tabbedFile = tabbedFiles[index];
            const isItalicsTab = tabbedFile.filepath === italicsTabFilepath
            if (!isItalicsTab) {
                continue
            }
            tabbedFiles[index]["filepath"] = filepath
            tabbedFiles[index]["filetype"] = filetype
            return tabbedFiles
        }
        return tabbedFiles
    }
    checkForCurrentTabRemovedAsync = async () => {
        var hasItalicsFileStill = false
        var hasCurrentFileStill = false
        for (let index = 0; index < this.state.tabbedFiles.length; index++) {
            const tabbedFile = this.state.tabbedFiles[index];
            if (tabbedFile.filepath === this.state.currentFilepath) {
                hasCurrentFileStill = true
            }
            if (tabbedFile.filepath === this.state.italicsTabFilepath) {
                hasItalicsFileStill = true
            }
        }
        if (!hasCurrentFileStill) {
            if (this.state.tabbedFiles.length === 0){
                this.setState({
                    currentFileType: undefined,
                    currentFilepath: undefined,
                    filename: undefined
                })
            }
            else {
                var newTab = this.state.tabbedFiles[0]
                if (newTab.filetype === "UNIFIED_COMPONENT" || newTab.filetype === "UNIFIED_STOCK") {
                    await this.updateViewedFileToUnifiedAsync(newTab.filepath.split("#")[1])
                }
                else {
                    await this.updateViewedFileUsingExplorerAsync(newTab.filetype, newTab.filepath)
                }
            }
        }
        if (!hasItalicsFileStill) {
            this.setState({italicsTabFilepath: undefined})
        }
    }
    closeTabAtIndexAsync = async (index) => {
        var newTabbedFiles = [...this.state.tabbedFiles]
        if (index < 0 || index >= newTabbedFiles.length) {
            return
        }
        newTabbedFiles.splice(index, 1)
        this.setState({tabbedFiles: newTabbedFiles}, async ()=> await this.checkForCurrentTabRemovedAsync());
    }
    closeTabsToLeftAsync = async (index) => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        newTabbedFiles.splice(0, Math.max(0,index))
        this.setState({tabbedFiles: newTabbedFiles}, async () => await this.checkForCurrentTabRemovedAsync());
    }
    closeTabsToRightAsync = async (index) => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        newTabbedFiles.splice(index+1, Math.max(0,this.state.tabbedFiles.length-(index+1)))
        this.setState({tabbedFiles: newTabbedFiles}, async () => await this.checkForCurrentTabRemovedAsync());
    }
    closeAllTabsButIndexAsync = async (butIndex) => {
        var newTabbedFiles = []
        for (let index = 0; index < this.state.tabbedFiles.length; index++) {
            const tabbedFile = this.state.tabbedFiles[index];
            if (index === butIndex) {
                newTabbedFiles.push(tabbedFile)
            }
        }
        this.setState({tabbedFiles: newTabbedFiles}, async () => await this.checkForCurrentTabRemovedAsync());
    }
    closeAllTabsAsync = async () => {
        var newTabbedFiles = []
        this.setState({tabbedFiles: newTabbedFiles}, async () => await this.checkForCurrentTabRemovedAsync());
    }
    loadComponentComposeAsync = async () => {
        try {
            const filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
            const content = await TemplativeAccessTools.loadFileContentsAsJson(filepath);
            const setTheRouteToCreateIfThereAreNoComponents = content.length === 0 ? "create" : "edit"
            this.setState({ componentCompose: content, currentRoute: setTheRouteToCreateIfThereAreNoComponents });
        } catch (error) {
            if (error.code === "ENOENT") {
                console.error("component-compose.json file does not exist. Please create the file and try again.")
                this.setState({ componentCompose: [], currentRoute: "create" });
                return
            }
            else if (error.code === "INVALID_JSON") {
                console.error("Invalid component-compose.json file. Please fix the file and try again.")
                this.setState({ componentCompose: [], currentRoute: "create" });
                return
            }
            throw error
        }
    }
    saveComponentComposeAsync = async (updatedContent) => {
        try {
            const filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
            await this.saveFileAsync(filepath, JSON.stringify(updatedContent, null, 2));
            const setTheRouteToCreateIfThereAreNoComponents = updatedContent.length === 0 ? "create" : "edit"
            this.setState({ componentCompose: updatedContent, currentRoute: setTheRouteToCreateIfThereAreNoComponents });
        } catch (error) {
            console.error("Error saving component-compose.json:", error);
        }
    }
    
    updateComponentComposeFieldAsync = async (index, field, value) => {
        const oldComponents = JSON.parse(JSON.stringify(this.state.componentCompose));
        const updatedComponent = oldComponents[index]
        if (updatedComponent.type.includes("STOCK_")) {
            console.error("Used the wrong function to update a stock composition")
            return;
        }
        if (field === "name") {
            await this.updateCompositionNameAsync(index, value)
            return;
        }
        const newComponents = oldComponents.map((component, i) => 
            i === index ? { ...component, [field]: value } : component
        );

        await this.saveComponentComposeAsync(newComponents);
    }
    updateCompositionNameAsync = async (index, name) => {
        var newComponents = [...this.state.componentCompose];
        const oldName = newComponents[index].name
        newComponents[index].name = name
        const filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
        
        const newTabbedFiles = [...this.state.tabbedFiles]
        var updatedContent = {
            componentCompose: newComponents
        }
        var wereTabbedFilesUpdated = false
        for (var c = 0; c < this.state.tabbedFiles.length; c++) {
            var tabbedFile = this.state.tabbedFiles[c];
            if(tabbedFile.filetype !== "UNIFIED_COMPONENT") {
                continue
            }
            const filepathName = tabbedFile.filepath.split("#")[1]
            const isOldName = filepathName === oldName
            const newFilepath = tabbedFile.filepath.replace(oldName, name)
            if (isOldName) {
                if (this.state.currentFilepath === tabbedFile.filepath) {
                    updatedContent["currentFilepath"] = newFilepath
                    updatedContent["currentFileType"] = tabbedFile.filetype
                }
                tabbedFile.filepath = newFilepath
                wereTabbedFilesUpdated = true
                console.log(this.state.currentFilepath, tabbedFile.filepath)
            }
        }
        if (wereTabbedFilesUpdated) {
            updatedContent["tabbedFiles"] = newTabbedFiles
        }
        await this.saveFileAsync(filepath, JSON.stringify(newComponents, null, 2));
        this.setState(updatedContent);
    }
    deleteCompositionAsync = async (index) => {
        const filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
        const newComponents = [...this.state.componentCompose];
        const deletedComponent = newComponents[index]
        const deletedComponentFilepath = `${filepath}#${deletedComponent.name}`
        
        newComponents.splice(index, 1);
        const updatedContent = {
            componentCompose: newComponents
        }
        const newTabbedFiles = [...this.state.tabbedFiles]
        var wereTabbedFilesUpdated = false
        for (var c = newTabbedFiles.length - 1; c >= 0; c--) {
            var tabbedFile = newTabbedFiles[c];
            if (tabbedFile.filetype !== "UNIFIED_COMPONENT") {
                continue;
            }
            const isCurrentFilepath = this.state.currentFilepath === tabbedFile.filepath;
            const isTabBeingDeleted = tabbedFile.filepath === deletedComponentFilepath;
            if (isTabBeingDeleted) {
                newTabbedFiles.splice(c, 1);
                wereTabbedFilesUpdated = true;
                const hasAnotherTab = newTabbedFiles.length > 0;
                if (isCurrentFilepath) {
                    if(hasAnotherTab) {
                        updatedContent["currentFilepath"] = newTabbedFiles[0].filepath
                        updatedContent["currentFileType"] = newTabbedFiles[0].filetype
                    }
                    else {
                        updatedContent["currentFilepath"] = undefined
                        updatedContent["currentFileType"] = undefined
                    }    
                }
            }
        }
        if (wereTabbedFilesUpdated) {
            updatedContent["tabbedFiles"] = newTabbedFiles
        }
        await this.saveFileAsync(filepath, JSON.stringify(newComponents, null, 2));
        this.setState(updatedContent);
    }
    
    
    duplicateCompositionAsync = async (index) => {
        const newComponents = [...this.state.componentCompose];
        const componentToDuplicate = { ...newComponents[index] };
        componentToDuplicate.name = `${componentToDuplicate.name} Copy`;
        newComponents.splice(index + 1, 0, componentToDuplicate);
        await this.saveComponentComposeAsync(newComponents);
    }
    
    toggleDisableCompositionAsync = async (index) => {
        const newComponents = [...this.state.componentCompose];
        newComponents[index].disabled = !newComponents[index].disabled;
        await this.saveComponentComposeAsync(newComponents);
    }
    trackChangedFilepathAsync = async (originalFilepath, newFilepath) => {
        const gameCompose = this.state.gameCompose;
        const piecesGamedataDirectory = gameCompose["piecesGamedataDirectory"];
        const isDescendantOfPiecesGamedata = originalFilepath.startsWith(path.join(this.props.templativeRootDirectoryPath, piecesGamedataDirectory));
        if (!isDescendantOfPiecesGamedata) {
            // console.log(`${originalFilepath} is not in the piecesGamedataDirectory`)
            return
        }
        const keyOfOriginalFilepath = getSyncKey(this.props.templativeRootDirectoryPath, gameCompose, originalFilepath);
        if (gameCompose["syncKeys"][keyOfOriginalFilepath] === undefined) {
            // console.log(`${keyOfOriginalFilepath} is not in the syncKeys`)
            return
        }
        const keyOfNewFilepath = getSyncKey(this.props.templativeRootDirectoryPath, gameCompose, newFilepath);
        // console.log(`${keyOfNewFilepath}: ${gameCompose["syncKeys"][keyOfOriginalFilepath]}`)
        gameCompose["syncKeys"][keyOfNewFilepath] = gameCompose["syncKeys"][keyOfOriginalFilepath];
        delete gameCompose["syncKeys"][keyOfOriginalFilepath];
        await this.saveGameComposeAsync(gameCompose);
    }
    deleteStockCompositionsWithNameAsync = async (name) => {
        var newComponents = [...this.state.componentCompose]
        
        newComponents = newComponents.filter(component => 
            !(component.type.startsWith("STOCK_") && component.name === name)
        );
        const updatedContent = {
            componentCompose: newComponents
        }
        const newTabbedFiles = [...this.state.tabbedFiles]
        var wereTabbedFilesUpdated = false
        for (var c = newTabbedFiles.length - 1; c >= 0; c--) {
            var tabbedFile = newTabbedFiles[c];
            if (tabbedFile.filetype !== "UNIFIED_STOCK") {
                continue;
            }
            const filepathName = tabbedFile.filepath.split("#")[1];
            const isCurrentFilepath = this.state.currentFilepath === tabbedFile.filepath;
            const isTabBeingDeleted = filepathName === name;
            if (isTabBeingDeleted) {
                newTabbedFiles.splice(c, 1);
                wereTabbedFilesUpdated = true;
                const hasAnotherTab = newTabbedFiles.length > 0;
                if (isCurrentFilepath) {
                    if( hasAnotherTab) {
                        updatedContent["currentFilepath"] = newTabbedFiles[0].filepath
                        updatedContent["currentFileType"] = newTabbedFiles[0].filetype
                    }
                    else {
                        updatedContent["currentFilepath"] = undefined
                        updatedContent["currentFileType"] = undefined
                    }    
                }
                
            }
        }
        if (wereTabbedFilesUpdated) {
            updatedContent["tabbedFiles"] = newTabbedFiles
        }
        const filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
        await this.saveFileAsync(filepath, JSON.stringify(newComponents, null, 2));
        this.setState(updatedContent);
    }
    updateStockComponentsWithNameAsync = async (name, field, value) => {
        if (field === "name") {
            await this.renameStockCompositionAsync(name, value)
            return
        }
        const components = [... this.state.componentCompose]
        for (var c = 0; c < components.length; c++) {
            var component = components[c];
            if (!component.type.includes("STOCK_")) {
                continue
            }
            if (component.name !== name) {
                continue
            }
            component[field] = value
        }
        await this.saveComponentComposeAsync(components)
    }
    changeStockComponentQuantityByTypeAsync = async (name, type, quantity) => {
        const components = [... this.state.componentCompose]
        var found = false;
        for (var c = 0; c < components.length; c++) {
            var component = components[c];
            if (component.type !== `STOCK_${type}`) {
                continue
            }
            if (component.name !== name) {
                continue
            }
            found = true
            component.quantity = quantity
        }
        if (!found && quantity > 0) {
            components.push({
                name: name,
                type: `STOCK_${type}`,
                quantity: quantity
            })
        }
        await this.saveComponentComposeAsync(components)   
    }
    toggleDisableStockCompositionAsync = async (name) => {
        const newComponents = [...this.state.componentCompose];
        for (var c = 0; c < newComponents.length; c++) {
            var component = newComponents[c];
            if (!component.type.includes("STOCK_")) {
                continue
            }
            if (component.name !== name) {
                continue
            }
            component.disabled = !component.disabled;
        }
        await this.saveComponentComposeAsync(newComponents);
    }
    
    renameStockCompositionAsync = async (oldName, newName) => {
        const newComponents = [...this.state.componentCompose];
        for (var c = 0; c < newComponents.length; c++) {
            var component = newComponents[c];
            if (!component.type.includes("STOCK_")) {
                continue;
            }
            if (component.name !== oldName) {
                continue;
            }
            component.name = newName;
        }
        var updatedContent = {
            componentCompose: newComponents
        }
        
        const newTabbedFiles = [...this.state.tabbedFiles]
        var wereTabbedFilesUpdated = false
        for (var c = 0; c < this.state.tabbedFiles.length; c++) {
            var tabbedFile = this.state.tabbedFiles[c];
            if(tabbedFile.filetype === "UNIFIED_STOCK") {
                const filepathName = tabbedFile.filepath.split("#")[1]
                const isOldName = filepathName === oldName
                const newFilepath = tabbedFile.filepath.replace(oldName, newName)
                if (isOldName) {
                    if (this.state.currentFilepath === tabbedFile.filepath) {
                        updatedContent["currentFilepath"] = newFilepath
                        updatedContent["currentFileType"] = tabbedFile.filetype
                    }
                    tabbedFile.filepath = newFilepath
                    wereTabbedFilesUpdated = true
                }
            }
        }
        if (wereTabbedFilesUpdated) {
            updatedContent["tabbedFiles"] = newTabbedFiles
        }
        const filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
        await this.saveFileAsync(filepath, JSON.stringify(newComponents, null, 2));
        this.setState(updatedContent);
    }
    duplicateStockCompositionAsync = async (name) => {
        const newComponents = [...this.state.componentCompose];
        for (var c = 0; c < this.state.componentCompose.length; c++) {
            var component = this.state.componentCompose[c];
            if (!component.type.includes("STOCK_")) {
                continue
            }
            if (component.name !== name) {
                continue
            }
            newComponents.push({
                ...component,
                name: `${component.name} Copy`
            })
        }
        await this.saveComponentComposeAsync(newComponents);
    }
    render() {
        return <RenderingWorkspaceProvider key={this.props.templativeRootDirectoryPath}>
            <TopNavbar hasAComponent={this.state.componentCompose.length > 0} topNavbarItems={TOP_NAVBAR_ITEMS} currentRoute={this.state.currentRoute} updateRouteCallback={this.updateRoute}/>
            <OutputDirectoriesProvider templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}>
                {this.state.currentRoute === 'create' && (
                    <CreatePanel
                        componentTypesCustomInfo={COMPONENT_INFO}
                        componentTypesStockInfo={STOCK_COMPONENT_INFO}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        changeTabsToEditAFileCallback={this.changeTabsToEditAFile}
                        saveComponentComposeAsync={this.saveComponentComposeAsync}
                    />
                )}
                {this.state.currentRoute === 'rules' && (
                    <RulesEditor 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        saveFileAsyncCallback={this.saveFileAsync}
                    />
                )}
                {this.state.currentRoute === 'project' && (
                    <ProjectPanel 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        saveFileAsyncCallback={this.saveFileAsync}
                    />
                )}

                {this.state.currentRoute === 'edit' && (
                    <EditPanel
                        componentTypesCustomInfo={COMPONENT_INFO}
                        componentTypesStockInfo={STOCK_COMPONENT_INFO}
                        italicsTabFilepath={this.state.italicsTabFilepath}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        tabbedFiles={this.state.tabbedFiles}
                        currentFileType={this.state.currentFileType}
                        currentFilepath={this.state.currentFilepath}
                        closeAllTabsButIndexAsyncCallback={this.closeAllTabsButIndexAsync}
                        closeAllTabsAsyncCallback={this.closeAllTabsAsync}
                        closeTabsToRightAsyncCallback={this.closeTabsToRightAsync}
                        closeTabsToLeftAsyncCallback={this.closeTabsToLeftAsync}
                        closeTabAtIndexAsyncCallback={this.closeTabAtIndexAsync}
                        clearViewedFileCallback={this.clearViewedFile}
                        clickIntoFileCallback={this.clickIntoFile}
                        updateViewedFileUsingTabAsyncCallback={this.updateViewedFileUsingTabAsync}
                        updateViewedFileUsingExplorerAsyncCallback={this.updateViewedFileUsingExplorerAsync}
                        updateViewedFileToUnifiedAsyncCallback={this.updateViewedFileToUnifiedAsync}
                        saveFileAsyncCallback={this.saveFileAsync}
                        closeTabIfOpenByFilepathCallback={this.closeTabIfOpenByFilepath}
                        extendedDirectories={this.state.extendedDirectories}
                        changeExtendedDirectoryAsyncCallback={this.changeExtendedDirectoryAsync}
                        extendedFileTypes={this.state.extendedFileTypes}
                        changeExtendedFileTypeAsyncCallback={this.changeExtendedFileTypeAsync}
                        updateRouteCallback={this.updateRoute}
                        componentCompose={this.state.componentCompose}
                        saveComponentComposeAsync={this.saveComponentComposeAsync}
                        updateComponentComposeFieldAsync={this.updateComponentComposeFieldAsync}
                        deleteCompositionAsync={this.deleteCompositionAsync}
                        duplicateCompositionAsync={this.duplicateCompositionAsync}
                        toggleDisableCompositionAsync={this.toggleDisableCompositionAsync}
                        gameCompose={this.state.gameCompose}
                        addGameComposeSyncKeyAsync={this.addGameComposeSyncKeyAsync}
                        trackChangedFilepathAsync={this.trackChangedFilepathAsync}
                        renameStockCompositionAsync={this.renameStockCompositionAsync}
                        deleteStockCompositionsWithNameAsync={this.deleteStockCompositionsWithNameAsync}
                        toggleDisableStockCompositionAsync={this.toggleDisableStockCompositionAsync}
                        duplicateStockCompositionAsync={this.duplicateStockCompositionAsync}
                        updateStockComponentsWithNameAsync={this.updateStockComponentsWithNameAsync}
                        changeStockComponentQuantityByTypeAsync={this.changeStockComponentQuantityByTypeAsync}
                    />
                    )}

                {this.state.currentRoute === 'render' && (
                    <RenderPanel
                        email={this.props.email}
                        token={this.props.token}
                        changeTabsToEditAFileCallback={this.changeTabsToEditAFile}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        templativeMessages={this.props.templativeMessages}
                    />
                )}
                {this.state.currentRoute === 'font' && (
                    <FontsView
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    />
                )}
                {this.state.currentRoute === 'account' && (
                    <AccountView
                        email={this.props.email}
                        token={this.props.token}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    />
                )}

                {/* {this.state.currentRoute === 'map' && (
                    <MapPanel
                        email={this.props.email}
                        token={this.props.token}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    />
                )} */}
                {/* <TutorialModal name="One Vision"/> */}
            </OutputDirectoriesProvider>
        </RenderingWorkspaceProvider>
        
    }
    
}