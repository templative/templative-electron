import React from "react";
const path = require("path")
import TemplativeAccessTools from "../../../../TemplativeAccessTools";

export default class ComponentThumbnail extends React.Component {   
    state = {
        images: [],
        currentImageIndex: 0,
        isHovering: false
    }
    
    handleMouseEnter = () => {
        this.setState({isHovering: true});
    };

    handleMouseLeave = () => {
        this.setState({isHovering: false});
    };
    componentDidMount = async () => {
        var componentInstructionsFilepath = path.join(this.props.outputFolderDirectoryPath, "component.json")
        var instructions = await TemplativeAccessTools.loadFileContentsAsJson(componentInstructionsFilepath)
        var images = []
        if (instructions["backInstructions"] !== undefined && instructions["backInstructions"]["filepath"] !== undefined) {
            images.push(`file://${instructions["backInstructions"]["filepath"]}`)
        }
        if (instructions["frontInstructions"] !== undefined) {
            images = [...images, ...instructions["frontInstructions"].map(instruction => `file://${instruction.filepath}`)]
        }
        if (instructions["dieFaceFilepaths"] !== undefined) {
            images = [...images, ...instructions["dieFaceFilepaths"].map(filepath => `file://${filepath}`)]
        }
        this.setState({images})
    }
    
    handlePrev = () => {
        this.setState((prevState) => ({
          currentImageIndex:
            (prevState.currentImageIndex - 1 + prevState.images.length) %
            prevState.images.length,
        }));
      };
    
    handleNext = () => {
        this.setState((prevState) => ({
            currentImageIndex:
            (prevState.currentImageIndex + 1) % prevState.images.length,
        }));
    };
    
    render() {
        if (this.state.images.length === 0) {
            return <div/>
        }
        // onMouseEnter={this.handleMouseEnter} 
        //     onMouseLeave={this.handleMouseLeave}
        const leftArrow = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-circle arrow-icon" viewBox="0 0 16 16" onClick={this.handlePrev}> 
            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
        const rightArrow = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-right-circle arrow-icon" viewBox="0 0 16 16" onClick={this.handleNext}>
            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
        </svg>
        const canChangeImage = this.state.isHovering && this.state.images.length > 1
        return <div className="component-thumbnail-wrapper" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
            {canChangeImage && 
                <div className="arrows-container">
                    {leftArrow}
                    {rightArrow}
                </div>
            }
            <img className="component-thumbnail" src={this.state.images[this.state.currentImageIndex]}/>
        </div> 
    }
}