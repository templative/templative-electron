import React, { useMemo } from "react";
import path from "path";
import ExportIcons, { getExportRouteInfo } from './ExportIcons';
import "./ComponentType.css";
import { COMPONENT_INFO } from "../../../../shared/componentInfo";
import { STOCK_COMPONENT_INFO } from "../../../../shared/stockComponentInfo";
const ComponentType = ({ 
    name,
    componentInfo,
    selectTypeCallback,
    selectedComponentType,
    isShowingTemplates,
    hasLoadedComponents,
    search,
    unit,
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
            if (component == undefined) {
                continue
            }
            if (component.IsDisabled) {
                continue;
            }
            const searchableName = component.DisplayName.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase();
            
            if (search && !searchableName.includes(search.toLowerCase())) {
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

    const previewSource = useMemo(() => {
        if (highlightedComponent.PreviewUri) {
            return `https://templative-component-preview-images.s3.us-west-2.amazonaws.com/${highlightedComponent.PreviewUri}`;
        }
        return null;
    }, [highlightedComponent, isShowingTemplates]);

    var dimensions = highlightedComponent["DimensionsPixels"] ? `${parseInt(highlightedComponent["DimensionsPixels"][0])}x${parseInt(highlightedComponent["DimensionsPixels"][1])}px` : "";
    const unitType = unit || "px";
    if (unitType === "in") {
        dimensions = highlightedComponent["DimensionsInches"] ? `${parseFloat(highlightedComponent["DimensionsInches"][0]).toFixed(1)}x${parseFloat(highlightedComponent["DimensionsInches"][1]).toFixed(1)}"` : "";
    } else if (unitType === "mm") {
        dimensions = highlightedComponent["DimensionsInches"] ? `${(highlightedComponent["DimensionsInches"][0] * 25.4).toFixed(1)}x${(highlightedComponent["DimensionsInches"][1] * 25.4).toFixed(1)}mm` : "";
    } else if (unitType === "cm") {
        dimensions = highlightedComponent["DimensionsInches"] ? `${(highlightedComponent["DimensionsInches"][0] * 2.54).toFixed(1)}x${(highlightedComponent["DimensionsInches"][1] * 2.54).toFixed(1)}cm` : "";
    }
    
    const simulatorTask = highlightedComponent["SimulatorCreationTask"] ? highlightedComponent["SimulatorCreationTask"] : "";
    const gamecrafterUploadTask = highlightedComponent["GameCrafterUploadTask"] ? highlightedComponent["GameCrafterUploadTask"] : "";
    const variations = components.length > 1 ? `${components.length} variation${components.length > 1 ? 's' : ''}` : "";
    // const descriptor = [simulatorTask, gamecrafterUploadTask, dimensions, variations].filter(Boolean).join(' · ');
    const descriptor = [dimensions, variations].filter(Boolean).join(' · ');
    return (
        <div className="component-type-wrapper">
            <button type="button" 
                className={`btn btn-outline-primary component-type-card ${isSelected && "selected-component-type"}`}
                disabled={!hasLoadedComponents}
                onClick={() => selectTypeCallback(selectedBaseComponent, selectedSize, selectedColor, highlightedComponent.Key)}
            >
                <div className="component-type-content">
                    <div className="component-type-info">
                        <p className="component-type-name">{name} <span className="component-type-descriptor">{descriptor}</span></p>
                        {previewSource && (
                            <div className="component-type-preview">
                                <img 
                                    src={previewSource} 
                                    alt={name}
                                    className="preview-image"
                                    onError={(e) => {
                                        console.error(`Failed to load image: ${previewSource}`);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <ExportIcons componentInfo={highlightedComponent} isStock={isStock} />
                </div>
            </button>
        </div>
    )
}

export default ComponentType;