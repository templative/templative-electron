import React, { useState } from "react";
import ContextMenu from "../../ContextMenu";
import { channels } from '../../../../../shared/constants';
const { ipcRenderer } = window.require('electron');
import {addSpaces} from "../../../utility/addSpaces"
const path = require("path");
const shell = require('electron').shell;
import CompositionSettingsModal from "../CompositionSettingsModal";


export default function CompositionItem(props) {
    const { type, quantity, compositionName, isDisabled, 
        directoryPath, filepath, currentFilepath,
        updateViewedFileUsingExplorerAsyncCallback, 
        templativeRootDirectoryPath, 
        updateRouteCallback,
        deleteCompositionCallbackAsync,
        duplicateCompositionCallbackAsync,
        toggleDisableCompositionCallbackAsync,
        isStock,
        componentGamedataFilename,
        piecesGamedataFilename,
        artdataFrontFilename,
        artdataBackFilename,
        artdataDieFaceFilename,
        updateComponentComposeFieldAsync,
        originalIndex
    } = props;
    const [isHovering, setIsHovering] = useState(false);
    const [isShowingContextMenu, setIsShowingContextMenu] = useState(false);
    const [contextCoordinates, setContextCoordinates] = useState({ x: 0, y: 0 });
    const [isRenamingFile, setIsRenamingFile] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);

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

    const handleOpenFileModal = () => {
        setShowFileModal(true);
    };

    const handleCloseFileModal = () => {
        setShowFileModal(false);
    };

    const handleSaveFileChanges = async (selectedFiles, selectedType, isDisabled, nameChange, quantityChange) => {
        // Update component fields
        if (selectedType !== type) {
            await updateComponentComposeFieldAsync(originalIndex, "type", selectedType);
        }
        if (nameChange !== compositionName) {
            await updateComponentComposeFieldAsync(originalIndex, "name", nameChange);
        }
        if (quantityChange !== quantity) {
            await updateComponentComposeFieldAsync(originalIndex, "quantity", quantityChange);
        }
        

        if (isDisabled !== props.isDisabled) {
            await updateComponentComposeFieldAsync(originalIndex, "disabled", isDisabled);
        }

        // Update file references
        const fileFields = {
            componentGamedataFilename: selectedFiles.componentGamedataFilename,
            piecesGamedataFilename: selectedFiles.piecesGamedataFilename,
            artdataFrontFilename: selectedFiles.artdataFrontFilename,
            artdataBackFilename: selectedFiles.artdataBackFilename,
            artdataDieFaceFilename: selectedFiles.artdataDieFaceFilename
        };

        for (const [field, value] of Object.entries(fileFields)) {
            if (value !== props[field]) {
                await updateComponentComposeFieldAsync(originalIndex, field, value);
            }
        }

        handleCloseFileModal();
    };

    const commands = [
        {name: "Open", callback: openFileAsyncCallback},
        {name: "Open in Default App", callback: openInDefaultAppAsync},
        {name: "Edit Settings", callback: handleOpenFileModal},
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
            {showFileModal && 
                <CompositionSettingsModal
                    show={showFileModal}
                    onHide={handleCloseFileModal}
                    name={compositionName}
                    currentFiles={{
                        componentGamedataFilename: componentGamedataFilename,
                        piecesGamedataFilename: piecesGamedataFilename || null,
                        artdataFrontFilename: artdataFrontFilename || null,
                        artdataBackFilename: artdataBackFilename || null,
                        artdataDieFaceFilename: artdataDieFaceFilename || null
                    }}
                    isDisabled={isDisabled}
                    componentType={type}
                    componentTypesCustomInfo={props.componentTypesCustomInfo}
                    componentTypesStockInfo={props.componentTypesStockInfo}
                    templativeRootDirectoryPath={props.templativeRootDirectoryPath}
                    onSaveChanges={handleSaveFileChanges}
                />
            }
        </div>
    );
};