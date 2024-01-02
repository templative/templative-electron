import React from "react";
import "./SelectDirectory.css"
import DirectoryOption from "./DirectoryOption";
const fs = window.require("fs")

export default class SelectDirectoryInDirectory extends React.Component {   
    render() {
        var directories = []
        if (this.props.directoryPath !== "") {
            directories = fs.readdirSync(this.props.directoryPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => {
                    return <DirectoryOption 
                        selectedDirectory={this.props.selectedDirectory} 
                        directory={dirent} 
                        key={dirent.name} 
                        selectDirectoryCallback={this.props.selectDirectoryCallback}/>
                })
        }
    
        return <div>
            <div className="headerWrapper">
                <p className="resourcesHeader">{this.props.title} {this.props.directoryPath}</p>
            </div> 
            <div className="outputFolderOptions">
                {directories}
            </div>
        </div>
    }
}