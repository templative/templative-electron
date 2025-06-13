import React, { useState, useRef, useEffect } from "react";
import "./RenderedOutputImage.css"
import RotatableImage from "./RotatableImage";
const fsOld = require('fs');
const { COMPONENT_INFO } = require("../../../../../shared/componentInfo");
const RenderOutputImage = ({imagePath, componentType, componentDirectoryName, name, quantity, rotationDegrees=0}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isHoveringOverMagnifyingGlass, setIsHoveringOverMagnifyingGlass] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const imageContainerRef = useRef(null);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleMouseEnterMagnifyingGlass = () => {
        setIsHoveringOverMagnifyingGlass(true);
    };

    const handleMouseLeaveMagnifyingGlass = () => {
        setIsHoveringOverMagnifyingGlass(false);
    };

    if (imagePath.endsWith('_temp.png')){
        return <></>
    }
    const componentInfo = COMPONENT_INFO[componentType];
    if (!componentInfo) {
        return null;
    }
    const pixelSizes = [componentInfo.DimensionsPixels[isRotated ? 1 : 0], componentInfo.DimensionsPixels[isRotated ? 0 : 1]];
    const aspectRatio = pixelSizes[0] / pixelSizes[1];
    const isRotated = rotationDegrees === 90 || rotationDegrees === 270;
    
    // Add timestamp to force refresh when parent updates the path
    const imageUrl = `file://${imagePath}?t=${Date.now()}`
    return <React.Fragment>
        <div className="output-image-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ aspectRatio: `${aspectRatio}` }}
            ref={imageContainerRef}
        >
            <React.Fragment>
                <RotatableImage
                    imageUrl={imageUrl}
                    isRotated={isRotated}
                    aspectRatio={aspectRatio}
                    rotationDegrees={rotationDegrees}
                    pixelSizes={pixelSizes}
                />
                <div 
                    className={`image-controls ${isHovering && "darker-image-controls"}`}
                >
                    {name !== undefined &&
                        <p className="rendered-output-image-name">{ quantity !== undefined && <span>{quantity}x </span> }{name.split(".")[0].replace(`${componentDirectoryName}-`, "")}</p>
                    } 
                    
                    <svg
                        onMouseEnter={handleMouseEnterMagnifyingGlass}
                        onMouseLeave={handleMouseLeaveMagnifyingGlass}
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
            </React.Fragment>
        </div>
        {isHoveringOverMagnifyingGlass && 
            <img className="output-image-giganto" src={imageUrl} style={{ transform: `translate(-50%, -50%) rotate(${rotationDegrees}deg)` }}/>
        }
    </React.Fragment>
}

export default RenderOutputImage;
