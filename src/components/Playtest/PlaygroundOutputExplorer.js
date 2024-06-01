import React from "react";
import "./PlaygroundOutputExplorer.css"

const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class PlaygroundOutputExplorer extends React.Component {   
    state={
        thumbnailFilepaths: [],
        textureFilepaths: [],
        packageName: undefined
    }
    getThumbnailFilepaths = async(packageDirectory) => {
        const thumbnailsPath = path.join(packageDirectory, "Thumbnails");
        var thumbnailFilepaths = await fs.readdir(thumbnailsPath, { withFileTypes: true, })
        thumbnailFilepaths = thumbnailFilepaths
            .filter(dirent => !dirent.isDirectory())
            .map(dirent => path.join(thumbnailsPath, dirent.name))
        return thumbnailFilepaths
    }
    getTextureFilepaths = async(packageDirectory) => {
        const texturesPath = path.join(packageDirectory, "Textures");
        var textureFilepaths = await fs.readdir(texturesPath, { withFileTypes: true, })
        textureFilepaths = textureFilepaths
            .filter(dirent => !dirent.isDirectory())
            .map(dirent => path.join(texturesPath, dirent.name))
        return textureFilepaths
    }
    loadPackageName = async (packageDirectory) => {
        return JSON.parse(await fs.readFile(path.join(packageDirectory, "manifest.json")))["Name"]
    }
    loadPackageInformation = async (packageDirectory) => {
        const thumbnailFilepaths = await this.getThumbnailFilepaths(packageDirectory)
        const textureFilepaths = await this.getTextureFilepaths(packageDirectory)
        const packageName = await this.loadPackageName(packageDirectory)
        this.setState({
            packageName: packageName,
            thumbnailFilepaths: thumbnailFilepaths,
            textureFilepaths: textureFilepaths,
        })
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.packageDirectory === prevProps.packageDirectory) {
            return
        }
        if (this.props.packageDirectory === undefined) {
            return
        }
        await this.loadPackageInformation(this.props.packageDirectory)
    }
    componentDidMount = async () => {
        if (this.props.packageDirectory === undefined) {
            return
        }
        await this.loadPackageInformation(this.props.packageDirectory)
    }
    
    render() {      
        var thumbnailImages = this.state.thumbnailFilepaths.map(imageFilepath => 
            <img className="playground-component-thumbnail" alt="" key={imageFilepath} src={`file://${imageFilepath}`}/>
        )
        var textureImages = this.state.textureFilepaths.map(imageFilepath => 
            <React.Fragment key={imageFilepath}>
                <p className="playground-texture-name">{path.parse(imageFilepath).name}</p>
                <img className="playground-texture" alt="" key={imageFilepath} src={`file://${imageFilepath}`}/>
            </React.Fragment>
        )
        return <React.Fragment>
            <div className="playground-package-header">
                <p className="playground-package-name">{this.state.packageName}</p>
            </div>
            
            <p className="playground-content-type-header">Component Thumbnails</p>
            <div className="playground-thumbnails">
                <div className="playground-thumnbails-list">
                    {thumbnailImages}
                </div>
            </div>
            <p className="playground-content-type-header">Textures</p>
            <div className="playground-textures">
                <div className="playground-textures-list">
                    {textureImages}
                </div>
            </div>
            
        </React.Fragment>
    }
}