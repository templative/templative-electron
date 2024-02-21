import React from "react";
import "./SelectDirectory.css"
import DirectoryOption from "./DirectoryOption";
const fs = require("fs/promises")

export default class SelectDirectoryInDirectory extends React.Component { 
    state = {
        directories: []
    }  
    componentDidMount = async () => {
        await this.#loadDirectories()
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if(prevProps.directoryPath === this.props.directoryPath) {
            return
        }
        await this.#loadDirectories()
    }
    #loadDirectories = async () => {
        if (this.props.directoryPath === undefined) {
            return
        }
        var directories = await fs.readdir(this.props.directoryPath, { withFileTypes: true })
        directories = directories.filter(dirent => dirent.isDirectory())
        this.setState({directories: directories})
    }
    render() {
        var directories = this.state.directories.map(dirent => {
            return <DirectoryOption 
                selectedDirectory={this.props.selectedDirectory} 
                directory={dirent} 
                key={dirent.name} 
                selectDirectoryCallback={this.props.selectDirectoryCallback}/>
        })

        return <div>
            <div className="headerWrapper">
                <p className="resourcesHeader">{this.props.title}</p>
            </div> 
            <div className="outputFolderOptions">
                {directories}
            </div>
        </div>
    }
}