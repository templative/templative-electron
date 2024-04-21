import React from "react";
import "./RenderPanel.css"
import ComponentOutputDirectory from "./ComponentOutputDirectory";
const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class OutputExplorer extends React.Component { 
    state = {
        componentDirectories: [],
        totalFiles: 1,
        doneFiles: 1,
    }  
   
    #getOutputComponentDirectories = async () => {
        var componentDirectories = await fs.readdir(this.props.outputFolderPath, { withFileTypes: true, })
        componentDirectories = componentDirectories
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(dirent.path, dirent.name))

        var totalFiles = 0
        var doneFiles = 0
        for(var i in componentDirectories) {
            var componentDirectory = componentDirectories[i]
            var fileExtensions = await fs.readdir(componentDirectory, { withFileTypes: true, })
            fileExtensions = fileExtensions    
                .filter(dirent => dirent.isFile())
                .map(dirent => path.extname(dirent.name))

            var needed = fileExtensions.filter(extension => extension === '.svg')
            totalFiles += needed.length
            var done = fileExtensions.filter(extension => extension === '.png')
            doneFiles += done.length
        }
        
        this.setState({
            componentDirectories: componentDirectories,
            totalFiles: totalFiles,
            doneFiles: doneFiles,
        })
    }
    #stopWatchingOutputPath = () => {
        if (this.outputFolderWatcher === undefined) {
            return
        }
        this.outputFolderWatcher.close();
        this.outputFolderWatcher = undefined;
    }
    #parseComponentDirectoryImageFilepathsAsync = async () => {
        this.#stopWatchingOutputPath()            
        this.outputFolderWatcher = fsOld.watch(this.props.outputFolderPath, {recursive: true}, async (event, filename) => {
            await this.#getOutputComponentDirectories()
        })
            
        await this.#getOutputComponentDirectories()
    }
    componentDidMount = async () => {
        if (this.props.outputFolderPath === undefined) {
            return
        }
        await this.#parseComponentDirectoryImageFilepathsAsync()        
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.outputFolderPath === prevProps.outputFolderPath) {
            return
        }
        if (this.props.outputFolderPath === undefined) {
            return
        }
        await this.#parseComponentDirectoryImageFilepathsAsync()
    }
    componentWillUnmount = () => {
        this.#stopWatchingOutputPath()
    }
    render = () => {
        var componentDirectoryDivs = this.state.componentDirectories.map(componentDirectory => 
            <ComponentOutputDirectory key={componentDirectory} componentDirectory={componentDirectory}/>
        )
        var outputName = ""
        if (this.props.outputFolderPath !== undefined) {
            outputName = this.props.outputFolderPath.replaceAll("\\", "/")
            outputName = outputName.substring(outputName.lastIndexOf("/") + 1, outputName.length)
        }
        var percentageDone = this.state.doneFiles/this.state.totalFiles * 100
        var style = {"width": `${percentageDone}%`} 
        return <React.Fragment>
            <div className="row render-progress-row">
                <div className="col">
                    <div className="output-name-container">
                        <h3 className="outputFolderName">{outputName}</h3>
                    </div>
                    <div className="progress render-progress-bar-outer"><div 
                        className={`progress-bar render-progress-bar-inner ${percentageDone!==100 && "progress-bar-striped progress-bar-animated"}`} 
                        role="progressbar" 
                        style={style}
                        aria-valuenow={percentageDone.toString()} 
                        aria-valuemin="0" 
                        aria-valuemax="100"/>
                    </div>
                </div>
            </div>
            <div className="row render-output-row">
                <div className="col">
                    {componentDirectoryDivs}
                </div>
            </div>
            
        </React.Fragment>
    }
}