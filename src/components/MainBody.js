import React from "react";
import TemplativeProjectRenderer from "./FileExplorer/TemplativeProjectRenderer"
import ArtdataViewer from "./Viewers/ArtdataViewer"
import FileViewer from "./Viewers/FileViewer"

import "./MainBody.css"

const path = window.require("path");
const fs = window.require("fs");

export default class MainBody extends React.Component {   
    state = {
        currentFileType: undefined,
        currentFilepath: undefined
    }

    updateViewedFileCallback = (filetype, filepath) => {          
        var fileContents = fs.readFileSync(filepath, 'utf8');
        var extension = filepath.split('.').pop()
        if (extension === "json") {
            fileContents = JSON.parse(fileContents)
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
                <TemplativeProjectRenderer currentFilepath={this.state.currentFilepath} updateViewedFileCallback={this.updateViewedFileCallback}/>
            </div>
            <div className='col-8'>
                {this.state.currentFileType === "ARTDATA" &&
                    <ArtdataViewer filename={this.state.filename} fileContents={this.state.fileContents} currentFilepath={this.state.currentFilepath}/>
                }
                {this.state.currentFileType === "ART" &&
                    <FileViewer filename={this.state.filename} fileContents={this.state.fileContents} currentFilepath={this.state.currentFilepath}/>
                }
            </div>
            
      </div>
    }
}