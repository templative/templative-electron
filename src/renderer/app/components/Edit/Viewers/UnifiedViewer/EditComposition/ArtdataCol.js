import React, { useState } from "react";
import { extendedChevron, unextendedChevron } from "./Chevrons";
import ArtdataViewer from "../../ArtdataViewer/ArtdataViewer";
import path from "path";
import artdataIcon from "../../../Icons/artDataIcon.svg";

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
        availableDataSources
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
            const rightChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg>
            return <div className="unselecteable-artdata" key={face}>
                <p>
                    {rightChevron} <img 
                        className="tab-icon" 
                        src={artdataIcon} 
                        alt="Tab icon"
                    /> {face} Art Recipe <span className="subfile-filepath">Same as Front Art Recipe</span>
                </p>
            </div>
        }
        const isExtended = extensionState[face];
        return <div className="" key={face}>
            <p onClick={() => toggleExtension(face)}>
                { isExtended ? extendedChevron : unextendedChevron } <img 
                    className="tab-icon" 
                    src={artdataIcon} 
                    alt="Tab icon"
                /> {face} Art Recipe <span className="subfile-filepath">{path.parse(filepath).name}.json</span> </p>
            { isExtended && 
                <div className="universal-file-content">
                    <ArtdataViewer 
                        templativeRootDirectoryPath={templativeRootDirectoryPath}
                        filepath={filepath} 
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