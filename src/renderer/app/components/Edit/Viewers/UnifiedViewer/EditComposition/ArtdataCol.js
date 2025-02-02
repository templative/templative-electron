import React, { useState } from "react";
import ArtdataViewer from "../../ArtdataViewer/ArtdataViewer";
import path from "path";
import artdataIcon from "../../../Icons/artDataIcon.svg";
import ChevronHeader from "./ChevronHeader";

export default function ArtdataCol(params) {
    const {
        frontArtdataFilepath,
        backArtdataFilepath,
        dieFaceArtdataFilepath,
        hasFrontArtdata,
        hasBackArtdata,
        hasDieFaceArtdata,
        templativeRootDirectoryPath,
        handleFileSave,
        updateViewedFileUsingExplorerAsyncCallback,
        availableDataSources,
        updateViewedFileUsingTabAsyncCallback
    } = params;
    
    const [extensionState, setExtensionState] = useState({
        Front: hasFrontArtdata,
        Back: false,
        DieFace: hasDieFaceArtdata
    });

    const artdataFiles = {
        "Front": frontArtdataFilepath,
        "Back": backArtdataFilepath,
        "DieFace": dieFaceArtdataFilepath,
    }
    var artdataRows = []
    const toggleExtension = (face) => {
        setExtensionState(prev => ({
            ...prev,
            [face]: !prev[face]
        }));
    };

    artdataRows = Object.entries(artdataFiles).map(([face, filepath]) => {
        if (filepath === undefined) {
            return <div key={face}/>
        }
        const hasArtdata = {
            "Front": hasFrontArtdata,
            "Back": hasBackArtdata,
            "DieFace": hasDieFaceArtdata
        }[face];
        if (!hasArtdata) {
            return <div key={face}/>
        }
        if (face === "Back" && (backArtdataFilepath === frontArtdataFilepath)) {
            return <div className="unselecteable-artdata" key={face}>
                <ChevronHeader 
                    isExtended={false}
                    onClick={() => {}}
                    icon={artdataIcon}
                    title={`${face} Art Recipe`}
                    filepath={filepath}
                    filetype="ARTDATA"
                    templativeRootDirectoryPath={templativeRootDirectoryPath}
                    updateViewedFileUsingTabAsyncCallback={updateViewedFileUsingTabAsyncCallback}
                    className="artdata-header unextendable"
                    suffix="Same as Front Art Recipe"
                />
            </div>
        }
        const isExtended = extensionState[face];
        return <div className="content-container" key={face}>
            <ChevronHeader 
                isExtended={isExtended}
                onClick={() => toggleExtension(face)}
                icon={artdataIcon}
                title={`${face} Art Recipe`}
                filepath={filepath}
                filetype="ARTDATA"
                templativeRootDirectoryPath={templativeRootDirectoryPath}
                updateViewedFileUsingTabAsyncCallback={updateViewedFileUsingTabAsyncCallback}
                className="artdata-header"
            />
            { isExtended && 
                <div className="universal-file-content">
                    <ArtdataViewer 
                        templativeRootDirectoryPath={templativeRootDirectoryPath}
                        filepath={filepath} 
                        filetype="ARTDATA"
                        saveFileAsyncCallback={handleFileSave}
                        updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                        availableDataSources={availableDataSources}
                    />
                </div>
            }
        </div>
    });
    return <div className="col artdata-column">
        {artdataRows}
    </div>
}