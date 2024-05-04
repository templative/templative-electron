import React from "react";
import "./RenderPanel.css"
const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class ComponentOutputDirectory extends React.Component { 
    state = {
        imageFilepaths: [],
        svgFilepaths: [],
        remountKey: 0,
        isExtended: true,
        rotationLeftQuantity: 0
    }  
   
    #getComponentImageFilepaths = async () => {        
        var filepaths = await fs.readdir(this.props.componentDirectory, { withFileTypes: true })
        var imageFilepaths = filepaths.filter(dirent => !dirent.isDirectory() && dirent.name.split(".").pop() === "png")
        var svgFilepaths = filepaths.filter(dirent => !dirent.isDirectory() && dirent.name.split(".").pop() === "svg")
        
        this.setState({imageFilepaths: imageFilepaths, svgFilepaths: svgFilepaths, remountKey: this.state.remountKey+1})

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
    toggleExtended = () => {
        this.setState({isExtended: !this.state.isExtended})
    }
    // getRotationClassName = () => {
    //     const rotationClasses = {
    //         0: "",
    //         1: "rotate90",
    //         2: "rotate180",
    //         3: "rotate270",
    //     }
    //     return rotationClasses[this.state.rotationLeftQuantity % 4]
    // }
    // rotateLeft = () => {
    //     this.setState({rotationLeftQuantity: this.state.rotationLeftQuantity + 1})
    // }
    render = () => {
        
        var imageDivs = this.state.imageFilepaths.map((dirent, index) => {
            var imagePath = path.join(dirent.path, dirent.name)
            return <img className="output-image" alt="" key={imagePath} src={`file://${imagePath}`}/>
        })
        var componentDirectory = this.props.componentDirectory.replaceAll("\\", "/")
        componentDirectory = componentDirectory.substring(componentDirectory.lastIndexOf("/") + 1, componentDirectory.length)
        var isComplete = this.state.imageFilepaths.length === this.state.svgFilepaths.length
        return <div className="renderedComponent" key={this.state.remountKey}>
            <div className="component-output-header" onClick={this.toggleExtended}>
                <div className={`component-progess ${isComplete && "component-progress-completed"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-card-image progress-image" viewBox="0 0 16 16">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    {this.state.imageFilepaths.length}/{this.state.svgFilepaths.length}
                    </div>
                <p className="rendered-component-title">{componentDirectory}</p>
                {/* <div className="component-output-rotate-left" onClick={this.rotateLeft}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                    </svg>
                </div> */}
                <div className="component-output-extension-chevron">
                    {this.state.isExtended ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                        </svg>
                    }
                </div>
            </div>
            {this.state.isExtended && 
                <div className="component-output-content">
                    {imageDivs}
                </div>
            }
        </div>
    }
}