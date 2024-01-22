import React from "react";
import TemplativeProjectRenderer from "./FileExplorer/TemplativeProjectRenderer"
import ArtdataViewer from "./Viewers/ArtdataViewer/ArtdataViewer"
import ComponentsViewer from "./Viewers/ComponentsViewer/ComponentsViewer"
import PieceGamedataViewer from "./Viewers/GamedataViewer/PieceGamedataViewer"
import KeyValueGamedataViewer from "./Viewers/GamedataViewer/KeyValueGamedataViewer"
import ImageViewer from "./Viewers/ImageViewer";
import TemplativeAccessTools from "../TemplativeAccessTools"
import RulesEditor from "./Viewers/RulesEditor";
import EditPanelTabs from "./EditPanelTabs";

import "./EditPanel.css"
import "./EditPanelTabs.css"

const path = window.require("path");
const fs = window.require("fs");

class TabbedFile {
    filepath
    filetype
    canClose
    constructor(filetype, filepath, canClose=true) {
        this.filepath = filepath
        this.filetype = filetype
        this.canClose = canClose 
    }
}

export default class EditPanel extends React.Component {   
    state = {
        currentFileType: "COMPONENTS",
        currentFilepath: TemplativeAccessTools.getComponentComposeFilepath(this.props.templativeRootDirectoryPath),
        tabbedFiles: [
            new TabbedFile("KEYVALUE_GAMEDATA", TemplativeAccessTools.getStudioGamedataFilename(this.props.templativeRootDirectoryPath), false),
            new TabbedFile("KEYVALUE_GAMEDATA", TemplativeAccessTools.getGameGamedataFilenames(this.props.templativeRootDirectoryPath), false),
            new TabbedFile("COMPONENTS", TemplativeAccessTools.getComponentComposeFilepath(this.props.templativeRootDirectoryPath), false),
            new TabbedFile("RULES", TemplativeAccessTools.getRulesFilepath(this.props.templativeRootDirectoryPath), false),
        ],
    }
    csvToJS(csv) {
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

    updateViewedFile = (filetype, filepath) => {     
        // console.log(filetype, filepath)
        var fileContents = fs.readFileSync(filepath, 'utf8');
        var extension = filepath.split('.').pop()
        if (extension === "json") {
            fileContents = JSON.parse(fileContents)
        }
        if (extension === "csv") {
            fileContents = this.csvToJS(fileContents)
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
    clearViewedFile() {
        this.setState({
            currentFileType: "COMPONENTS",
            currentFilepath: TemplativeAccessTools.getComponentComposeFilepath(this.props.templativeRootDirectoryPath),
            filename: undefined,
            fileContents: undefined
        })
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
        var components = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "component-compose.json")
        var filepathSplit = this.state.currentFilepath.replace(/\\/g,"/").replace(/^\/|\/$/g, '').split("/").join(" > ")
        return <div className='mainBody row '>
            <div className='col-3 left-column'>
                <TemplativeProjectRenderer 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                    currentFileType={this.state.currentFileType}
                    currentFilepath={this.state.currentFilepath} 
                    updateViewedFileCallback={this.updateViewedFile}
                    clearViewedFileCallback={()=>this.clearViewedFile()}
                    openComponentsCallback={this.openComponents}
                    openStudioGamedataCallback={this.openStudioGamedata}
                    openGameGamedataCallback={this.openGameGamedata}
                    openRulesCallback={this.openRules}
                />
            </div>
            <div className='col-9 viewer'>
                <EditPanelTabs 
                    currentFilepath={this.state.currentFilepath} 
                    tabbedFiles={this.state.tabbedFiles}
                    updateViewedFileCallback={this.updateViewedFile}
                    closeAllTabsCallback={this.closeTabs}
                    closeTabAtIndexCallback={this.closeTabAtIndex}
                    closeTabsToLeftCallback={this.closeTabsToLeft}
                    closeTabsToRightCallback={this.closeTabsToRight}
                    closeAllTabsButIndexCallback={this.closeAllTabsButIndex}
                />
                <div className="filename-row">
                    <p className="filename-title">{filepathSplit}</p>
                </div>
                <div className="file-contents">
                    {this.state.currentFileType === "RULES" &&
                        <RulesEditor 
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            filename={this.state.filename} fileContents={this.state.fileContents} currentFilepath={this.state.currentFilepath}/>
                    }
                    {this.state.currentFileType === "ARTDATA" &&
                        <ArtdataViewer filename={this.state.filename} fileContents={this.state.fileContents} currentFilepath={this.state.currentFilepath}/>
                    }
                    {this.state.currentFileType === "ART" &&
                        <ImageViewer filename={this.state.filename} fileContents={this.state.fileContents} currentFilepath={this.state.currentFilepath}/>
                    }
                    {this.state.currentFileType === "PIECE_GAMEDATA" &&
                        <PieceGamedataViewer filename={this.state.filename} fileContents={this.state.fileContents} currentFilepath={this.state.currentFilepath}/>
                    }
                    {this.state.currentFileType === "KEYVALUE_GAMEDATA" &&
                        <KeyValueGamedataViewer filename={this.state.filename} fileContents={this.state.fileContents} currentFilepath={this.state.currentFilepath}/>
                    }
                    {this.state.currentFileType === "COMPONENTS" && 
                        <ComponentsViewer 
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            componentsFilepath={this.props.currentFilepath} 
                            components={components}
                        />
                    }
                </div>
            </div>
            
      </div>
    }
}