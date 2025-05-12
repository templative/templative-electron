import React, { useMemo } from "react";
import "./ChosenComponent.css";

const ComponentPreview = ({ selectedComponentInfo, unit }) => {
    // If there's no component info, don't render anything
    if (!selectedComponentInfo) {
        return null;
    }

    const isStock = selectedComponentInfo?.DimensionsPixels === undefined;
    
    const previewImagePath = useMemo(() => {
        if (selectedComponentInfo.PreviewUri) {
            // Make sure we're returning a proper string
            return `https://templative-component-preview-images.s3.us-west-2.amazonaws.com/${selectedComponentInfo.PreviewUri}`;
        }
        return null;
    }, [selectedComponentInfo.PreviewUri]);
    const dimensions = selectedComponentInfo.DimensionsPixels ? `${selectedComponentInfo.DimensionsPixels[0]}x${selectedComponentInfo.DimensionsPixels[1]}px` : "";
    const dimensionsInches = selectedComponentInfo.DimensionsInches ? `${selectedComponentInfo.DimensionsInches[0]}x${selectedComponentInfo.DimensionsInches[1]}in` : "";
    const dimensionsMm = selectedComponentInfo.DimensionsInches ? `${(selectedComponentInfo.DimensionsInches[0] * 25.4).toFixed(1)}x${(selectedComponentInfo.DimensionsInches[1] * 25.4).toFixed(1)}mm` : "";
    const dimensionsCm = selectedComponentInfo.DimensionsInches ? `${(selectedComponentInfo.DimensionsInches[0] * 2.54).toFixed(1)}x${(selectedComponentInfo.DimensionsInches[1] * 2.54).toFixed(1)}cm` : "";
    var chosenSize = dimensions;
    if (unit === "mm") {
        chosenSize = dimensionsMm;
    } else if (unit === "cm") {
        chosenSize = dimensionsCm;
    } else if (unit === "in") {
        chosenSize = dimensionsInches;
    }
    return (
        <div className="chosen-component-image-container">
            <p className="component-type-name-title">{selectedComponentInfo.DisplayName}</p>
            <div className="chosen-component-image-wrapper">
                {previewImagePath && (
                    <img 
                        src={previewImagePath}
                        alt={selectedComponentInfo.DisplayName}
                        className="chosen-component-image"
                        onError={(e) => {
                            console.error(`Failed to load image: ${previewImagePath}`);
                            e.target.style.display = 'none';
                        }}
                    />
                )}
            </div>
            <p className="component-type-name-subtitle">{chosenSize}</p>
        </div>
    );
};

export default ComponentPreview; 