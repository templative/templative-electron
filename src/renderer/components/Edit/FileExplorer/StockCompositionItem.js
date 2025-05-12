import React, { useState } from "react";
import ContextMenu from "../../ContextMenu";
import { channels } from '../../../../shared/constants';
const { ipcRenderer } = window.require('electron');
import {addSpaces} from "../../../utility/addSpaces"
const path = require("path");
const shell = require('electron').shell;
import CompositionSettingsModal from "../CompositionSettingsModal";
import { getInvertedCategories } from "../../../../shared/componentCategories";

export default function StockCompositionItem(props) {
    const { type, quantity, compositionName, isDisabled, 
        filepath, currentFilepath,
        updateViewedFileUsingExplorerAsyncCallback, 
        templativeRootDirectoryPath,
        deleteStockCompositionsWithNameCallbackAsync,
        duplicateStockCompositionCallbackAsync,
        toggleDisableStockCompositionCallbackAsync,
        renameStockCompositionCallbackAsync
    } = props;
    const [isHovering, setIsHovering] = useState(false);
    const [isShowingContextMenu, setIsShowingContextMenu] = useState(false);
    const [contextCoordinates, setContextCoordinates] = useState({ x: 0, y: 0 });
    const [isRenamingFile, setIsRenamingFile] = useState(false);
    const [newName, setNewName] = useState(compositionName);

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

    const openFileAsyncCallback = async () => await updateViewedFileUsingExplorerAsyncCallback("UNIFIED_STOCK", filepath);
    const isSelected = currentFilepath !== undefined && path.normalize(currentFilepath) === path.normalize(filepath);

    const deleteStockCompositionsWithNameAreYouSure = async () => {
        if (window.confirm(`Are you sure you want to delete all stock compositions with the name "${compositionName}"?`)) {
            await deleteStockCompositionsWithNameCallbackAsync();
        }
    }

    const commands = [
        {name: "Duplicate", callback: duplicateStockCompositionCallbackAsync},
        {name: "Rename", callback: () => setIsRenamingFile(!isRenamingFile)},
        {name: isDisabled ? "Enable" : "Disable", callback: toggleDisableStockCompositionCallbackAsync},
        {name: "Delete", callback: deleteStockCompositionsWithNameAreYouSure},
    ]
    var readableType = addSpaces(type)
    const stocklessType= type.replace("STOCK_", "");
    const invertedCategories = getInvertedCategories();
    const parentage = invertedCategories[stocklessType];
    if (parentage) {
        readableType = parentage.slice(2).slice(0, -1).join(" ");
    }
    else {
        console.log(`${type} has no parentage`)
    }
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
                    commands={commands}
                    closeContextMenuCallback={closeContextMenu}
                />
            }
            {isRenamingFile ?
                <div className="input-group input-group-sm stock-composition-item-rename-container"  data-bs-theme="dark">
                    <input 
                        autoFocus 
                        type="text" 
                        className="form-control stock-composition-item-rename-input" 
                        onChange={(event) => setNewName(event.target.value)}
                        onBlur={() => setIsRenamingFile(false)} 
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                await renameStockCompositionCallbackAsync(newName);
                                setIsRenamingFile(false);
                            }
                            if (e.key === "Escape") {
                                setIsRenamingFile(false);
                            }
                        }}
                        value={newName}
                    />
                </div>
                :
                <p className={`renameable-file`}>
                    <span style={{ marginLeft: `24px` }}/>
                    <span className={isDisabled ? "disabled-composition-item" : "" + "composition-item"}>{quantity}x <span className="composition-item-name">{compositionName}</span> <span className="composition-item-type">{readableType}</span></span>
                </p>
            }
        </div>
    );
};