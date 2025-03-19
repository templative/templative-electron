import React from "react";
import { getColorValueHex } from "../../../../shared/stockComponentColors";
import "./ChosenComponent.css";
import { loadPreviewImage } from './utils/ImageLoader';

const ColorOptions = ({ colorOptions, selectedComponentType, handleColorSelect }) => {
    // If no color variations, return null
    if (!colorOptions || colorOptions.length === 0) {
        return null;
    }

    return (
        <>
            <p>Color</p>
            <div className="color-options-grid">
                {colorOptions.map((variation) => {
                    // Preload the image if available
                    const imageSource = variation.componentInfo?.PreviewUri 
                        ? loadPreviewImage(variation.componentInfo.PreviewUri)
                        : null;
                        
                    return (
                        <button 
                            key={variation.key} 
                            className={`color-option-button ${selectedComponentType === variation.key ? 'selected-color-option' : ''}`}
                            onClick={() => handleColorSelect(variation.key)}
                            title={variation.color}
                        >
                            <div className="color-option-content">
                                {imageSource ? (
                                    <img 
                                        src={imageSource} 
                                        alt={variation.color}
                                        className="color-option-image"
                                    />
                                ) : (
                                    <div 
                                        className="color-option-placeholder"
                                        style={{ backgroundColor: getColorValueHex(variation.color) }}
                                    >
                                        {variation.color?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </>
    );
};

export default ColorOptions; 