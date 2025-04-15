import React, { useMemo } from "react";
import "./ChosenComponent.css";

const ComponentPreview = ({ selectedComponentInfo }) => {
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
            <p className="component-type-name-subtitle">{isStock ? "Stock" : "Custom"} Component</p>
        </div>
    );
};

export default ComponentPreview; 