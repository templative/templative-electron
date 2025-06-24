import React from "react";
import path from "path";
import TutorialQuestionMark from '../Tutorial/TutorialQuestionMark';
const { ipcRenderer } = window.require('electron');
const { channels } = require('../../../shared/constants');

export default function TheGameCrafterAdsView({ templativeRootDirectoryPath }) {
    const gamecrafterPath = path.join(templativeRootDirectoryPath, "gamecrafter");
    
    const images = [
        { name: "Backdrop", filename: "backdrop.png" },
        { name: "Logo", filename: "logo.png" },
        { name: "Advertisement", filename: "advertisement.png" },
        { name: "Action Shot", filename: "actionShot.png" },
    ];

    const openGamecrafterFolder = () => {
        ipcRenderer.invoke(channels.TO_SERVER_OPEN_FILEPATH, gamecrafterPath);
    };

    return (
        <>
            <div className="gamecrafter-header">
                <div className="gamecrafter-header-buttons-left">
                    <p className="gamecrafter-header-title">TheGameCrafter Store Images</p>
                </div>
                <div className="gamecrafter-header-buttons-right">
                    <button 
                        className="btn btn-outline-primary btn-sm open-folder-btn" 
                        onClick={openGamecrafterFolder}
                        title="Open gamecrafter folder"
                    >
                        Open GameCrafter Ads Folder
                    </button>
                    <TutorialQuestionMark tutorialName="Upload to TheGameCrafter" />
                </div>
            </div>
            <div className="gamecrafter-images">
                {images.map((image) => {
                    const imagePath = path.join(gamecrafterPath, image.filename);
                    return (
                        <div key={image.filename} className="gamecrafter-image-item">
                            <p>{image.name}</p>
                            <img 
                                src={`file://${imagePath}`} 
                                alt={image.name}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}

