import React from "react";
import TemplativeProjectRenderer from "./FileExplorer/TemplativeProjectRenderer"
import ArtdataViewer from "./Viewers/ArtdataViewer"
import ComponentsViewer from "./Viewers/ComponentsViewer"
import PieceGamedataViewer from "./Viewers/PieceGamedataViewer"
import KeyValueGamedataViewer from "./Viewers/KeyValueGamedataViewer"
import { channels } from '../../shared/constants';
import TemplativeProject from "../TemplativeProject"
import "./EditPanel.css"
import ImageViewer from "./Viewers/ImageViewer";

const { ipcRenderer } = window.require('electron');
const path = window.require("path");
const fs = window.require("fs");

export default class EditPanel extends React.Component {   
    state = {
        currentFileType: undefined,
        currentFilepath: undefined,
        templativeProject: undefined
    }

    componentDidMount() {
        // this.renderer = ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
        //     var templativeProject = new TemplativeProject(templativeRootDirectoryPath)
        //     this.setState({templativeProject: templativeProject})
        // });
        var templativeProject = new TemplativeProject("C:/Users/User/Documents/git/nextdaygames/apcw-defines");
        this.setState({templativeProject: templativeProject})
    } 
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_TEMPLATIVE_ROOT_FOLDER);
    }

    csvToJSON(csv) {
        var lines = csv.split("\n");
        var result = [];
        var headers=lines[0].split(",");
        
        for(var i=1;i<lines.length;i++){
            var obj = {};
            var currentline=lines[i].split(",");
        
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
            }
        
            result.push(obj);
        }
        
        return result;
    }

    updateViewedFileCallback = (filetype, filepath) => {          
        var fileContents = fs.readFileSync(filepath, 'utf8');
        var extension = filepath.split('.').pop()
        if (extension === "json") {
            fileContents = JSON.parse(fileContents)
        }
        if (extension === "csv") {
            fileContents = this.csvToJSON(fileContents)
        }
        var filename = path.parse(filepath).name
        this.setState({
            currentFileType: filetype,
            currentFilepath: filepath,
            filename: filename,
            fileContents: fileContents
        })
    } 
    
    render() {
        return <div className='mainBody row '>
            <div className='col-4 left-column'>
                <TemplativeProjectRenderer templativeProject={this.state.templativeProject} currentFilepath={this.state.currentFilepath} updateViewedFileCallback={this.updateViewedFileCallback}/>
            </div>
            <div className='col-8 viewer'>
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
                {this.state.currentFileType === undefined && this.state.templativeProject !== undefined && 
                    <ComponentsViewer components={this.state.templativeProject.componentCompose}/>
                }
            </div>
            
      </div>
    }
}