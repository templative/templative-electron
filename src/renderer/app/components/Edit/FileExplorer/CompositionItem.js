import React, { useState } from "react";
import ContextMenu from "../../ContextMenu";
import { channels } from '../../../../../shared/constants';
const { ipcRenderer } = window.require('electron');
import {addSpaces} from "../../../utility/addSpaces"
const path = require("path");
const shell = require('electron').shell;


export default function CompositionItem(props) {
    const { type, quantity, compositionName, isDisabled, 
        directoryPath, filepath, currentFilepath,
        updateViewedFileUsingExplorerAsyncCallback, 
        templativeRootDirectoryPath, 
        updateRouteCallback,
        deleteCompositionCallbackAsync,
        duplicateCompositionCallbackAsync,
        toggleDisableCompositionCallbackAsync,
        isStock
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
        await ipcRenderer.invoke(channels.TO_SERVER_PRODUCE_GAME, request);
        updateRouteCallback("render")
    };

    const commands = [
        {name: "Open", callback: openFileAsyncCallback},
        {name: "Open in Default App", callback: openInDefaultAppAsync},
        {name: "Render", callback: renderCompositionAsyncCallback},
        {name: "Duplicate", callback: duplicateCompositionCallbackAsync},
        {name: isDisabled ? "Enable" : "Disable", callback: toggleDisableCompositionCallbackAsync},
        {name: "Delete", callback: deleteCompositionCallbackAsync},
    ]
    const stockCommands = [
        {name: "Duplicate", callback: duplicateCompositionCallbackAsync},
        {name: isDisabled ? "Enable" : "Disable", callback: toggleDisableCompositionCallbackAsync},
        {name: "Delete", callback: deleteCompositionCallbackAsync},
    ]
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
                    commands={isStock ? stockCommands : commands}
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