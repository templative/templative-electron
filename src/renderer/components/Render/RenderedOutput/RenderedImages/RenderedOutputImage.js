import React from "react";
import "./RenderedOutputImage.css"
const fsOld = require('fs');

export default class RenderOutputImage extends React.Component {
    state = {
        isHovering: false,
        isHoveringOverMagnifyingGlass: false
    }

    handleMouseEnter = () => {
        this.setState({isHovering: true});
    };

    handleMouseLeave = () => {
        this.setState({isHovering: false});
    };

    handleMouseEnterMagnifyingGlass = () => {
        this.setState({isHoveringOverMagnifyingGlass: true});
    };

    handleMouseLeaveMagnifyingGlass = () => {
        this.setState({isHoveringOverMagnifyingGlass: false});
    };

    render() {
        if (this.props.imagePath.endsWith('_temp.png')){
            return <></>
        }

        // Add timestamp to force refresh when parent updates the path
        const imageUrl = `file://${this.props.imagePath}?t=${Date.now()}`

        return <React.Fragment>
            <div className="output-image-container"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <React.Fragment>
                    <img 
                        className="output-image" 
                        src={imageUrl} 
                    />
                    {/* {this.state.isHovering &&  */}
                        <div 
                            
                            className={`image-controls ${this.state.isHovering && "darker-image-controls"}`}
                        >
                            {this.props.name !== undefined &&
                                <p className="rendered-output-image-name">{ this.props.quantity !== undefined && <span>{this.props.quantity}x </span> }{this.props.name.split(".")[0].replace(`${this.props.componentDirectoryName}-`, "")}</p>
                            } 
                            
                            <svg
                                onMouseEnter={this.handleMouseEnterMagnifyingGlass}
                                onMouseLeave={this.handleMouseLeaveMagnifyingGlass}
                                className="enlarge-image-magnifying-glass"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16px"
                                height="16px"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/>
                                <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                                <path fillRule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </div>
                    {/* } */}
                </React.Fragment>
            </div>
            {this.state.isHoveringOverMagnifyingGlass && 
                <img className="output-image-giganto" src={imageUrl}/>
            }
            
        </React.Fragment>
    }
}
