import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import './ImportCsvModal.css';
import path from 'path';
import { channels } from '../../../../../shared/constants';
const ImportCsvModal = ({ filenameWeAreOverwriting, isOpen, onClose, handleFileDropAsync }) => {
    if (!isOpen) return null;

    const [isDragging, setIsDragging] = useState(false);
    const [selectedFilePath, setSelectedFilePath] = useState(null);

    const checkFile = async (filePath) => {
        if (filePath === undefined) {
            return false
        }
        const fileName = filePath.toLowerCase();
        if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx')) {
            alert('Please drop a CSV (.csv) or Excel (.xlsx) file');
            return false
        }
        return true
    }
    
    const handleDragEnter = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
        if (!files.length) {
            return
        }
        if (files.length > 1) {
            alert('Please drop only one file')
            return
        }
        const file = files[0];
        const filePath = file.path;
        if (!await checkFile(filePath)) {
            return
        }
        setSelectedFilePath(filePath);
    };
    
    const handleClick = async () => {
        const filters = [{ name: '.csv or .xlsx', extensions: ['csv', 'xlsx'] }]
        const filePath = await ipcRenderer.invoke(channels.TO_SERVER_OPEN_FILE_DIALOG, filters)
        if (!await checkFile(filePath)) {
            return
        }
        setSelectedFilePath(filePath);
    };
    
    const confirmImport = () => {
        if (selectedFilePath && window.confirm("Are you sure you want to import this file? This will overwrite everything in " + filenameWeAreOverwriting + "!")) {
            handleFileDropAsync(selectedFilePath);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Import and Replace your Pieces Content from a csv or xlsx File</h2>
                <div 
                    className={`drop-area ${isDragging ? 'highlight' : ''}`} 
                    onDragOver={(e) => e.preventDefault()} 
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    {isDragging ? "🤤" : "Drop your a .csv or .xlsx file here or click to select"}
                </div>
                <p className="import-warning">This will overwrite everything in {filenameWeAreOverwriting}!</p>
                <button className="btn btn-primary" onClick={confirmImport} disabled={selectedFilePath === null}>Import{selectedFilePath && ` ${path.basename(selectedFilePath)}`}</button>
            </div>
        </div>
    );
};

export default ImportCsvModal;
