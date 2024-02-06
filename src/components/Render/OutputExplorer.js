import React from "react";
import "./RenderPanel.css"
const fs = window.require("fs/promises");
const path = window.require('path');

export default class OutputExplorer extends React.Component { 
    state = {
        componentDirectoryImageFilepaths: {}
    }  
    #parseComponentDirectoryImageFilepathsAsync = async () => {
        var componentDirectoryImageFilepaths = {}
        this.props.componentDirectories.foreach(async (dirent) => {
            var imageFilepaths = await fs.readdir(dirent, { withFileTypes: true })
                .filter(dirent => !dirent.isDirectory() && dirent.name.split(".").pop() === "png")
            componentDirectoryImageFilepaths[dirent] = imageFilepaths
        })
        this.setState({componentDirectoryImageFilepaths: componentDirectoryImageFilepaths})
    }
    componentDidMount = async () => {
        if (this.props.outputFolderPath === undefined) {
            return
        }
        this.#parseComponentDirectoryImageFilepathsAsync()
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.outputFolderPath === prevProps.outputFolderPath) {
            return
        }
        this.#parseComponentDirectoryImageFilepathsAsync()
    }
    render = () => {
        var componentDirectoryDivs = []
        
        Object.entries(this.state.componentDirectoryImageFilepaths).forEach(([componentDirectory,imageFilepaths]) => {
            var imageDivs = imageFilepaths.map(dirent => {
                var imagePath = path.join(dirent.path, dirent.name)
                return <img className="outputImage" alt="" key={imagePath} src={`file://${imagePath}`}/>
            })
            var directoryName = componentDirectory.replace("\\", "/")
            directoryName = componentDirectory.substring(componentDirectory.lastIndexOf('/') + 1)
            const renderedComponent = <div key={componentDirectory} className="renderedComponent">
                <p className="renderedComponentTitle">{directoryName}</p>
                {imageDivs}
            </div>
            componentDirectoryDivs.push(renderedComponent)
        })
        
        return <div className="row">
            <div className="col">
                <div className="row">
                    <h3 className="outputFolderName">{this.props.outputFolderPath}</h3>
                </div>
                <div className="row renderedComponentsRow">
                    {componentDirectoryDivs}
                </div>
            </div>
        </div>
    }
}