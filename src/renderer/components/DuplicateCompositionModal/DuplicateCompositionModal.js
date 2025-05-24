import React, { useState, useEffect } from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import TemplativeAccessTools from '../TemplativeAccessTools';
import './CompositionSettingsModal.css';
import { addSpaces } from "../../utility/addSpaces";
import ArtdataIcon from "./Icons/artDataIcon.svg?react";
import ComponentIcon from "./Icons/componentIcon.svg?react"
import PieceIcon from "./Icons/pieceIcon.svg?react"

const DuplicateCompositionModal = ({ 
    templativeRootDirectoryPath,
    onHide,
    compositions,
    composition
}) => {
    
    return (
        <div className="modal-overlay modal-overlay-composition-settings" onClick={onHide}>
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
                        <input type="number" className="form-control no-left-border quantity-input" placeholder={0} min={0} aria-label="Search" value={quantityField} onChange={async (e) => await handleQuantityChange(Math.max(0, e.target.value))} />                    
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
                        <h4>Component Content</h4>
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
                        <h4>Piece Content</h4>
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
                                <h4>Front Art Recipe</h4>
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
                                <h4>Back Art Recipe</h4>
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
                                <h4>Die Face Art Recipe</h4>
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
                            onClick={handleReset}
                            disabled={!hasChanges}
                        >
                            Reset to Original
                        </button>
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
