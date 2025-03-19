import React, { useMemo } from "react";
import path from "path";
import ExportIcons, { getExportRouteInfo } from './ExportIcons';
import { extractBaseNameAndSize, addSpaces } from './ComponentUtils';
import "../utils/ImageLoader";
import { loadPreviewImage, loadTemplateImage } from "../utils/ImageLoader";
import "./ComponentType.css";

const ComponentType = ({ componentInfo, selectedComponentType, name, selectTypeCallback, existingQuantity, sizeVariations, isShowingTemplates }) => {
    const exportRoutes = useMemo(() => getExportRouteInfo(componentInfo), [componentInfo]);
    
    // Extract size information from the current component
    const sizeInfo = useMemo(() => {
        return extractBaseNameAndSize(name, componentInfo["DisplayName"]);
    }, [name, componentInfo]);
    
    const displayName = useMemo(() => {
        if (!componentInfo["DisplayName"]) return name;
        
        // If we have size variations or this component has a size, use the base name without size
        if ((sizeVariations && sizeVariations.length > 0) || sizeInfo.size) {
            // Use the baseName from the first size variation or from this component
            const baseName = sizeVariations && sizeVariations.length > 0 
                ? sizeVariations[0].baseName 
                : sizeInfo.baseName;
            return addSpaces(baseName);
        }
        
        return componentInfo["DisplayName"];
    }, [componentInfo, name, sizeVariations, sizeInfo]);

    // Calculate total number of sizes (current + variations)
    // Always at least 1 (the current size)
    const totalSizes = (sizeVariations ? sizeVariations.length : 0) + (sizeInfo.size ? 1 : 0);

    // Decide which preview path to use:
    // 1. If TemplateFiles exists (and has at least one element), build the path using templateDirPath
    // 2. Otherwise, fall back to the original PreviewUri
    const previewSource = useMemo(() => {
        if (componentInfo?.TemplateFiles?.length > 0 && isShowingTemplates) {
            return loadTemplateImage(componentInfo.TemplateFiles[0]);
        }
        
        // Use the utility for loading PreviewUri
        if (componentInfo.PreviewUri) {
            return loadPreviewImage(componentInfo.PreviewUri);
        }
        
        return "";
    }, [componentInfo, isShowingTemplates]);

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
                                {`${parseFloat(componentInfo["DimensionsPixels"][0]).toFixed(1)}x${parseFloat(componentInfo["DimensionsPixels"][1]).toFixed(1)}px ${componentInfo["SimulatorCreationTask"] || ""}`}
                            </p>
                        )}
                        
                        {/* Only show the image if we have a valid previewSource */}
                        {previewSource && (
                            <div className="component-type-preview">
                                <img 
                                    src={previewSource} 
                                    alt={displayName}
                                    className="preview-image"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                        
                        
                        {/* Show size variations info if this component has a size */}
                        {totalSizes > 1 && (
                            <p className="component-type-dimensions size-variations">
                                {`Available in ${totalSizes} size${totalSizes > 1 ? 's' : ''}`}
                            </p>
                        )}
                    </div>
                    <ExportIcons componentInfo={componentInfo} />
                </div>
            </button>
        </div>
    )
}

export default ComponentType;