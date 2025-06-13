import React, { useState, useRef, useEffect } from "react";
import "./RenderedOutputImage.css"

const RotatableImage = ({imageUrl, isRotated, aspectRatio, rotationDegrees=0, pixelSizes}) => {
    // Calculate max-width based on aspect ratio and pixel dimensions
    const getMaxWidth = () => {
        if (!isRotated) return '100%';
        
        // For rotated images, calculate max-width based on pixel dimensions
        const [width, height] = pixelSizes;
        const containerMaxWidth = 100; // Container's max-width percentage
        
        // Calculate the ratio of height to width to determine how much to scale
        const heightToWidthRatio = height / width;
        
        // Scale the width based on the height-to-width ratio
        // This ensures tall images get appropriate scaling
        const scaledWidth = containerMaxWidth / heightToWidthRatio;
        // console.log(`${containerMaxWidth} / ${heightToWidthRatio} = ${scaledWidth}`);
        
        return `${scaledWidth}%`;
    };
       
    return <div className="output-image-container-inner">
        <img 
            className={`output-image ${isRotated ? "rotated" : ""}`} 
            src={imageUrl} 
            style={{ 
                aspectRatio: `${aspectRatio}`, 
                width: `${isRotated ? "100%" : "auto"}`, 
                height: `${isRotated ? "auto" : "100%"}`,
                transform: `rotate(${rotationDegrees}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease',
                maxWidth: getMaxWidth()
            }}
        />
    </div>
}

export default RotatableImage;
