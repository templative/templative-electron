import React from "react";
import "./RenderPanel.css"
const fs = window.require('fs');
const path = window.require('path');

export default class OutputExplorer extends React.Component {   
    render() {
        var componentDirectoryDivs = []
        if (this.props.outputFolderPath !== undefined) {
            componentDirectoryDivs = this.props.componentDirectories.map((dirent) => {
                
                var imageDivs = fs.readdirSync(dirent, { withFileTypes: true })
                    .filter(dirent => !dirent.isDirectory() && dirent.name.split(".").pop() === "png")
                    .map(dirent => {
                        var imagePath = path.join(dirent.path, dirent.name)
                        return <img className="outputImage" alt="" key={imagePath} src={imagePath}/>
                    })
                var directoryName = dirent.substring(dirent.lastIndexOf('\\') + 1)
                return <div key={dirent} className="renderedComponent">
                    <p className="renderedComponentTitle">{directoryName}</p>
                    {imageDivs}
                </div>
            })
        }
        return <div className="row">
            <div className="col">
                <div className="row">
                    <h3 className="outputFolderName">{this.props.outputFolderPath}</h3>
                </div>
                <div className="row">
                    {componentDirectoryDivs}
                </div>
            </div>
        </div>
    }
}