import React from "react";
import "./RenderPanel.css"
import ComponentOutputDirectory from "./ComponentOutputDirectory";
const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class OutputExplorer extends React.Component { 
    state = {
        componentDirectories: []
    }  
   
    #getOutputComponentDirectories = async () => {
        var componentDirectories = await fs.readdir(this.props.outputFolderPath, { withFileTypes: true })
        componentDirectories = componentDirectories
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(dirent.path, dirent.name))

        this.setState({componentDirectories: componentDirectories})
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
        return <React.Fragment>
            <div className="output-name-container">
                <h3 className="outputFolderName">{outputName}</h3>
            </div>
            <div className="renderedComponentsRow">
                {componentDirectoryDivs}
            </div>
        </React.Fragment>
    }
}