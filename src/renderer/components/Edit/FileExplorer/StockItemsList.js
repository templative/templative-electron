import React, { useState } from "react";
import ResourceHeader from "./ContentFiles/ResourceHeader";
import stockIcon from "../Icons/stockIcon.svg?react"
import StockCompositionItem from "./StockCompositionItem";
const path = require("path")
import { getInvertedCategories } from "../../../../shared/componentCategories";

const StockItemsList = ({
    componentCompose,
    templativeRootDirectoryPath,
    currentFilepath,
    updateViewedFileUsingExplorerAsyncCallback,
    deleteStockCompositionsWithNameAsync,
    toggleDisableStockCompositionAsync,
    duplicateStockCompositionAsync,
    renameStockCompositionAsync 
}) => {
    const [isExtended, setIsExtended] = useState(true);
    
    const toggleExtendedAsync = () => {
        setIsExtended(prev => !prev);
    }
    
    const stockItems = componentCompose
        .map((composition, index) => ({ ...composition, originalIndex: index }))
        .filter(composition => composition.type.includes("STOCK_"));
    
    var invertedCategories = getInvertedCategories()
    var uniqueParentageComponents = {}
    stockItems.forEach(stockItem => {
        const stockLessComponentType = stockItem.type.replace("STOCK_", "")
        const parentage = invertedCategories[stockLessComponentType]
        if (!parentage) {
            console.log(`${stockItem.type} has no parentage`)
            return
        }
        const collectedType = parentage.slice(2).slice(0,-1).join(" ")
        const uniqueIdentifier = `${stockItem.name} ${collectedType}` 
        
        if (uniqueIdentifier in uniqueParentageComponents) {
            uniqueParentageComponents[uniqueIdentifier].quantity += stockItem.quantity
        }
        else {
            uniqueParentageComponents[uniqueIdentifier] = {
                name: stockItem.name,
                type: stockItem.type,
                uniqueIdentifier: uniqueIdentifier,
                quantity: stockItem.quantity,
                disabled: stockItem.disabled,
                originalIndex: stockItem.originalIndex
            }
        }
    });
    uniqueParentageComponents = Object.values(uniqueParentageComponents)
        
    return (
        <div className="content-file-list unified-viewer-list">
            <ResourceHeader 
                IconSource={stockIcon}
                header="Stock Items"
                isExtended={isExtended}
                toggleExtendedAsyncCallback={toggleExtendedAsync}
            />
            {isExtended &&
                <>
                    {uniqueParentageComponents.map((composition) => 
                        <StockCompositionItem
                            key={composition.name + composition.originalIndex}
                            type={composition.type}
                            templativeRootDirectoryPath={templativeRootDirectoryPath}
                            quantity={composition.quantity}
                            compositionName={composition.name}
                            isDisabled={composition.disabled}
                            currentFilepath={currentFilepath}
                            filepath={path.join(templativeRootDirectoryPath, `component-compose.json#${composition.name}`)}
                            updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                            deleteStockCompositionsWithNameCallbackAsync={() => deleteStockCompositionsWithNameAsync(composition.name)}
                            duplicateStockCompositionCallbackAsync={() => duplicateStockCompositionAsync(composition.name)}
                            toggleDisableStockCompositionCallbackAsync={() => toggleDisableStockCompositionAsync(composition.name)}
                            renameStockCompositionCallbackAsync={(newName) => renameStockCompositionAsync(composition.name, newName)}
                            isStock={true}
                        />
                    )}
                </>
            } 
        </div>
    );
}

export default StockItemsList; 