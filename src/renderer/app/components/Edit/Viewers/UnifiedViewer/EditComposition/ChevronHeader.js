import React, { useState } from "react";
import ContextMenu from "../../../../ContextMenu";
import { shell } from "electron";
import ChooseNewFileModal from "./ChooseNewFileModal";

const extendedChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down drop-down-chevron" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
</svg>
const unextendedChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right drop-down-chevron" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>

export default function ChevronHeader({ 
    isExtended,
    onClick,
    icon,
    filetype,
    title,
    filepath,
    templativeRootDirectoryPath,
    className,
    updateViewedFileUsingTabAsyncCallback,
    suffix
}) {
    const [isShowingContextMenu, setIsShowingContextMenu] = useState(false);
    const [contextCoordinates, setContextCoordinates] = useState({ x: 0, y: 0 });
    const [showFileModal, setShowFileModal] = useState(false);

    const handleRightClick = (e) => {
        e.preventDefault();
        setIsShowingContextMenu(true);
        setContextCoordinates({ x: e.pageX, y: e.pageY });
    };

    const closeContextMenu = () => {
        setIsShowingContextMenu(false);
    };

    const openFilepath = () => {
        shell.openPath(filepath);
    };

    const handleChooseNewFile = (newFilePath) => {
        updateViewedFileUsingTabAsyncCallback(filetype, newFilePath);
        setShowFileModal(false);
    };

    const shortPath = filepath
        .replace(/\\/g, '/')
        .replace(templativeRootDirectoryPath.replace(/\\/g, '/') + '/', '')
        
    const filename = shortPath.split('/').pop();
    
    var commands = [
        {
            name: `${isExtended ? 'Collapse' : 'Expand'} ${title}`,
            callback: () => {
                onClick();
                closeContextMenu();
            }
        },
        {
            name: `Open ${filename}`,
            callback: async () => {
                await updateViewedFileUsingTabAsyncCallback(filetype, filepath);
                closeContextMenu();
            }
        },
        {
            name: `Open ${filename} in Default App`,
            callback: () => {
                openFilepath();
                closeContextMenu();
            }
        },
    ]
    if (filetype === "ARTDATA" || filetype === "COMPONENT_GAMEDATA" || filetype === "PIECE_GAMEDATA") {
        commands.push({
            name: `Choose Different ${title} File`,
            callback: () => {
                setShowFileModal(true);
                closeContextMenu();
            }
        })
    }
    
    return (
        <>
            <p 
                onClick={onClick}
                onContextMenu={handleRightClick}
                className={className}
            >
                {isExtended ? extendedChevron : unextendedChevron} 
                <img 
                    className="tab-icon" 
                    src={icon} 
                    alt="Tab icon"
                /> 
                {title} <span className="subfile-filepath">{suffix || shortPath}</span>
            </p>
            {isShowingContextMenu && 
                <ContextMenu 
                    left={contextCoordinates.x} 
                    top={contextCoordinates.y}
                    commands={commands}
                    closeContextMenuCallback={closeContextMenu}
                />
            }
            <ChooseNewFileModal
                show={showFileModal}
                onHide={() => setShowFileModal(false)}
                currentFilePath={filepath}
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                filetype={filetype}
                onChooseFilePath={handleChooseNewFile}
            />
        </>
    );
} 