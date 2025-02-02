import React, { useState } from "react";
import StudioGamedataViewer from "../../GamedataViewer/StudioGamedataViewer";
import GameGamedataViewer from "../../GamedataViewer/GameGamedataViewer";
import ComponentGamedataViewer from "../../GamedataViewer/ComponentGamedataViewer";
import PieceGamedataViewer from "../../GamedataViewer/PieceGamedataViewer";
import ChevronHeader from "./ChevronHeader";

import path from "path";
import studioIcon from "../../../Icons/studioIcon.svg"
import gameIcon from "../../../Icons/gameIcon.svg"
import componentIcon from "../../../Icons/componentIcon.svg"
import pieceIcon from "../../../Icons/pieceIcon.svg"

export default function GamedataCol(params) {
    const {
        gamedataColumnWidth,
        isResizing,
        startResize,
        templativeRootDirectoryPath,
        componentName,
        studioGamedataFilepath,
        gameGamedataFilepath,
        componentGamedataFilepath,
        piecesGamedataFilepath,
        showPreviewCallback,
        updateViewedFileUsingTabAsyncCallback,
        handleFileSave,
        updateCompositionFilepathCallback,
    } = params;

    const [isStudioExtended, setIsStudioExtended] = useState(false);
    const [isGameExtended, setIsGameExtended] = useState(false);
    const [isComponentExtended, setIsComponentExtended] = useState(false);
    const [isPiecesExtended, setIsPiecesExtended] = useState(true);

    const toggleExtension = (stateKey) => {
        switch(stateKey) {
            case "isStudioExtended":
                setIsStudioExtended(!isStudioExtended);
                break;
            case "isGameExtended":
                setIsGameExtended(!isGameExtended);
                break;
            case "isComponentExtended":
                setIsComponentExtended(!isComponentExtended);
                break;
            case "isPiecesExtended":
                setIsPiecesExtended(!isPiecesExtended);
                break;
        }
    };

    return <div className="col gamedata-column" style={{width: `${gamedataColumnWidth}%`}}>
        <div className={`viewer-resize-handle${isResizing ? ' active' : ''}`} onMouseDown={startResize}/>
        <div className="content-container">
            <ChevronHeader 
                isExtended={isStudioExtended}
                onClick={() => toggleExtension("isStudioExtended")}
                icon={studioIcon}
                title="Studio Content"
                filetype="STUDIO_GAMEDATA"
                filepath={studioGamedataFilepath}
                className="studio-gamedata-header"
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                updateViewedFileUsingTabAsyncCallback={updateViewedFileUsingTabAsyncCallback}
                updateCompositionFilepathCallback={updateCompositionFilepathCallback}
            />
            {isStudioExtended && 
                <div className="universal-file-content">
                    <StudioGamedataViewer 
                        filepath={studioGamedataFilepath} 
                        saveFileAsyncCallback={handleFileSave}
                    />
                </div>
            }
        </div>
        <div className="content-container">
            <ChevronHeader 
                isExtended={isGameExtended}
                onClick={() => toggleExtension("isGameExtended")}
                icon={gameIcon}
                title="Game Content"
                filetype="GAME_GAMEDATA"
                filepath={gameGamedataFilepath}
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                className="game-gamedata-header"
                updateViewedFileUsingTabAsyncCallback={updateViewedFileUsingTabAsyncCallback}
                updateCompositionFilepathCallback={updateCompositionFilepathCallback}
            />
            {isGameExtended && 
                <div className="universal-file-content">
                    <GameGamedataViewer 
                        filepath={gameGamedataFilepath} 
                        saveFileAsyncCallback={handleFileSave}
                    />
                </div>
            }
        </div>
        <div className="content-container">
            <ChevronHeader 
                isExtended={isComponentExtended}
                onClick={() => toggleExtension("isComponentExtended")}
                icon={componentIcon}
                title="Component Content"
                filetype="COMPONENT_GAMEDATA"
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                filepath={componentGamedataFilepath}
                field="componentGamedataFilename"
                className="component-gamedata-header"
                updateViewedFileUsingTabAsyncCallback={updateViewedFileUsingTabAsyncCallback}
                updateCompositionFilepathCallback={updateCompositionFilepathCallback}
            />
            {isComponentExtended && 
                <div className="universal-file-content">
                    <ComponentGamedataViewer 
                        filepath={componentGamedataFilepath} 
                        saveFileAsyncCallback={handleFileSave}
                    />
                </div>
            }
        </div>
        <div className="content-container">
            <ChevronHeader 
                isExtended={isPiecesExtended}
                onClick={() => toggleExtension("isPiecesExtended")}
                icon={pieceIcon}
                title="Piece Content"
                filetype="PIECE_GAMEDATA"
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                filepath={piecesGamedataFilepath}
                field="piecesGamedataFilename"
                className="pieces-gamedata-header"
                updateViewedFileUsingTabAsyncCallback={updateViewedFileUsingTabAsyncCallback}
                updateCompositionFilepathCallback={updateCompositionFilepathCallback}
            />
            {isPiecesExtended && 
                <div className="universal-file-content">
                    <PieceGamedataViewer 
                        filepath={piecesGamedataFilepath} 
                        saveFileAsyncCallback={handleFileSave}
                        showPreviewCallback={showPreviewCallback}
                        isPreviewEnabled={true}
                        componentName={componentName}
                        templativeRootDirectoryPath={templativeRootDirectoryPath}
                    />
                </div>                                         
            }
        </div>
    </div>
    
}