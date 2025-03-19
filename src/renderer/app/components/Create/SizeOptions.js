import React from "react";
import "./ChosenComponent.css";

const SizeOptions = ({ sizeOptions, selectedComponentType, handleSizeSelect }) => {
    // If no size variations, return null
    if (!sizeOptions || sizeOptions.length === 0) {
        return null;
    }

    // Format size for display
    const formatSizeForDisplay = (size, isNumeric) => {
        return isNumeric ? `Fits ${size}` : `${size} Size`;
    };

    return (
        <>
            <p>Size</p>
            <div className="size-options">
                {sizeOptions.map((variation) => (
                    <button 
                        key={variation.key} 
                        className={`btn btn-small btn-outline-primary size-option-button ${selectedComponentType === variation.key ? 'selected-size-option' : ''}`}
                        onClick={() => handleSizeSelect(variation.key)}
                        title={formatSizeForDisplay(variation.size, variation.isNumeric)}
                    >
                        {formatSizeForDisplay(variation.size, variation.isNumeric)}
                    </button>
                ))}
            </div>
        </>
    );
};

export default SizeOptions; 