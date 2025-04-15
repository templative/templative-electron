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
const { ipcRenderer } = window.require('electron');
const { channels } = require("../../shared/constants");
const path = require("path");
const fs = require("fs/promises");
import { COMPONENT_INFO } from "../../shared/componentInfo";
import { STOCK_COMPONENT_INFO } from "../../shared/stockComponentInfo";

export default class EditProjectView extends React.Component {
  
    state = {
        currentRoute: "edit",
        tabbedFiles: [
            // new TabbedFile("COMPONENTS", path.join(this.props.templativeRootDirectoryPath, "component-compose.json"), true),
        ],
        italicsTabFilepath: undefined,
        currentFileType: undefined,
        currentFilepath: undefined,

        extendedFileTypes: new Set(),
        extendedDirectories: new Set(),
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
        const filetype = "UNIFIED_COMPONENT"
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
        for (let index = 0; index < this.state.tabbedFiles.length; index++) {
            const tabbedFile = this.state.tabbedFiles[index];
            if (tabbedFile.filepath !== filepath) {
                continue
            }
            this.closeTabAtIndex(index)
            return
        }
    }
    
    
    componentDidMount = async () => {
        ipcRenderer.on(channels.GIVE_OPEN_SETTINGS, () => {
            var settingsPath = path.join(require('os').homedir(), "Documents", "Templative", "settings.json")
            this.changeTabsToEditAFile("SETTINGS", settingsPath)
        });

        await this.loadComponentComposeAsync();
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
                if (newTab.filetype === "UNIFIED_COMPONENT") {
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
        newTabbedFiles.splice(4, Math.max(0,index-4))
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
            if (index <= 3 || index === butIndex) {
                newTabbedFiles.push(tabbedFile)
            }
        }
        this.setState({tabbedFiles: newTabbedFiles}, async () => await this.checkForCurrentTabRemovedAsync());
    }
    closeAllTabsAsync = async () => {
        var newTabbedFiles = []
        for (let index = 0; index < this.state.tabbedFiles.length; index++) {
            const tabbedFile = this.state.tabbedFiles[index];
            if (index <= 3) {
                newTabbedFiles.push(tabbedFile)
            }
        }
        this.setState({tabbedFiles: newTabbedFiles}, async () => await this.checkForCurrentTabRemovedAsync());
    }
    loadComponentComposeAsync = async () => {
        try {
            const filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
            const content = await TemplativeAccessTools.loadFileContentsAsJson(filepath);
            this.setState({ componentCompose: content });
        } catch (error) {
            console.error("Error loading component-compose.json:", error);
            this.setState({ componentCompose: [] });
        }
    }
    saveComponentComposeAsync = async (updatedContent) => {
        try {
            const filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
            await this.saveFileAsync(filepath, JSON.stringify(updatedContent, null, 2));
            this.setState({ componentCompose: updatedContent });
        } catch (error) {
            console.error("Error saving component-compose.json:", error);
        }
    }
    
    updateComponentComposeFieldAsync = async (index, field, value) => {
        const oldComponents = JSON.parse(JSON.stringify(this.state.componentCompose));
        const newComponents = oldComponents.map((component, i) => 
            i === index ? { ...component, [field]: value } : component
        );

        await this.saveComponentComposeAsync(newComponents);
    }
    deleteCompositionAsync = async (index) => {
        const newComponents = [...this.state.componentCompose];
        newComponents.splice(index, 1);
        await this.saveComponentComposeAsync(newComponents);
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
    render() {
        return <RenderingWorkspaceProvider key={this.props.templativeRootDirectoryPath}>
            <TopNavbar topNavbarItems={TOP_NAVBAR_ITEMS} currentRoute={this.state.currentRoute} updateRouteCallback={this.updateRoute}/>
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
                {this.state.currentRoute === 'project' && (
                    <ComponentsViewer 
                        updateViewedFileUsingExplorerAsyncCallback ={this.updateViewedFileUsingExplorerAsync}
                        updateViewedFileToUnifiedAsyncCallback={this.updateViewedFileToUnifiedAsync}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        saveFileAsyncCallback={this.saveFileAsync}
                        componentTypesCustomInfo={COMPONENT_INFO}
                        componentTypesStockInfo={STOCK_COMPONENT_INFO}
                        
                        componentComposeScollPosition={this.state.componentComposeScollPosition}     
                        updateComponentComposeScrollPositionCallback={this.updateComponentComposeScrollPosition}         
                        updateRouteCallback={this.props.updateRouteCallback}
                    />
                )}
                {this.state.currentRoute === 'rules' && (
                    <RulesEditor 
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

                {/* {this.state.currentRoute === 'map' && (
                    <MapPanel
                        email={this.props.email}
                        token={this.props.token}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    />
                )} */}
            </OutputDirectoriesProvider>
        </RenderingWorkspaceProvider>
        
    }
}