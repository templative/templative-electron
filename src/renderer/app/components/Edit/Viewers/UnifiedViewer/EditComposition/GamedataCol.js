import React, { useState } from "react";
import { extendedChevron, unextendedChevron } from "./Chevrons";
import StudioGamedataViewer from "../../GamedataViewer/StudioGamedataViewer";
import GameGamedataViewer from "../../GamedataViewer/GameGamedataViewer";
import ComponentGamedataViewer from "../../GamedataViewer/ComponentGamedataViewer";
import PieceGamedataViewer from "../../GamedataViewer/PieceGamedataViewer";

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
        handleFileSave,
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
            <p 
                onClick={() => toggleExtension("isStudioExtended")}
                className="studio-gamedata-header"
            >
                {isStudioExtended ? extendedChevron : unextendedChevron} 
                <img 
                    className="tab-icon" 
                    src={studioIcon} 
                    alt="Tab icon"
                /> 
                Studio Content <span className="subfile-filepath">{`${path.parse(studioGamedataFilepath).name}.json`}</span>
            </p>
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
            <p 
                onClick={() => toggleExtension("isGameExtended")}
                className="game-gamedata-header"
            >
                {isGameExtended ? extendedChevron : unextendedChevron} 
                <img 
                    className="tab-icon" 
                    src={gameIcon} 
                    alt="Tab icon"
                /> 
                Game Content <span className="subfile-filepath">{`${path.parse(gameGamedataFilepath).name}.json`}</span>
            </p>
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
            <p 
                onClick={() => toggleExtension("isComponentExtended")}
                className="component-gamedata-header"
            >
                {isComponentExtended ? extendedChevron : unextendedChevron} 
                <img 
                    className="tab-icon" 
                    src={componentIcon} 
                    alt="Tab icon"
                /> 
                Component Content <span className="subfile-filepath">{`${path.parse(componentGamedataFilepath).name}.json`}</span>
            </p>
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
            <p 
                onClick={() => toggleExtension("isPiecesExtended")}
                className="pieces-gamedata-header"
            >
                {isPiecesExtended ? extendedChevron : unextendedChevron} 
                <img 
                    className="tab-icon" 
                    src={pieceIcon} 
                    alt="Tab icon"
                /> 
                Piece Content <span className="subfile-filepath">{`${path.parse(piecesGamedataFilepath).name}.json`}</span>
            </p>
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