import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import TemplativeAccessTools from '../../../../TemplativeAccessTools';
import './ChooseNewFileModal.css';
import artdataIcon from "../../../Icons/artDataIcon.svg";
import componentIcon from "../../../Icons/componentIcon.svg"
import pieceIcon from "../../../Icons/pieceIcon.svg"

const ChooseNewFileModal = ({ 
    show, 
    onHide, 
    currentFilePath, 
    possibleFilePaths, 
    filetype,
    templativeRootDirectoryPath,
    onChooseFilePath 
}) => {
    const [files, setFiles] = React.useState([]);

    React.useEffect(() => {
        const loadFiles = async () => {
            try {
                const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(
                    templativeRootDirectoryPath, 
                    "game-compose.json"
                );
                const fields = {
                    "ARTDATA": "artdataDirectory",
                    "COMPONENT_GAMEDATA": "componentGamedataDirectory",
                    "PIECE_GAMEDATA": "piecesGamedataDirectory"
                };
                const field = fields[filetype];
                const filepath = path.join(templativeRootDirectoryPath, gameCompose[field]);
                const filepaths = await fs.readdir(filepath);
                setFiles(filepaths);
            } catch (error) {
                console.error('Error loading files:', error);
            }
        };

        if (show) {
            loadFiles();
        }
    }, [show, templativeRootDirectoryPath, filetype]);

    if (!show) return null;
    
    const currentFileTitle = path.relative(templativeRootDirectoryPath, currentFilePath);
    
    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className={`modal-header ${filetype === "ARTDATA" ? "artdata-modal-header" : filetype === "COMPONENT_GAMEDATA" ? "component-modal-header" : "piece-modal-header"}`}>
                    <img className="replacement-modal-icon" src={filetype === "ARTDATA" ? artdataIcon : filetype === "COMPONENT_GAMEDATA" ? componentIcon : pieceIcon} alt={filetype} />
                    <h3 className="modal-title">Replace <span className={`${filetype === "ARTDATA" ? "artdata-filename" : filetype === "COMPONENT_GAMEDATA" ? "component-filename" : "piece-filename"}`}>{currentFileTitle}</span> with?</h3>
                    <button className="close-button" onClick={onHide}>×</button>
                </div>
                <div className="modal-body">
                    <div className="file-list">
                        <select 
                            className="file-option"
                            onChange={(e) => onChooseFilePath(e.target.value)}
                            value={currentFilePath}
                        >
                            {files.map((filePath, index) => (
                                <option
                                    key={index}
                                    value={filePath}
                                    disabled={filePath === currentFilePath}
                                >
                                    {filePath}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseNewFileModal;
