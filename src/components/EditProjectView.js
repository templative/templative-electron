import React from "react";
import TopNavbar from './TopNavbar';
import EditPanel from './Edit/EditPanel';
import RenderPanel from './Render/RenderPanel';
import PrintPanel from './Print/PrintPanel';
import AnimatePanel from './Animate/AnimatePanel';
import UploadPanel from './Upload/UploadPanel';
import PlanPanel from './Plan/PlanPanel';
import PlaytestPanel from './Playtest/PlaytestPanel';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import CreatePanel from "./Create/CreatePanel";
import { TOP_NAVBAR_ITEMS } from "./Routes";
import { TabbedFile } from "./Edit/TabbedFile";
import TemplativeAccessTools from "./TemplativeAccessTools";
import '../App.css';

const path = window.require("path");
const fs = window.require("fs");

export default class EditProjectView extends React.Component {
  
    state = {
        currentRoute: "/",
        tabbedFiles: [
            new TabbedFile("KEYVALUE_GAMEDATA", TemplativeAccessTools.getStudioGamedataFilename(this.props.templativeRootDirectoryPath), false),
            new TabbedFile("KEYVALUE_GAMEDATA", TemplativeAccessTools.getGameGamedataFilenames(this.props.templativeRootDirectoryPath), false),
            new TabbedFile("COMPONENTS", TemplativeAccessTools.getComponentComposeFilepath(this.props.templativeRootDirectoryPath), false),
            new TabbedFile("RULES", TemplativeAccessTools.getRulesFilepath(this.props.templativeRootDirectoryPath), false),
        ],
        fileContents: undefined,
        currentFileType: "COMPONENTS",
        currentFilepath: TemplativeAccessTools.getComponentComposeFilepath(this.props.templativeRootDirectoryPath),
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

    updateViewedFile = (filetype, filepath) => {     
        // console.log(filetype, filepath)
        var fileContents = fs.readFileSync(filepath, 'utf8');
        var extension = filepath.split('.').pop()
        if (extension === "json") {
            fileContents = JSON.parse(fileContents)
        }
        if (extension === "csv") {
            fileContents = EditProjectView.#csvToJS(fileContents)
        }
        var filename = path.parse(filepath).name
        var tabbedFiles = this.addTabbedFile(filetype, filepath, this.state.tabbedFiles)
        this.setState({
            currentFileType: filetype,
            currentFilepath: filepath,
            filename: filename,
            fileContents: fileContents,
            tabbedFiles: tabbedFiles
        })
    } 
    clearViewedFile = () => {
        this.setState({
            currentFileType: "COMPONENTS",
            currentFilepath: TemplativeAccessTools.getComponentComposeFilepath(this.props.templativeRootDirectoryPath),
            filename: undefined,
            fileContents: undefined
        })
    }
    
    getCurrentRoute = () => {
      var location = window.location.href
      return location.split("http://localhost:3000")[1]
    }
    componentDidMount() {
        this.setState({
            currentRoute: this.getCurrentRoute()
        })
    }
    updateRoute = (route) => {
        this.setState({currentRoute: route})
    }
    addTabbedFile(filetype, filepath, tabbedFiles) {
        for (let index = 0; index < tabbedFiles.length; index++) {
            const tabbedFile = tabbedFiles[index];
            if (tabbedFile.filepath === filepath) {
                return tabbedFiles
            }
        }
        tabbedFiles.push(new TabbedFile(filetype, filepath))
        return tabbedFiles
    }
    checkForCurrentTabRemoved = () => {
        for (let index = 0; index < this.state.tabbedFiles.length; index++) {
            const tabbedFile = this.state.tabbedFiles[index];
            if (tabbedFile.filepath === this.state.currentFilepath) {
                return
            }
        }
        this.clearViewedFile()
    }
    closeTabAtIndex = (index) => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        if (index < 0 || index >= newTabbedFiles.length) {
            return
        }
        newTabbedFiles.splice(index, 1)
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    closeTabs = () => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        newTabbedFiles.splice(4, this.state.tabbedFiles.length)
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
                
    }
    closeTabsToLeft = (index) => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        newTabbedFiles.splice(4, Math.max(0,index-4))
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    closeTabsToRight = (index) => {
        var newTabbedFiles = Object.assign(this.state.tabbedFiles)
        newTabbedFiles.splice(index+1, Math.max(0,this.state.tabbedFiles.length-(index+1)))
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    closeAllTabsButIndex = (butIndex) => {
        var newTabbedFiles = []
        for (let index = 0; index < this.state.tabbedFiles.length; index++) {
            const tabbedFile = this.state.tabbedFiles[index];
            if (index <= 3 || index === butIndex) {
                newTabbedFiles.push(tabbedFile)
            }
        }
        this.setState({tabbedFiles: newTabbedFiles}, ()=>this.checkForCurrentTabRemoved());
    }
    render() {
        
        return <BrowserRouter>
            <TopNavbar topNavbarItems={TOP_NAVBAR_ITEMS} currentRoute={this.state.currentRoute} updateRouteCallback={this.updateRoute}/>
            <Routes>
            <Route path='/plan' element={ <PlanPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/create' element={ <CreatePanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/' element={ 
                <EditPanel 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    closeAllTabsButIndexCallback={this.closeAllTabsButIndex}
                    closeTabsToRightCallback={this.closeTabsToRight}
                    closeTabsToLeftCallback={this.closeTabsToLeft}
                    closeTabsCallback={this.closeTabs}
                    closeTabAtIndexCallback={this.closeTabAtIndex}
                    checkForCurrentTabRemovedCallback={this.checkForCurrentTabRemoved}
                    addTabbedFileCallback={this.addTabbedFile}
                    clearViewedFileCallback={this.clearViewedFile}
                    updateViewedFileCallback={this.updateViewedFile}
                    tabbedFiles={this.state.tabbedFiles}
                    currentFileType={this.state.currentFileType}
                    currentFilepath={this.state.currentFilepath}
                    fileContents={this.state.fileContents}
                /> 
            }/>
            <Route path='/render' element={ <RenderPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/print' element={ <PrintPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/playtest' element={ <PlaytestPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/upload' element={ <UploadPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/animate' element={ <AnimatePanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            </Routes>
        </BrowserRouter>
        
    }
}