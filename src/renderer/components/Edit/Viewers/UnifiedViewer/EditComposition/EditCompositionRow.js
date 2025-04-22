import React from "react";
import UnifiedCol from "./UnifiedCol";

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
        updateViewedFileUsingTabAsyncCallback,
        updateCompositionFilepathCallback,
        updateViewedFileUsingExplorerAsyncCallback,
        gameCompose,
        addGameComposeSyncKeyAsync,
    } = props;
    return (
        <div className="row g-0 unified-viewer">
            <UnifiedCol 
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                componentName={componentName}
                
                // Gamedata props
                studioGamedataFilepath={studioGamedataFilepath}
                gameGamedataFilepath={gameGamedataFilepath}
                componentGamedataFilepath={componentGamedataFilepath}
                piecesGamedataFilepath={piecesGamedataFilepath}
                showPreviewCallback={showPreviewCallback}
                
                // Artdata props
                frontArtdataFilepath={frontArtdataFilepath}
                backArtdataFilepath={backArtdataFilepath}
                dieFaceArtdataFilepath={dieFaceArtdataFilepath}
                hasFrontArtdata={hasFrontArtdata}
                hasBackArtdata={hasBackArtdata}
                hasDieFaceArtdata={hasDieFaceArtdata}
                availableDataSources={availableDataSources}
                
                // Common props
                handleFileSave={handleFileSave}
                updateViewedFileUsingTabAsyncCallback={updateViewedFileUsingTabAsyncCallback}
                updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                updateCompositionFilepathCallback={updateCompositionFilepathCallback}

                // Game compose props
                gameCompose={gameCompose}
                addGameComposeSyncKeyAsync={addGameComposeSyncKeyAsync}
            />
        </div>
    );
}