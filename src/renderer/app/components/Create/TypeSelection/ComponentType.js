import React, { useMemo } from "react";
import ExportIcons, { getExportRouteInfo } from './ExportIcons';
import "./ComponentType.css";

export const addSpaces = (str) => {
    return str
        // First specifically handle D4, D6, D8, D10, D12, D20
        .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
        // Then handle measurement units, keeping them with their numbers
        .replace(/(\d+)(mm|cm)/g, '$1$2')
        // Add space between lowercase and uppercase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Add space between letters and numbers (except for measurement units)
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        // Fix dice notation
        .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
        .trim()
};

const ComponentType = ({ componentInfo, selectedComponentType, name, selectTypeCallback, existingQuantity }) => {
    const exportRoutes = useMemo(() => getExportRouteInfo(componentInfo), [componentInfo]);
    
    const displayName = useMemo(() => {
        if (!componentInfo["DisplayName"]) return name;
        return addSpaces(componentInfo["DisplayName"]);
    }, [componentInfo, name]);

    // Generate image URL for non-stock components
    const imageUrl = useMemo(() => {
        if (!name) return null;
        return `https://www.thegamecrafter.com/product-images/${name}.jpg`;
    }, [name]);

    return (
        <div className="component-type-wrapper">
            <button type="button" 
                className={`btn btn-outline-primary component-type-card ${selectedComponentType === name && "selected-component-type"}`} 
                onClick={() => selectTypeCallback(name)}
            >
                <div className="component-type-content">
                    <div className="component-type-info">
                        <p className="component-type-name">{existingQuantity !== 0 && `${existingQuantity}x `}{displayName}</p>
                        {componentInfo["DimensionsPixels"] && (
                            <p className="component-type-dimensions">
                                {`${parseFloat(componentInfo["DimensionsPixels"][0]).toFixed(1)}x${parseFloat(componentInfo["DimensionsPixels"][1]).toFixed(1)}px ${componentInfo["SimulatorCreationTask"]}`}
                            </p>
                        )}
                        {imageUrl && (
                            <div className="component-type-preview">
                                <img 
                                    src={imageUrl} 
                                    alt={displayName}
                                    className="preview-image"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                    </div>
                    <ExportIcons componentInfo={componentInfo} />
                </div>
            </button>
        </div>
    )
}

export default ComponentType;