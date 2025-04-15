import React, { useState, useContext, useEffect } from "react";
import ContentToggle from "./ContentToggle";
import { RenderingWorkspaceContext } from "../../../../Render/RenderingWorkspaceProvider";

// Gamedata viewers
import StudioGamedataViewer from "../../GamedataViewer/StudioGamedataViewer";
import GameGamedataViewer from "../../GamedataViewer/GameGamedataViewer";
import ComponentGamedataViewer from "../../GamedataViewer/ComponentGamedataViewer";
import PieceGamedataViewer from "../../GamedataViewer/PieceGamedataViewer";

// Artdata viewer
import ArtdataViewer from "../../ArtdataViewer/ArtdataViewer";

// Icons
import StudioIcon from "../../../Icons/colorless/colorlessStudioIcon.svg?react"
import GameIcon from "../../../Icons/colorless/colorlessGameIcon.svg?react"
import ComponentIcon from "../../../Icons/colorless/colorlessComponentIcon.svg?react"
import PieceIcon from "../../../Icons/colorless/colorlessPieceIcon.svg?react"
import ArtdataIcon from "../../../Icons/colorless/colorlessArtdataIcon.svg?react";

export default function UnifiedCol(params) {
    const {
        templativeRootDirectoryPath,
        componentName,
        
        // Gamedata props
        studioGamedataFilepath,
        gameGamedataFilepath,
        componentGamedataFilepath,
        piecesGamedataFilepath,
        showPreviewCallback,
        
        // Artdata props
        frontArtdataFilepath,
        backArtdataFilepath,
        dieFaceArtdataFilepath,
        hasFrontArtdata,
        hasBackArtdata,
        hasDieFaceArtdata,
        availableDataSources,
        
        // Common props
        handleFileSave,
        updateViewedFileUsingTabAsyncCallback,
        updateViewedFileUsingExplorerAsyncCallback,
        updateCompositionFilepathCallback
    } = params;

    const { lastViewedContentType, setLastViewedContentType, selectContentTypeForComposition } = useContext(RenderingWorkspaceContext);

    // Create unified content options
    const contentOptions = [
        // Gamedata options
        { name: "Studio Content", color: "#9e4ddf", icon: StudioIcon },
        { name: "Game Content", color: "#426ac3", icon: GameIcon },
        { name: "Component Content", color: "#5f9edf", icon: ComponentIcon },
        { name: "Piece Content", color: "#69d1d2", icon: PieceIcon },
    ];
    
    // Add artdata options conditionally
    if (hasFrontArtdata) {
        contentOptions.push({
            name: "Front Art Recipe",
            color: "#e8b24e",
            icon: ArtdataIcon
        });
    }
    
    if (hasBackArtdata) {
        const suffix = backArtdataFilepath === frontArtdataFilepath ? " (Same as Front)" : "";
        contentOptions.push({
            name: "Back Art Recipe" + suffix,
            color: "#e8b24e",
            icon: ArtdataIcon
        });
    }
    
    if (hasDieFaceArtdata) {
        contentOptions.push({
            name: "DieFace Art Recipe",
            color: "#e8b24e",
            icon: ArtdataIcon
        });
    }

    // Get available content types
    const availableContentTypes = contentOptions.map(option => option.name);
    
    // Initialize selected content based on last viewed content and available options
    const [selectedContent, setSelectedContent] = useState(() => 
        selectContentTypeForComposition(availableContentTypes)
    );

    // Update the last viewed content type when selection changes
    const handleContentChange = (content) => {
        setSelectedContent(content);
        setLastViewedContentType(content);
    };

    // Render the appropriate content based on selection
    const renderContent = () => {
        // Handle gamedata content
        if (["Studio Content", "Game Content", "Component Content", "Piece Content"].includes(selectedContent)) {
            switch (selectedContent) {
                case "Studio Content":
                    return (
                        <StudioGamedataViewer 
                            filepath={studioGamedataFilepath} 
                            saveFileAsyncCallback={handleFileSave}
                        />
                    );
                case "Game Content":
                    return (
                        <GameGamedataViewer 
                            filepath={gameGamedataFilepath} 
                            saveFileAsyncCallback={handleFileSave}
                        />
                    );
                case "Component Content":
                    return (
                        <ComponentGamedataViewer 
                            filepath={componentGamedataFilepath} 
                            saveFileAsyncCallback={handleFileSave}
                        />
                    );
                case "Piece Content":
                    return (
                        <PieceGamedataViewer 
                            filepath={piecesGamedataFilepath} 
                            saveFileAsyncCallback={handleFileSave}
                            showPreviewCallback={showPreviewCallback}
                            isPreviewEnabled={true}
                            componentName={componentName}
                            templativeRootDirectoryPath={templativeRootDirectoryPath}
                        />
                    );
                default:
                    return null;
            }
        }
        
        // Handle artdata content
        if (["Front Art Recipe", "Back Art Recipe", "DieFace Art Recipe"].includes(selectedContent)) {
            const faceName = selectedContent.split(" ")[0]; // Get just the face name without suffix
            const artdataFiles = {
                "Front": frontArtdataFilepath,
                "Back": backArtdataFilepath,
                "DieFace": dieFaceArtdataFilepath,
            };
            
            const filepath = artdataFiles[faceName];
            
            // If Back is selected but uses the same file as Front, show a message
            if (faceName === "Back" && backArtdataFilepath === frontArtdataFilepath) {
                return (
                    <div>
                        <div className="same-file-message">
                            This face uses the same Art Recipe as the Front face.
                        </div>
                        <ArtdataViewer 
                            templativeRootDirectoryPath={templativeRootDirectoryPath}
                            filepath={filepath} 
                            filetype="ARTDATA"
                            saveFileAsyncCallback={handleFileSave}
                            updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                            availableDataSources={availableDataSources}
                        />
                    </div>
                );
            }
            
            return (
                <ArtdataViewer 
                    templativeRootDirectoryPath={templativeRootDirectoryPath}
                    filepath={filepath} 
                    filetype="ARTDATA"
                    saveFileAsyncCallback={handleFileSave}
                    updateViewedFileUsingExplorerAsyncCallback={updateViewedFileUsingExplorerAsyncCallback}
                    availableDataSources={availableDataSources}
                />
            );
        }
        
        return null;
    };

    return (
        <div className="col unified-column">
            <div className="content-container">
                <ContentToggle 
                    options={contentOptions}
                    onChange={handleContentChange}
                    defaultSelected={selectedContent}
                />
                <div className="universal-file-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
} 