import React, { useState, useEffect } from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import TemplativeAccessTools from '../TemplativeAccessTools';
import './CompositionSettingsModal.css';
import { addSpaces } from "../../utility/addSpaces";
import ArtdataIcon from "./Icons/artDataIcon.svg?react";
import ComponentIcon from "./Icons/componentIcon.svg?react"
import PieceIcon from "./Icons/pieceIcon.svg?react"

const CompositionSettingsModal = ({ 
    show, 
    onHide, 
    name,
    quantity,
    currentFiles,
    templativeRootDirectoryPath,
    onSaveChanges,
    componentType,
    componentTypesCustomInfo,
    componentTypesStockInfo,
    isDisabled
}) => {
    const [fileOptions, setFileOptions] = useState({
        COMPONENT_GAMEDATA: [],
        PIECE_GAMEDATA: [],
        ARTDATA: []
    });
    
    const [selectedFiles, setSelectedFiles] = useState({
        componentGamedataFilename: '',
        piecesGamedataFilename: '',
        artdataFrontFilename: '',
        artdataBackFilename: '',
        artdataDieFaceFilename: ''
    });
    
    const [selectedType, setSelectedType] = useState('');
    const [selectedDisabled, setSelectedDisabled] = useState(false);
    const [nameField, setNameField] = useState(name || '');
    const [quantityField, setQuantityField] = useState(quantity);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(
                    templativeRootDirectoryPath, 
                    "game-compose.json"
                );
                
                // Load component gamedata files
                const componentPath = path.join(templativeRootDirectoryPath, gameCompose["componentGamedataDirectory"]);
                const componentFiles = await fs.readdir(componentPath);
                const componentNames = componentFiles
                    .filter(file => path.extname(file) === '.json')
                    .map(file => path.parse(file).name);
                
                // Load pieces gamedata files
                const piecesPath = path.join(templativeRootDirectoryPath, gameCompose["piecesGamedataDirectory"]);
                const pieceFiles = await fs.readdir(piecesPath);
                const pieceNames = pieceFiles
                    .filter(file => path.extname(file) === '.json')
                    .map(file => path.parse(file).name);
                
                // Load artdata files
                const artdataPath = path.join(templativeRootDirectoryPath, gameCompose["artdataDirectory"]);
                const artdataFiles = await fs.readdir(artdataPath);
                const artdataNames = artdataFiles
                    .filter(file => path.extname(file) === '.json')
                    .map(file => path.parse(file).name);
                
                setFileOptions({
                    COMPONENT_GAMEDATA: componentNames,
                    PIECE_GAMEDATA: pieceNames,
                    ARTDATA: artdataNames
                });
                
                // Initialize selected files with current values
                setSelectedFiles({
                    componentGamedataFilename: currentFiles.componentGamedataFilename || '',
                    piecesGamedataFilename: currentFiles.piecesGamedataFilename || '',
                    artdataFrontFilename: currentFiles.artdataFrontFilename || '',
                    artdataBackFilename: currentFiles.artdataBackFilename || '',
                    artdataDieFaceFilename: currentFiles.artdataDieFaceFilename || ''
                });
                
                setSelectedType(componentType || '');
                setSelectedDisabled(isDisabled || false);
                setHasChanges(false);
            } catch (error) {
                console.error('Error loading files:', error);
            }
        };

        if (show) {
            setNameField(name || '');
            loadFiles();
        }
    }, [show, templativeRootDirectoryPath, currentFiles, componentType, isDisabled, name]);

    const handleFileSelect = (key, value) => {
        setSelectedFiles(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
    };

    const handleTypeChange = (value) => {
        setSelectedType(value);
        setHasChanges(true);
    };

    const handleDisabledChange = (value) => {
        setSelectedDisabled(value);
        setHasChanges(true);
    };
    
    const handleQuantityChange = (value) => {
        setQuantityField(value);
        setHasChanges(true);
    };
    const handleNameChange = (value) => {
        setNameField(value);
        setHasChanges(true);
    };

    const handleSave = () => {
        onSaveChanges(selectedFiles, selectedType, selectedDisabled, nameField, quantityField);
        onHide();
    };

    // Get all component types
    const allComponentTypes = [
        ...Object.keys(componentTypesCustomInfo || {}),
        ...Object.keys(componentTypesStockInfo || {})
    ];


    if (!show) return null;
    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-content modal-content-large" onClick={e => e.stopPropagation()}>
                <div className="modal-header unified-modal-header">
                    <h3 className="modal-title">{name} Composition Settings</h3>
                    <button className="close-button" onClick={onHide}>×</button>
                </div>
                <div className="modal-body">
                    <div className="input-group input-group-sm" data-bs-theme="dark">
                        <span className="input-group-text soft-label">Name</span>
                        <input type="text" className="form-control no-left-border no-right-border" placeholder="Name" aria-label="Search" value={nameField} onChange={async (e) => await handleNameChange(e.target.value)} />
                        <span className="input-group-text soft-label">Quantity</span>
                        <input type="number" className="form-control no-left-border quantity-input" placeholder={0} aria-label="Search" value={quantityField} onChange={async (e) => await handleQuantityChange(e.target.value)} />                    
                    </div>
                        
                    <div className="disabled-toggle-container">
                        <label className="disabled-toggle-label">
                            <input 
                                type="checkbox" 
                                checked={selectedDisabled}
                                onChange={(e) => handleDisabledChange(e.target.checked)}
                            />
                            <span className="disabled-toggle-text">Disable {name}.</span>
                        </label>
                    </div>
                    <select 
                        className="file-option"
                        value={selectedType}
                        onChange={(e) => handleTypeChange(e.target.value)}
                    >
                        <option value="">-- Select Component Type --</option>
                        {allComponentTypes.map((type, index) => (
                            <option key={`type-${index}`} value={type}>
                                {addSpaces(type)}
                            </option>
                        ))}
                    </select>
                    

                    <div className="file-group-header component-header">
                        <ComponentIcon className="replacement-modal-icon" alt="Component" />
                        <h4>Component Gamedata</h4>
                    </div>
                    <select 
                        className="file-option"
                        value={selectedFiles.componentGamedataFilename}
                        onChange={(e) => handleFileSelect('componentGamedataFilename', e.target.value)}
                    >
                        <option value="">-- Select Component File --</option>
                        {fileOptions.COMPONENT_GAMEDATA.map((file, index) => (
                            <option key={`component-${index}`} value={file}>
                                {file}
                            </option>
                        ))}
                    </select>
                
                    <div className="file-group-header piece-header">
                        <PieceIcon className="replacement-modal-icon" alt="Piece" />
                        <h4>Piece Gamedata</h4>
                    </div>
                    <select 
                        className="file-option"
                        value={selectedFiles.piecesGamedataFilename}
                        onChange={(e) => handleFileSelect('piecesGamedataFilename', e.target.value)}
                    >
                        <option value="">-- Select Piece File --</option>
                        {fileOptions.PIECE_GAMEDATA.map((file, index) => (
                            <option key={`piece-${index}`} value={file}>
                                {file}
                            </option>
                        ))}
                    </select>
                    
                    {currentFiles.artdataFrontFilename !== null && (
                        <>
                            <div className="file-group-header artdata-header">
                                <ArtdataIcon className="replacement-modal-icon" alt="Artdata" />
                                <h4>Front Art Data</h4>
                            </div>
                            <select 
                                className="file-option"
                                value={selectedFiles.artdataFrontFilename}
                                onChange={(e) => handleFileSelect('artdataFrontFilename', e.target.value)}
                            >
                                <option value="">-- Select Front Art File --</option>
                                {fileOptions.ARTDATA.map((file, index) => (
                                    <option key={`front-${index}`} value={file}>
                                        {file}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    
                    {currentFiles.artdataBackFilename !== null && (
                        <>
                            <div className="file-group-header artdata-header">
                                <ArtdataIcon className="replacement-modal-icon" alt="Artdata" />
                                <h4>Back Art Data</h4>
                            </div>
                            <select 
                                className="file-option"
                                value={selectedFiles.artdataBackFilename}
                                onChange={(e) => handleFileSelect('artdataBackFilename', e.target.value)}
                            >
                                <option value="">-- Select Back Art File --</option>
                                {fileOptions.ARTDATA.map((file, index) => (
                                    <option key={`back-${index}`} value={file}>
                                        {file}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    
                    {currentFiles.artdataDieFaceFilename !== null && (
                        <>
                            <div className="file-group-header artdata-header">
                                <ArtdataIcon className="replacement-modal-icon" alt="Artdata" />
                                <h4>Die Face Art Data</h4>
                            </div>
                            <select 
                                className="file-option"
                                value={selectedFiles.artdataDieFaceFilename}
                                onChange={(e) => handleFileSelect('artdataDieFaceFilename', e.target.value)}
                            >
                                <option value="">-- Select Die Face Art File --</option>
                                {fileOptions.ARTDATA.map((file, index) => (
                                    <option key={`dieface-${index}`} value={file}>
                                        {file}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    
                    <div className="modal-footer">
                        <button 
                            className="cancel-button" 
                            onClick={onHide}
                        >
                            Cancel
                        </button>
                        <button 
                            className="save-button" 
                            onClick={handleSave}
                            disabled={!hasChanges}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompositionSettingsModal;
