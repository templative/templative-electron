import React, { useState } from "react";
import ResourceHeader from "./ContentFiles/ResourceHeader";
import stockIcon from "../Icons/stockIcon.svg"
import CompositionItem from "./CompositionItem";
const path = require("path")

const StockItemsList = (props) => {
    const [isExtended, setIsExtended] = useState(true);
    
    const toggleExtendedAsync = () => {
        setIsExtended(prev => !prev);
    }

    const stockItems = props.componentCompose
        .map((composition, index) => ({ ...composition, originalIndex: index }))
        .filter(composition => composition.type.includes("STOCK_"));
    
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
                    {stockItems.map((composition) => 
                        <CompositionItem
                            key={composition.name + composition.originalIndex}
                            type={composition.type}
                            templativeRootDirectoryPath={props.templativeRootDirectoryPath}
                            quantity={composition.quantity}
                            compositionName={composition.name}
                            isDisabled={composition.disabled}
                            currentFilepath={props.currentFilepath}
                            filepath={path.join(props.templativeRootDirectoryPath, `component-compose.json#${composition.name}`)}
                            updateViewedFileUsingExplorerAsyncCallback={props.updateViewedFileUsingExplorerAsyncCallback}
                            updateRouteCallback={props.updateRouteCallback}
                            deleteCompositionCallbackAsync={() => props.deleteCompositionCallbackAsync(composition.originalIndex)}
                            duplicateCompositionCallbackAsync={() => props.duplicateCompositionCallbackAsync(composition.originalIndex)}
                            toggleDisableCompositionCallbackAsync={() => props.toggleDisableCompositionCallbackAsync(composition.originalIndex)}
                            isStock={true}
                        />
                    )}
                </>
            } 
        </div>
    );
}

export default StockItemsList; 