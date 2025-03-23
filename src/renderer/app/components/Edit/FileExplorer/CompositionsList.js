import React, { useState } from "react";
import ResourceHeader from "./ContentFiles/ResourceHeader";
import componentComposeIcon from "../Icons/componentComposeIcon.svg"
const path = require("path")
import CompositionItem from "./CompositionItem";

const CompositionsList = (props) => {
    const [isExtended, setIsExtended] = useState(true);
    
    const toggleExtendedAsync = () => {
        setIsExtended(prev => !prev);
    }

    const compositions = props.componentCompose
        .map((composition, index) => ({ ...composition, originalIndex: index }))
        .filter(composition => !composition.type.includes("STOCK_"));
    
    return (
        <div className="content-file-list unified-viewer-list">
            <ResourceHeader 
                IconSource={componentComposeIcon}
                header="Compositions"
                isExtended={isExtended}
                toggleExtendedAsyncCallback={toggleExtendedAsync}
            />
            {isExtended &&
                <>
                    {compositions.map((composition) => 
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
                            isStock={false}
                        />
                    )}
                </>
            } 
        </div>
    );
}

export default CompositionsList;