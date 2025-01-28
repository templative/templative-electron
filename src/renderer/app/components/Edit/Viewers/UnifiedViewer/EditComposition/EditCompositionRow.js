import React from "react";
import GamedataCol from "./GamedataCol";
import ArtdataRows from "./ArtdataCol";

export default function EditCompositionRow(props) {    
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
        frontArtdataFilepath,
        backArtdataFilepath,
        dieFaceArtdataFilepath,
        hasFrontArtdata,
        hasBackArtdata,
        hasDieFaceArtdata,
        availableDataSources,
        updateViewedFileUsingExplorerAsyncCallback,
    } = props;
    return (
        <div className="row g-0 unified-viewer">
            <GamedataCol 
                gamedataColumnWidth={gamedataColumnWidth}
                isResizing={isResizing}
                startResize={startResize}
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                componentName={componentName}
                studioGamedataFilepath={studioGamedataFilepath}
                gameGamedataFilepath={gameGamedataFilepath}
                componentGamedataFilepath={componentGamedataFilepath}
                piecesGamedataFilepath={piecesGamedataFilepath}
                showPreviewCallback={showPreviewCallback}
                handleFileSave={handleFileSave}
            />
            <ArtdataRows 
                frontArtdataFilepath={frontArtdataFilepath}
                backArtdataFilepath={backArtdataFilepath}
                dieFaceArtdataFilepath={dieFaceArtdataFilepath}
                hasFrontArtdata={hasFrontArtdata}
                hasBackArtdata={hasBackArtdata}
                hasDieFaceArtdata={hasDieFaceArtdata}
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                handleFileSave={handleFileSave}
                updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                availableDataSources={availableDataSources}
            />
        </div>
    );
}