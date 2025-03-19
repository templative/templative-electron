import React from "react";
import "./ChosenComponent.css";
import { ComponentImagePreview } from './utils/ImageLoader';

const ComponentPreview = ({ selectedComponentInfo }) => {
    // If there's no component info, don't render anything
    if (!selectedComponentInfo) {
        return null;
    }

    const isStock = selectedComponentInfo?.DimensionsPixels === undefined;

    return (
        <div className="chosen-component-image-container">
            <p className="component-type-name-title">{selectedComponentInfo.DisplayName}</p>
            <div className="chosen-component-image-wrapper">
                <ComponentImagePreview 
                    previewUri={selectedComponentInfo.PreviewUri}
                    altText={selectedComponentInfo.DisplayName}
                    className="chosen-component-image"
                    fallbackClassName="chosen-component-image-placeholder"
                    fallbackContent="No preview available"
                />
            </div>
            <p className="component-type-name-subtitle">{isStock ? "Stock" : "Custom"} Component</p>
        </div>
    );
};

export default ComponentPreview; 