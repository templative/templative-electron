import React from "react";
import path from "path";
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
                <p className="gamecrafter-header-title">TheGameCrafter Store Images</p>
                <button 
                    className="btn btn-outline-primary open-folder-btn" 
                    onClick={openGamecrafterFolder}
                    title="Open gamecrafter folder"
                >
                    Open GameCrafter Ads Folder
                </button>
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

