import React from "react";
import TopNavbar from './TopNavbar';
import EditPanel from './Edit/EditPanel';
import RenderPanel from './Render/RenderPanel';
import MapPanel from './Map/MapPanel';
import AnimatePanel from './Animate/AnimatePanel';
import {HashRouter, Routes, Route } from "react-router-dom";
import CreatePanel from "./Create/CreatePanel";
import { TOP_NAVBAR_ITEMS } from "./Routes";
import { TabbedFile } from "./Edit/TabbedFile";
import TemplativeAccessTools from "./TemplativeAccessTools";
import '../App.css';
import FeedbackPanel from "./Feedback/FeedbackPanel";

const path = require("path");
const fs = require("fs/promises");
const axios = require("axios");

export default class EditProjectView extends React.Component {
  
    state = {
        currentRoute: "/",
        tabbedFiles: [
            
        ],
        italicsTabFilepath: undefined,
        fileContents: undefined,
        currentFileType: undefined,
        componentTypesCustomInfo: {},
        componentTypesStockInfo: {},
        currentFilepath: undefined,

        extendedFileTypes: new Set(),
        extendedDirectories: new Set(),
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
            fileContents: await EditProjectView.#loadFileContentsAsync(filepath),
            tabbedFiles: EditProjectView.#addTabbedFile(filetype, filepath, this.state.tabbedFiles),
        })
    }
    updateViewedFileUsingExplorerAsync = async (filetype, filepath) => {
        var fileExists = await EditProjectView.doesFileExist(filepath)
        if (!fileExists) {
            return
        }
        const hasItalicsFile = this.state.italicsTabFilepath !== undefined
        const isAddingItalicsFile = this.state.italicsTabFilepath === filepath
        const isSolidifyingItalicsTab = hasItalicsFile && isAddingItalicsFile
        if (isSolidifyingItalicsTab) {
            // console.log("solidifying italics tab", hasItalicsFile, isAddingItalicsFile)
            this.setState({
                currentFileType: filetype,
                currentFilepath: filepath,
                filename: path.parse(filepath).name,
                fileContents: await EditProjectView.#loadFileContentsAsync(filepath),
                italicsTabFilepath: undefined
            })
            return
        }
        const hasTabAlready = EditProjectView.#hasTabAlready(filetype, filepath, this.state.tabbedFiles)
        const isChangingItalicsTab = hasItalicsFile && !hasTabAlready
        if (isChangingItalicsTab) {
            // console.log("Changing italics tab", hasItalicsFile, isAddingItalicsFile, hasTabAlready)
            this.setState({
                currentFileType: filetype,
                currentFilepath: filepath,
                filename: path.parse(filepath).name,
                fileContents: await EditProjectView.#loadFileContentsAsync(filepath),
                tabbedFiles: EditProjectView.#replaceItalicsTabWithTab(this.state.italicsTabFilepath, filetype, filepath, this.state.tabbedFiles),
                italicsTabFilepath: filepath
            })
            return
        }
        // console.log("Default tab behavior", hasItalicsFile, isAddingItalicsFile, hasTabAlready)
        this.setState({
            currentFileType: filetype,
            currentFilepath: filepath,
            filename: path.parse(filepath).name,
            fileContents: await EditProjectView.#loadFileContentsAsync(filepath),
            tabbedFiles: EditProjectView.#addTabbedFile(filetype, filepath, this.state.tabbedFiles),
            italicsTabFilepath: !hasTabAlready ? filepath : this.state.italicsTabFilepath
        })
    }
    clickIntoFile = () => {
        if (this.state.italicsTabFilepath !== this.state.currentFilepath) {
            return
        }
        this.setState({
            italicsTabFilepath: undefined
        })
    }
    static #loadFileContentsAsync = async (filepath) => {
        var fileContentsBuffer = await fs.readFile(filepath, 'utf8');
        var fileContents = fileContentsBuffer.toString()
        var extension = filepath.split('.').pop()
        if (extension === "json") {
            return JSON.parse(fileContents)
        }
        if (extension === "csv") {
            return EditProjectView.#csvToJS(fileContents)
        }
        return fileContents
    }
    
    clearViewedFile = () => {
        this.setState({
            currentFileType: undefined,
            currentFilepath: undefined,
            filename: undefined,
            fileContents: undefined
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
    getCurrentRoute = () => {
      var location = window.location.href.split("http://localhost:3000")[1]
      location = location.replace('/main_window#','')
      return location
    }
    
    componentDidMount = async () => {
        await axios.get(`http://127.0.0.1:8080/component-info`).then((response) => {
            // console.log(response.data)    
            this.setState({componentTypesCustomInfo: response.data})
        })
        await axios.get(`http://127.0.0.1:8080/stock-info`).then((response) => {
            this.setState({componentTypesStockInfo: response.data})
        })
        // this.updateRoute(this.getCurrentRoute())
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.templativeRootDirectoryPath === this.props.templativeRootDirectoryPath) {
            return
        }
        this.setState({
            tabbedFiles: [],
            italicsTabFilepath: undefined,
            fileContents: undefined,
            currentFileType: undefined,
            currentFilepath: undefined,
        })
    }
    updateRoute = (route) => {
        route = route.replace('"/main_window#"','')
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
    checkForCurrentTabRemoved = () => {
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
            this.clearViewedFile()
        }
        if (!hasItalicsFileStill) {
            this.setState({italicsTabFilepath: undefined})
        }
    }
    closeTabAtIndexAsync = (index) => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        if (index < 0 || index >= newTabbedFiles.length) {
            return
        }
        newTabbedFiles.splice(index, 1)
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    closeTabsToLeftAsync = async (index) => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        newTabbedFiles.splice(4, Math.max(0,index-4))
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    closeTabsToRightAsync = async (index) => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        newTabbedFiles.splice(index+1, Math.max(0,this.state.tabbedFiles.length-(index+1)))
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    closeAllTabsButIndexAsync = async (butIndex) => {
        var newTabbedFiles = []
        for (let index = 0; index < this.state.tabbedFiles.length; index++) {
            const tabbedFile = this.state.tabbedFiles[index];
            if (index <= 3 || index === butIndex) {
                newTabbedFiles.push(tabbedFile)
            }
        }
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    closeAllTabsAsync = async () => {
        var newTabbedFiles = []
        for (let index = 0; index < this.state.tabbedFiles.length; index++) {
            const tabbedFile = this.state.tabbedFiles[index];
            if (index <= 3) {
                newTabbedFiles.push(tabbedFile)
            }
        }
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    render() {
        return <HashRouter>
            <TopNavbar topNavbarItems={TOP_NAVBAR_ITEMS} currentRoute={this.getCurrentRoute()} updateRouteCallback={this.updateRoute}/>
            <Routes>
                <Route path='/create' element={ 
                    <CreatePanel 
                        componentTypesCustomInfo={this.state.componentTypesCustomInfo}
                        componentTypesStockInfo={this.state.componentTypesStockInfo}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } 
                    />
                <Route path='/' element={ 
                    <EditPanel 
                        componentTypesCustomInfo={this.state.componentTypesCustomInfo}
                        componentTypesStockInfo={this.state.componentTypesStockInfo}
                        italicsTabFilepath={this.state.italicsTabFilepath}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        tabbedFiles={this.state.tabbedFiles}
                        currentFileType={this.state.currentFileType}
                        currentFilepath={this.state.currentFilepath}
                        fileContents={this.state.fileContents}
                        closeAllTabsButIndexAsyncCallback={this.closeAllTabsButIndexAsync}
                        closeAllTabsAsyncCallback={this.closeAllTabsAsync}
                        closeTabsToRightAsyncCallback={this.closeTabsToRightAsync}
                        closeTabsToLeftAsyncCallback={this.closeTabsToLeftAsync}
                        closeTabAtIndexAsyncCallback={this.closeTabAtIndexAsync}
                        checkForCurrentTabRemovedCallback={this.checkForCurrentTabRemoved}
                        clearViewedFileCallback={this.clearViewedFile}
                        clickIntoFileCallback={this.clickIntoFile}
                        updateViewedFileUsingTabAsyncCallback={this.updateViewedFileUsingTabAsync}
                        updateViewedFileUsingExplorerAsyncCallback={this.updateViewedFileUsingExplorerAsync}
                        saveFileAsyncCallback={this.saveFileAsync}
                        closeTabIfOpenByFilepathCallback={this.closeTabIfOpenByFilepath}
                        extendedDirectories={this.state.extendedDirectories}
                        changeExtendedDirectoryAsyncCallback={this.changeExtendedDirectoryAsync}
                        extendedFileTypes={this.state.extendedFileTypes}    
                        changeExtendedFileTypeAsyncCallback={this.changeExtendedFileTypeAsync}
                    /> 
                }/>
                <Route path='/render' element={ <RenderPanel email={this.props.email} token={this.props.token} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} templativeMessages={this.props.templativeMessages}/> } />
                <Route path='/animate' element={ <AnimatePanel email={this.props.email} token={this.props.token} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
                <Route path='/map' element={ <MapPanel email={this.props.email} token={this.props.token} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/>}/>
                <Route path='/feedback' element={ <FeedbackPanel email={this.props.email} token={this.props.token}/>}/>
            </Routes>
        </HashRouter>
        
    }
}