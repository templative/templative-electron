import React, { useState } from "react";
import "../Render/RenderPanel.css"
import ContextMenu from "../ContextMenu";
const {shell} = require('electron')
const path = require("path")

const RenderOutputOption = ({ 
    directory, 
    isSelected,
    onSelect, 
    gameDisplayName,
    componentFilter,
    versionName,
    versionNumber,
    timestamp,
    onDelete
}) => {
    const [isShowingContextMenu, setIsShowingContextMenu] = useState(false);
    const [contextCoordinates, setContextCoordinates] = useState({ x: 0, y: 0 });

    const handleRightClick = (e) => {
        e.preventDefault();
        setIsShowingContextMenu(!isShowingContextMenu);
        setContextCoordinates({ x: e.pageX, y: e.pageY });
    }

    const closeContextMenu = () => {
        setIsShowingContextMenu(false);
    }

    const getDirectoryPath = () => path.join(directory.path, directory.name);

    const openFolderAsync = async () => {
        if (directory === undefined) {
            return
        }
        const safePath = getDirectoryPath()
        if (safePath === null) {
            return
        }
        shell.openPath(safePath);
    }

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${gameDisplayName}"?`)) {
            await onDelete(directory);
        }
    };

    const commands = [
        {name: "View Folder", callback: async () => await openFolderAsync()},
        {name: "Delete", callback: handleDelete},
    ];

    return (
        <div 
            className={`render-output-option ${isSelected ? "selected-output-directory" : ""}`} 
            onClick={() => onSelect(directory)}
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
            
            <p className="render-output-main-line">
                <span className="render-output-name">{gameDisplayName}</span>
                {componentFilter && 
                    <span className="render-output-component-filter">- {componentFilter}</span>
                }
            </p>
            <p>
                <span className="render-output-version-name">{versionName}</span>
                <span className="render-output-version">v{versionNumber}</span>
            </p>
            
            {timestamp !== undefined && 
                <p className="render-output-date">{timestamp}</p>
            }
        </div>
    );
}

export default RenderOutputOption;