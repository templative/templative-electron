import React, { useState, useEffect } from "react";
import EditCompositionRow from "../UnifiedViewer/EditComposition/EditCompositionRow";
import TemplativeAccessTools from "../../../TemplativeAccessTools";
import "./StockComponentsViewer.css"
import path from "path";
import { COMPONENT_CATEGORIES,getInvertedCategories } from "../../../../../shared/componentCategories";
import {STOCK_COMPONENT_INFO } from "../../../../../shared/stockComponentInfo";

const StockComponentsViewer = ({
    componentCompose,
    componentName,
    updateStockComponentsWithNameAsync,
    changeStockComponentQuantityByTypeAsync
}) => {

    const invertedCategories = getInvertedCategories();
    let componentInfo = undefined;
    for (let c = 0; c < componentCompose.length; c++) {
        const component = componentCompose[c];
        if (component.name !== componentName) {
            continue;
        }
        componentInfo = component;
        break;
    }
    
    if (componentInfo === undefined) {
        return null;
    }
    const stockLessComponentType = componentInfo.type.replace("STOCK_", "");
    const parentage = invertedCategories[stockLessComponentType];
    if (!parentage) {
        return;
    }
    let currentParent = COMPONENT_CATEGORIES;
    for (let i = 0; i < parentage.length-1; i++) {
        currentParent = currentParent[parentage[i]];
    }
    const sisters = Object.values(currentParent).filter(type => type !== stockLessComponentType);
    
    const updateComponentName = async (newName) => {
        await updateStockComponentsWithNameAsync(componentName, "name", newName);
    }

    const updateIsDisabled = async (newIsDisabled) => {
        await updateStockComponentsWithNameAsync(componentName, "disabled", newIsDisabled);
    }

    if (!componentInfo) {
        return null;
    }
    const stocklessComponentType = componentInfo.type.replace("STOCK_", "");
    const allSiblingStocklessComponentTypes = [stocklessComponentType, ...sisters];
    
    const mainParentage = invertedCategories[stocklessComponentType];
    const mainType = mainParentage.slice(2).slice(0, -1).join(" ");
    
    const stockComponentTypesInfo = allSiblingStocklessComponentTypes.map((thisStocklessComponentType) => {
        const stockComponentInfo = STOCK_COMPONENT_INFO[thisStocklessComponentType];
        let quantity = 0;
        let uniqueDescriptor = null;
        for (let c = 0; c < componentCompose.length; c++) {
            const component = componentCompose[c];
            const parentage = invertedCategories[thisStocklessComponentType];
            uniqueDescriptor = parentage[parentage.length - 1];
            if (component.name !== componentName || component.type.replace("STOCK_", "") !== thisStocklessComponentType) {
                continue;
            }
            quantity = component.quantity;
            break;
        }
        return {
            name: stockComponentInfo.DisplayName,
            quantity: quantity,
            type: thisStocklessComponentType,
            uniqueDescriptor: uniqueDescriptor,
            previewUri: stockComponentInfo.PreviewUri
        }
    });
    
    return <div className="stock-components-viewer">
        <p className="stock-components-viewer-main-name">{componentInfo.name} <span className="stock-components-viewer-main-type">{mainType}</span></p>
        
        <div className="stock-components-viewer-sisters">
            {stockComponentTypesInfo.map((stockComponentTypeInfo) => {
                return <div className="stock-components-viewer-sister" key={`${stockComponentTypeInfo.name}_${stockComponentTypeInfo.type}`}>
                    <div className="stock-components-viewer-sister-image-container">
                        <img src={`https://templative-component-preview-images.s3.us-west-2.amazonaws.com/${stockComponentTypeInfo.previewUri}`} className="stock-components-viewer-sister-image"/>
                    </div>
                    <div className="stock-components-viewer-sister-name-container">
                        <p className="stock-components-viewer-sister-name">{stockComponentTypeInfo.uniqueDescriptor}</p>
                    </div>
                    <div className="input-group input-group-sm">
                        <input 
                            type="number" 
                            className="form-control stock-components-viewer-sister-quantity" 
                            value={stockComponentTypeInfo.quantity} 
                            onChange={(e) => changeStockComponentQuantityByTypeAsync(componentName, stockComponentTypeInfo.type, parseInt(e.target.value))}
                        />
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default StockComponentsViewer;