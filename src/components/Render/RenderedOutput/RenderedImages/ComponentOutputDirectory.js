import React from "react";
import RenderOutputImage from "./RenderedOutputImage";
const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');
const addSpaces = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
        .replace(/(\d)([a-zA-Z])/g, '$1 $2')
        .replace("D 4", "D4")
        .replace("D 6", "D6")
        .replace("D 8", "D8")
        .replace("D 12", "D12")
        .replace("D 20", "D20")
}
export default class ComponentOutputDirectory extends React.Component { 
    state = {
        imageFilepaths: [],
        svgFilepaths: [],
        isExtended: true,
        rotationLeftQuantity: 0,
        componentType: undefined
    }  
   
    #getComponentImageFilepaths = async () => {        
        var filepaths = await fs.readdir(this.props.componentDirectory, { withFileTypes: true })
        var componentInstructions = JSON.parse(await fs.readFile(`${this.props.componentDirectory}/component.json`))
        var componentQuantity = componentInstructions["quantity"]
        var totalPieces = 0
        var existingFilepaths = new Set(filepaths
            .filter(dirent => !dirent.isDirectory() && dirent.name.split(".").pop() === "png")
            .map(dirent => path.join(this.props.componentDirectory, dirent.name)))
        
        var imageFilepaths = []
        var totalImageFileCount = componentInstructions["backInstructions"] !== undefined ? 1 : 0
        if (componentInstructions["frontInstructions"] !== undefined) {
            for (var index in componentInstructions["frontInstructions"]) {
                var instruction = componentInstructions["frontInstructions"][index]
                var pieceQuantity = instruction["quantity"] === 0 ? 0 : 1
                totalImageFileCount = totalImageFileCount + pieceQuantity
                totalPieces = totalPieces + (pieceQuantity * componentQuantity)
                
                var quantitiesInTheEnd = instruction["quantity"] * componentInstructions["quantity"]
                
                if(existingFilepaths.has(instruction["filepath"])) {
                    imageFilepaths.push({path: this.props.componentDirectory, name: `${path.parse(instruction["filepath"]).name}.png`, quantity: quantitiesInTheEnd})
                }
                   
            }
        }
        if (componentInstructions["backInstructions"] !== undefined && existingFilepaths.has(componentInstructions["backInstructions"]["filepath"])) {
            var filename = `${path.parse(componentInstructions["backInstructions"]["filepath"]).name}.png`
            imageFilepaths.push({path: this.props.componentDirectory, name: filename})
        }
        if (componentInstructions["dieFaceFilepaths"] !== undefined) {
            for (var index in componentInstructions["dieFaceFilepaths"]) {
                var instruction = componentInstructions["dieFaceFilepaths"][index]
                if(existingFilepaths.has(instruction["filepath"])) {
                    imageFilepaths.push({path: this.props.componentDirectory, name: `${path.parse(instruction["filepath"]).name}.png`})
                }
                
            }
            totalImageFileCount = componentInstructions["dieFaceFilepaths"].length
            totalPieces = componentQuantity
        }
            
        // Keep track of name, quantity. If it ends in -back dont keep track of quantity
        // console.log(imageFilepaths)
        var componentTypeDisplayName = addSpaces(componentInstructions["type"])
        this.setState({
            componentQuantity: componentQuantity,
            totalPieces: totalPieces, 
            componentType: componentTypeDisplayName, 
            imageFilepaths: imageFilepaths, 
            totalImageFileCount: totalImageFileCount
        })

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
        var componentDirectory = this.props.componentDirectory.replaceAll("\\", "/")
        componentDirectory = componentDirectory.substring(componentDirectory.lastIndexOf("/") + 1, componentDirectory.length)
        var subdirectoryName = componentDirectory.split("_").pop()
        if (componentDirectory === subdirectoryName) {
            subdirectoryName = ""
        }
        var backImage = null;
        var imageDivs = this.state.imageFilepaths.map((image, index) => {
            var imagePath = path.join(image.path, image.name)
            
            if (image.name.endsWith("-back.png")) {
                backImage = <RenderOutputImage 
                    key={`back_${imagePath}`} 
                    componentQuantity={this.state.componentQuantity} 
                    componentDirectoryName={componentDirectory} 
                    imagePath={imagePath} 
                    name={image.name}
                />
                return null;
            }
            
            return <RenderOutputImage 
                key={`front_${imagePath}`}
                componentQuantity={this.state.componentQuantity} 
                componentDirectoryName={componentDirectory} 
                imagePath={imagePath} 
                name={image.name} 
                quantity={image.quantity}
            />
        }).filter(Boolean);
        
        var isComplete = this.state.imageFilepaths.length === this.state.totalImageFileCount
        return <div className="rendered-subcomponent">
            <div className="subcomponent-output-header" onClick={this.toggleExtended}>
                <div className={`component-progess ${isComplete && "component-progress-completed"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-card-image progress-image" viewBox="0 0 16 16">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    {this.state.imageFilepaths.length}/{this.state.totalImageFileCount} Images
                    </div>
                <p className="rendered-component-title">{subdirectoryName}</p>
                
            </div>
            <div className="component-output-content">
                {backImage}
                {imageDivs}
            </div>
        </div>
    }
}