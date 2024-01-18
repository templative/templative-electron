import React from "react";
import TemplativeProjectRenderer from "./FileExplorer/TemplativeProjectRenderer"
import ArtdataViewer from "./Viewers/ArtdataViewer/ArtdataViewer"
import ComponentsViewer from "./Viewers/ComponentsViewer/ComponentsViewer"
import PieceGamedataViewer from "./Viewers/GamedataViewer/PieceGamedataViewer"
import KeyValueGamedataViewer from "./Viewers/GamedataViewer/KeyValueGamedataViewer"
import "./EditPanel.css"
import ImageViewer from "./Viewers/ImageViewer";
import TemplativeAccessTools from "../TemplativeAccessTools"
import RulesEditor from "./Viewers/RulesEditor";
const path = window.require("path");
const fs = window.require("fs");

export default class EditPanel extends React.Component {   
    state = {
        currentFileType: undefined,
        currentFilepath: undefined,
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
        this.setState({
            currentFileType: filetype,
            currentFilepath: filepath,
            filename: filename,
            fileContents: fileContents
        })
    } 
    clearViewedFile() {
        this.setState({
            currentFileType: undefined,
            currentFilepath: undefined,
            filename: undefined,
            fileContents: undefined
        })
    }
    openComponents = () => {
        this.setState({
            currentFileType: undefined,
            currentFilepath: undefined,
        })
    }
    openStudioGamedata = () => {
        this.updateViewedFile("KEYVALUE_GAMEDATA", TemplativeAccessTools.getStudioGamedataFilename(this.props.templativeRootDirectoryPath))
    }
    openGameGamedata = () => {
        this.updateViewedFile("KEYVALUE_GAMEDATA", TemplativeAccessTools.getGameGamedataFilenames(this.props.templativeRootDirectoryPath))
    }
    openRules = () => {
        this.updateViewedFile("RULES", TemplativeAccessTools.getRulesFilepath(this.props.templativeRootDirectoryPath))
    }
    
    render() {
        var components = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "component-compose.json")
        
        return <div className='mainBody row '>
            <div className='col-4 left-column'>
                <TemplativeProjectRenderer 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                    currentFilepath={this.state.currentFilepath} 
                    updateViewedFileCallback={this.updateViewedFile}
                    clearViewedFileCallback={()=>this.clearViewedFile()}
                    openComponentsCallback={this.openComponents}
                    openStudioGamedataCallback={this.openStudioGamedata}
                    openGameGamedataCallback={this.openGameGamedata}
                    openRulesCallback={this.openRules}
                />
            </div>
            <div className='col-8 viewer'>
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
                {this.state.currentFileType === undefined && this.props.templativeRootDirectoryPath !== undefined && 
                    <ComponentsViewer 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        componentsFilepath={TemplativeAccessTools.getComponentComposeFilepath(this.props.templativeRootDirectoryPath)} 
                        components={components}
                    />
                }
            </div>
            
      </div>
    }
}