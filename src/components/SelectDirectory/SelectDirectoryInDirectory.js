import React from "react";
import "./SelectDirectory.css"
import DirectoryOption from "./DirectoryOption";

const fsOld = require('fs');
const fs = require('fs/promises');

export default class SelectDirectoryInDirectory extends React.Component {   
    outputFolderWatcher = undefined
    state = {
        directories: []
    }
    #getDirectories = async () => {
        if (this.props.directoryPath === undefined) {
            return
        }
        var directories = await fs.readdir(this.props.directoryPath, { withFileTypes: true })
        directories = directories.filter(dirent => dirent.isDirectory())
        console.log(directories)
        this.setState({directories: directories})
    }
    #stopWatchingBasepath = () => {
        if (this.outputFolderWatcher === undefined) {
            return
        }
        this.outputFolderWatcher.close();
        this.outputFolderWatcher = undefined;
    }
    #watchBasepathAsync = async () => {
        this.#stopWatchingBasepath()                
        if (this.props.directoryPath === undefined || this.props.directoryPath === "") {
            return
        }
        console.log(this.props.directoryPath)
        this.outputFolderWatcher = fsOld.watch(this.props.directoryPath, {recursive: true}, async (event, filename) => {
            // console.log(event, filename)
            await this.#getDirectories()
        })
            
        await this.#getDirectories()
    }
    componentDidMount = async () => {
        if (this.props.directoryPath === undefined) {
            return
        }
        await this.#watchBasepathAsync()        
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState.directories.length !== this.state.directories.length) {
            await this.props.selectDirectoryAsyncCallback(this.state.directories[this.state.directories.length-1].name)
        }
        if (this.props.directoryPath === prevProps.directoryPath) {
            return
        }
        if (this.props.directoryPath === undefined) {
            return
        }
        await this.#watchBasepathAsync()
    }
    componentWillUnmount = () => {
        this.#stopWatchingBasepath()
    }
    render() {        
        var outputDirectoryDivs = this.state.directories.map((directory) => {
            return <DirectoryOption selectedDirectory={this.props.selectedDirectory} directory={directory} key={directory.name} selectDirectoryAsyncCallback={this.props.selectDirectoryAsyncCallback}/>
        })
        outputDirectoryDivs = outputDirectoryDivs.reverse()

        return <React.Fragment>
            <div className="headerWrapper">
                <p className="resourcesHeader">{this.props.title}</p>
            </div> 
            <div className="outputFolderOptions">
                {outputDirectoryDivs.reverse()}
            </div>
        </React.Fragment>
    }
}