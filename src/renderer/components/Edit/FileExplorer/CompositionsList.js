import React, { useState } from "react";
import ResourceHeader from "./ContentFiles/ResourceHeader";
import componentComposeIcon from "../Icons/componentComposeIcon.svg?react"
const path = require("path")
import CompositionItem from "./CompositionItem";
import { COMPONENT_INFO } from "../../../../shared/componentInfo";
import { STOCK_COMPONENT_INFO } from "../../../../shared/stockComponentInfo";
const CompositionsList = ({
    componentCompose,
    templativeRootDirectoryPath,
    currentFilepath,
    updateViewedFileUsingExplorerAsyncCallback,
    updateRouteCallback,
    deleteCompositionCallbackAsync,
    duplicateCompositionCallbackAsync,
    toggleDisableCompositionCallbackAsync,
    updateComponentComposeFieldAsync,
    isExtended,
    toggleExtendedCallback
}) => {
    const compositions = componentCompose
        .map((composition, index) => ({ ...composition, originalIndex: index }))
        .filter(composition => !composition.type.includes("STOCK_"));
    
    return (
        <div className="content-file-list unified-viewer-list">
            <ResourceHeader 
                IconSource={componentComposeIcon}
                header="Compositions"
                isExtended={isExtended}
                toggleExtendedAsyncCallback={toggleExtendedCallback}
            />
            {isExtended &&<>
                {compositions.map((composition) => <CompositionItem
                    key={composition.name + composition.originalIndex}
                    type={composition.type}
                    templativeRootDirectoryPath={templativeRootDirectoryPath}
                    quantity={composition.quantity}
                    compositionName={composition.name}
                    isDisabled={composition.disabled}
                    currentFilepath={currentFilepath}
                    filepath={path.join(templativeRootDirectoryPath, `component-compose.json#${composition.name}`)}
                    updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                    updateRouteCallback={updateRouteCallback}
                    deleteCompositionCallbackAsync={() => deleteCompositionCallbackAsync(composition.originalIndex)}
                    duplicateCompositionCallbackAsync={() => duplicateCompositionCallbackAsync(composition.originalIndex)}
                    toggleDisableCompositionCallbackAsync={() => toggleDisableCompositionCallbackAsync(composition.originalIndex)}
                    isStock={false}
                    originalIndex={composition.originalIndex}
                    componentTypesCustomInfo={COMPONENT_INFO}
                    componentTypesStockInfo={STOCK_COMPONENT_INFO}
                    updateComponentComposeFieldAsync={updateComponentComposeFieldAsync}
                    artdataBackFilename={composition.artdataBackFilename}
                    artdataFrontFilename={composition.artdataFrontFilename}
                    artdataDieFaceFilename={composition.artdataDieFaceFilename}
                    componentGamedataFilename={composition.componentGamedataFilename}
                    piecesGamedataFilename={composition.piecesGamedataFilename}
                />)}
            </>} 
        </div>
    );
}

export default CompositionsList;