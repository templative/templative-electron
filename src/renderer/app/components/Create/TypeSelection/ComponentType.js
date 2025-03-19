import React, { useMemo } from "react";
import path from "path";
import ExportIcons, { getExportRouteInfo } from './ExportIcons';
import "../utils/ImageLoader";
import { loadPreviewImage, loadTemplateImage } from "../utils/ImageLoader";
import "./ComponentType.css";
import { COMPONENT_INFO } from "../../../../../shared/componentInfo";
import { STOCK_COMPONENT_INFO } from "../../../../../shared/stockComponentInfo";
const ComponentType = ({ 
    name,
    componentInfo,
    selectTypeCallback,
    selectedComponentType,
    existingQuantity,
    isShowingTemplates,
    search,
    isStock
}) => {
    let highlightedComponent = null;
    let selectedBaseComponent = null;
    let selectedSize = null;
    let selectedColor = null;
    const components = []
    const componentTypeInformation = isStock ? STOCK_COMPONENT_INFO : COMPONENT_INFO;
    for (const size in componentInfo) {
        for (const color in componentInfo[size]) {
            const component = componentTypeInformation[componentInfo[size][color]];
            if (component.IsDisabled) {
                continue;
            }
            if (component.Key === selectedComponentType || highlightedComponent == null) {
                highlightedComponent = component;
                selectedBaseComponent = name;
                selectedSize = size;
                selectedColor = color;
            }
            components.push(component);
        }
    }
    if (components.length === 0) {
        return null;
    }

    const isSelected = highlightedComponent.Key === selectedComponentType;

    let previewSource = null;
    if (highlightedComponent?.TemplateFiles?.length > 0 && isShowingTemplates) {
        previewSource = loadTemplateImage(highlightedComponent.TemplateFiles[0]);
    }
    else if (highlightedComponent.PreviewUri) {
        previewSource = loadPreviewImage(highlightedComponent.PreviewUri);
    }
        
    return (
        <div className="component-type-wrapper">
            <button type="button" 
                className={`btn btn-outline-primary component-type-card ${isSelected && "selected-component-type"}`} 
                onClick={() => selectTypeCallback(selectedBaseComponent, selectedSize, selectedColor, highlightedComponent.Key)}
            >
                <div className="component-type-content">
                    <div className="component-type-info">
                        <p className="component-type-name">{name}</p>
                        {highlightedComponent["DimensionsPixels"] && (
                            <p className="component-type-dimensions">
                                {`${parseFloat(highlightedComponent["DimensionsPixels"][0]).toFixed(1)}x${parseFloat(highlightedComponent["DimensionsPixels"][1]).toFixed(1)}px ${highlightedComponent["SimulatorCreationTask"] || ""}`}
                            </p>
                        )}
                        
                        {previewSource && (
                            <div className="component-type-preview">
                                <img 
                                    src={previewSource} 
                                    alt={name}
                                    className="preview-image"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                        
                        {/* Show variations info if this component has variations */}
                        {components.length > 1 && (
                            <p className="component-type-dimensions size-variations">
                                {`Available in ${components.length} variation${components.length > 1 ? 's' : ''}`}
                            </p>
                        )}
                    </div>
                    <ExportIcons componentInfo={highlightedComponent} />
                </div>
            </button>
        </div>
    )
}

export default ComponentType;