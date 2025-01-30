import React, { useState } from "react";
import ContextMenu from "../../ContextMenu";
import socket from "../../../utility/socket";
// import "./ContentFiles.css"

const path = require("path");
const shell = require('electron').shell;
const addSpaces = (str) => {
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
}

export default function CompositionItem(props) {
    const { type, quantity, compositionName, isDisabled, 
        directoryPath, filepath, currentFilepath,
        updateViewedFileUsingExplorerAsyncCallback, 
        templativeRootDirectoryPath, 
        updateRouteCallback,
        deleteCompositionCallbackAsync,
        duplicateCompositionCallbackAsync,
        toggleDisableCompositionCallbackAsync
    } = props;
    const [isHovering, setIsHovering] = useState(false);
    const [isShowingContextMenu, setIsShowingContextMenu] = useState(false);
    const [contextCoordinates, setContextCoordinates] = useState({ x: 0, y: 0 });
    const [isRenamingFile, setIsRenamingFile] = useState(false);

    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const handleRightClick = (e) => {
        if (isRenamingFile) {
            return;
        }
        setIsShowingContextMenu(!isShowingContextMenu);
        setContextCoordinates({ x: e.pageX, y: e.pageY });
    };

    const closeContextMenu = () => {
        setIsShowingContextMenu(false);
    };

    const parsePathForCommonPath = () => {
        return path.relative(directoryPath, filepath).split(".")[0];
    };

    const openInDefaultAppAsync = async () => {
        shell.openPath(filepath.split("#")[0]);
    };

    const openFileAsyncCallback = async () => await updateViewedFileUsingExplorerAsyncCallback("UNIFIED_COMPONENT", filepath);
    const isSelected = currentFilepath !== undefined && path.normalize(currentFilepath) === path.normalize(filepath);

    const renderCompositionAsyncCallback = async () => {
        var request = {
            isDebug: false,
            isComplex: true,
            componentFilter: compositionName,
            language: "en",
            directoryPath: templativeRootDirectoryPath,
        }
        console.log(request)
        socket.emit('produceGame', request);
        updateRouteCallback("render")
    };

    return (
        
        <div 
            className={`icon-content-file-item-wrapper ${isSelected && "selected-content-file-item-wrapper"}`} 
            onClick={openFileAsyncCallback}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseOut}
            onContextMenu={handleRightClick}
        >
            {isShowingContextMenu && 
                <ContextMenu 
                    left={contextCoordinates.x} 
                    top={contextCoordinates.y}
                    commands={[
                        {name: "Open", callback: openFileAsyncCallback},
                        {name: "Open in Default App", callback: openInDefaultAppAsync},
                        {name: "Render", callback: renderCompositionAsyncCallback},
                        {name: "Duplicate", callback: duplicateCompositionCallbackAsync},
                        {name: isDisabled ? "Enable" : "Disable", callback: toggleDisableCompositionCallbackAsync},
                        {name: "Delete", callback: deleteCompositionCallbackAsync},
                    ]}
                    closeContextMenuCallback={closeContextMenu}
                />
            }
            <p className={`renameable-file`}>
                <span style={{ marginLeft: `24px` }}/>
                <span className={isDisabled ? "disabled-composition-item" : "" + "composition-item"}>{quantity}x <span className="composition-item-name">{compositionName}</span> {addSpaces(type.replace("STOCK_", ""))}</span>
            </p>
        </div>
    );
};