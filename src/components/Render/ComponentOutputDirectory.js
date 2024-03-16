import React from "react";
import "./RenderPanel.css"
const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class ComponentOutputDirectory extends React.Component { 
    state = {
        imageFilepaths: [],
        remountKey: 0
    }  
   
    #getComponentImageFilepaths = async () => {        
        var imageFilepaths = await fs.readdir(this.props.componentDirectory, { withFileTypes: true })
        imageFilepaths = imageFilepaths.filter(dirent => !dirent.isDirectory() && dirent.name.split(".").pop() === "png")
        
        this.setState({imageFilepaths: imageFilepaths, remountKey: this.state.remountKey+1})

    }
    #stopWatchingComponentDirectoryFolderForChanges = () => {
        if (this.outputFolderWatcher === undefined) {
            return
        }
        this.outputFolderWatcher.close();
        this.outputFolderWatcher = undefined;
    }
    #watchComponentDirectoryFolderForChanges = async () => {
        this.#stopWatchingComponentDirectoryFolderForChanges()            
        this.outputFolderWatcher = fsOld.watch(this.props.componentDirectory, {recursive: true}, async (event, filename) => {
            // console.log(event, filename)
            await this.#getComponentImageFilepaths()
        })
            
        await this.#getComponentImageFilepaths()
    }
    componentDidMount = async () => {
        if (this.props.componentDirectory === undefined) {
            return
        }
        await this.#watchComponentDirectoryFolderForChanges()        
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.componentDirectory === prevProps.componentDirectory) {
            return
        }
        this.#stopWatchingComponentDirectoryFolderForChanges()            
        if (this.props.componentDirectory === undefined) {
            return
        }
        await this.#watchComponentDirectoryFolderForChanges()
    }
    componentWillUnmount = () => {
        this.#stopWatchingComponentDirectoryFolderForChanges()
    }
    render = () => {
        
        var imageDivs = this.state.imageFilepaths.map(dirent => {
            var imagePath = path.join(dirent.path, dirent.name)
            return <img className="outputImage" alt="" key={imagePath} src={`file://${imagePath}`}/>
        })
        var componentDirectory = this.props.componentDirectory.replaceAll("\\", "/")
        componentDirectory = componentDirectory.substring(componentDirectory.lastIndexOf("/") + 1, componentDirectory.length)
        return <div className="renderedComponent" key={this.state.remountKey}>
            <p className="renderedComponentTitle">{componentDirectory}</p>
            {imageDivs}
        </div>
    }
}