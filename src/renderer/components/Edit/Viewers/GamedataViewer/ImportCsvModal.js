import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import './ImportCsvModal.css';
import path from 'path';
import { channels } from '../../../../../shared/constants';

const ImportCsvModal = ({ filenameWeAreOverwriting, isOpen, onClose, handleFileDropAsync }) => {
    if (!isOpen) return null;

    const [isDragging, setIsDragging] = useState(false);
    const [selectedFilePath, setSelectedFilePath] = useState(null);
    const [googleSheetUrl, setGoogleSheetUrl] = useState('');

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
    
    // Url for entire sheet is https://docs.google.com/spreadsheets/d/1x3uniNmn1bsay_q94PQq0dIwbNfD9RbGUOVcDfolaNY/edit?gid=373228906#gid=373228906
    // Url for share link is https://docs.google.com/spreadsheets/d/1x3uniNmn1bsay_q94PQq0dIwbNfD9RbGUOVcDfolaNY/pub?output=csv
    // https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1x3uniNmn1bsay_q94PQq0dIwbNfD9RbGUOVcDfolaNY&exportFormat=csv
    const confirmImportFromGoogleSheet = async () => {
        const isValid = googleSheetUrl.startsWith('https://docs.google.com/spreadsheets/d/') || googleSheetUrl.startsWith('https://docs.google.com/spreadsheets/d/')
        if (!isValid) {
            alert('Please enter a valid Google Sheets URL. For example: https://docs.google.com/spreadsheets/d/.../edit#gid=...')
            return
        }
        if (window.confirm("Are you sure you want to import this file? This will overwrite everything in " + filenameWeAreOverwriting + "!")) {
            const documentId = googleSheetUrl.split('/d/')[1].split('/')[0];
            await handleFileDropAsync(`https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=${documentId}&exportFormat=csv`);
        }
    }
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2 className="import-modal-header">Import Pieces Content</h2>
                <p className="import-modal-description">Connect a public Google Sheet to automatically sync your data or import a local file. <span className="import-warning">This will overwrite everything in {filenameWeAreOverwriting}!</span></p>
                
                <div className="input-group">
                    <span className="input-group-text soft-label">Google Sheets Url</span>
                    <input type="text" className="form-control no-left-border google-sheet-url-input" placeholder="https://docs.google.com/spreadsheets/d/1234567890/edit#gid=0" value={googleSheetUrl} onChange={(e) => setGoogleSheetUrl(e.target.value)} />
                    <button disabled={googleSheetUrl === ''} className="btn btn-primary" onClick={confirmImportFromGoogleSheet}>Setup Sync Url</button>
                </div>
                <div 
                    className={`drop-area ${isDragging ? 'highlight' : ''}`} 
                    onDragOver={(e) => e.preventDefault()} 
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    {isDragging ? "🤤" : "Drop your a .csv or .xlsx file here or click to select."}
                </div>
                <button className="btn btn-primary" onClick={confirmImport} disabled={selectedFilePath === null}>Import{selectedFilePath && ` ${path.basename(selectedFilePath)}`}</button>
            </div>
        </div>
    );
};

export default ImportCsvModal;
