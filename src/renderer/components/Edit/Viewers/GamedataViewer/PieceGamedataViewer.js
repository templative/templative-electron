import React from "react";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import path from 'path';

import Piece from "./Piece";
import fsPromises from 'fs/promises';
import EditableViewerJson from "../EditableViewerJson";
import PieceTable from "./PieceTable";
import TransposedTable from "./TransposedTable";
import ImportCsvModal from './ImportCsvModal';

import TableIcon from "./PiecesTypeIcons/TableIcon.svg?react";
import JsonListIcon from "./PiecesTypeIcons/JsonListIcon.svg?react";
import TableRotatedIcon from "./PiecesTypeIcons/TableRotatedIcon.svg?react";
import KeyIcon from "./PiecesTypeIcons/KeyIcon.svg?react";
import DownloadIcon from "./PiecesTypeIcons/DownloadIcon.svg?react";
import PlusIcon from "./PiecesTypeIcons/PlusIcon.svg?react";
import SyncIcon from "./PiecesTypeIcons/SyncIcon.svg?react";
import BreakSyncIcon from "./PiecesTypeIcons/BreakSyncIcon.svg?react";

import "./GamedataViewer.css"

export default class PieceGamedataViewer extends EditableViewerJson {   
    state = {
        trackedKey: undefined,
        currentUpdateValue: undefined,
        lockedKey: undefined,
        viewMode: 'list',
        isImportModalOpen: false
    }

    getFilePath = (props) => {
        return props.filepath
    }
    
    addBlankKeyValuePair = () => {
        const newContents = [...this.state.content]
        newContents.forEach((element, index) => {
            newContents[index] = { ...newContents[index], "": "" }
        });
        
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }
    
    updateValue = (index, key, newValue) => {
        const newContents = [...this.state.content]
        newContents[index] = { ...newContents[index], [key]: newValue }
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }
    removeKeyValuePairFromAllPieces = (key) => {
        const newContents = this.state.content.map(element => {
            const newElement = { ...element }
            delete newElement[key]
            return newElement
        })
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }
    trackChangedKey = (key, value) => {
        this.setState({
            trackedKey: key,
            currentUpdateValue: value
        })
    }
    updateKey = (oldKey, newKey) => {
        const newContents = [...this.state.content]
        newContents.forEach((element, index) => {
            newContents[index] = { ...newContents[index] }
            newContents[index][newKey] = newContents[index][oldKey] !== undefined ? newContents[index][oldKey] : ""
            delete newContents[index][oldKey]
        });
        
        this.setState({
            content: newContents,
            trackedKey: undefined,
            currentUpdateValue: undefined
        }, async () => this.autosave())
    }

    freeTrackedChangedKey = () => {
        if (this.state.trackedKey === undefined || this.state.currentUpdateValue === undefined) {
            return
        }
        if (this.state.lockedKey !== undefined && this.state.trackedKey === this.state.lockedKey) {
            this.setState({lockedKey: this.state.currentUpdateValue})
        }
        this.updateKey(this.state.trackedKey, this.state.currentUpdateValue)
    }

    addPiece = () => {
        const newPiece = { }

        if (this.state.content.length > 0) {
            Object.keys(this.state.content[0]).forEach((key) => {
                newPiece[key] = key === "quantity" ? 1 : ""
            });
        }
        const newContents = [...this.state.content]
        newContents.unshift(newPiece)
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }
    duplicatePieceByIndex = (index) => {
        const duplicate = { ...this.state.content[index] }
        let hasName;
        do {
            duplicate["name"] = duplicate["name"] + "_copy"
            hasName = false;
            for (let index = 0; index < this.state.content.length; index++) {
                const element = this.state.content[index];
                if (duplicate["name"] === element["name"]) {
                    hasName = true
                    break;
                }
            }
        } while (hasName);

        const newContents = [...this.state.content]
        newContents.unshift(duplicate)
        this.setState({
            content: newContents
        }, async () => this.autosave())
    }

    deletePiece = (index) => {
        const newContents = [...this.state.content]
        newContents.splice(index,1)
        this.setState({
            content: newContents
        })
    }
    toggleLock = (key) => {
        if (this.state.lockedKey !== undefined) {
            this.setState({lockedKey: undefined})
            return
        }
        this.setState({lockedKey: key})
    }

    toggleViewMode = (mode) => {
        this.setState({
            viewMode: mode
        });
    }

    syncWithSheet = async (syncUrl) => {
        await this.handleFileDropAsync(syncUrl)
    }
    
    loadCsvFromSheet = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data from Google Sheets');
        }

        return { fileContents: await response.text(), fileExtension: ".csv" }
        
    }
    
    loadFileContentsFromPath = async (filepath) => {
        if (filepath.includes("google.com")) {
            return await this.loadCsvFromSheet(filepath)
        }
        
        const fileExtension = path.extname(filepath).toLowerCase();
        const encoding = fileExtension === '.xlsx' ? null : 'utf8';
        const fileContents = await fsPromises.readFile(filepath, encoding);
        return { fileContents, fileExtension }
    }

    removeSyncUrl = async () => {
        await this.props.addGameComposeSyncUrlAsync(path.basename(this.props.filepath, ".json"), undefined)
    }
    
    handleFileDropAsync = async (newSyncPath) => {
        console.log('File dropped:', newSyncPath);
        
        const filename = path.basename(this.props.filepath, ".json")
        const currentSyncPath = this.props.gameCompose["syncUrls"][filename];
        if (newSyncPath.includes("google.com") && currentSyncPath !== newSyncPath) {
            await this.props.addGameComposeSyncUrlAsync(filename, newSyncPath)
        }
        
        var fileContents, fileExtension;
        try {
            ({fileContents, fileExtension} = await this.loadFileContentsFromPath(newSyncPath))
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error('File does not exist:', newSyncPath);
                window.confirm("File does not exist: " + newSyncPath);
                return;
            }
            console.error('Error loading file:', error);
            window.confirm("Error loading file: " + error.message);
            return;
        }
        let data = [];
        
        if (fileExtension === '.csv') {
            // Parse CSV file
            console.log("csv");
            const parsedData = Papa.parse(fileContents, { header: true, skipEmptyLines: true });
            data = parsedData.data;
        } else if (fileExtension === '.xlsx') {
            // Parse XLSX file
            console.log("xlsx");
            const workbook = XLSX.read(fileContents, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        } else {
            console.error('Unsupported file type:', fileExtension);
            return;
        }

        // Ensure every entry has every column
        const allKeys = new Set(data.flatMap(Object.keys));
        data = data.map(entry => {
            const completeEntry = {};
            allKeys.forEach(key => {
                completeEntry[key] = entry[key] || "";
            });
            return completeEntry;
        });

        this.setState({ 
            content: data,
            isImportModalOpen: false 
        }, async () => this.autosave());
    };

    render() {
        if (this.state.failedToLoad) {
            return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.state.filepath} errorMessage={this.state.errorMessage} />
        }
        var rows = []
        if (this.state.hasLoaded && this.state.content !== undefined) {
            if (this.state.viewMode === 'list') {
                
                // If this.state.content is not an array, return []
                if (!Array.isArray(this.state.content)) {
                    return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.state.filepath} errorMessage="It is not a valid Piece Content file." />;
                }
                
                rows = this.state.content.map((piece, index) => {
                    return <Piece 
                        key={index} 
                        currentUpdateValue={this.state.currentUpdateValue}
                        gamedataFile={this.state.content} 
                        trackedKey={this.state.trackedKey} 
                        index={index} 
                        piece={piece}
                        toggleLockCallback={this.toggleLock}
                        lockedKey={this.state.lockedKey}
                        deletePieceCallback={()=>this.deletePiece(index)}
                        duplicatePieceByIndexCallback={()=>this.duplicatePieceByIndex(index)}
                        trackChangedKeyCallback={this.trackChangedKey}
                        updateValueCallback={this.updateValue}
                        removeKeyValuePairFromAllPiecesCallback={this.removeKeyValuePairFromAllPieces}
                        freeTrackedChangedKeyCallback={this.freeTrackedChangedKey}
                        isPreviewEnabled={this.props.isPreviewEnabled}
                        showPreviewCallback={this.props.showPreviewCallback}
                        componentName={this.props.componentName}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    />
                })
            }
        }
        const filename = path.basename(this.props.filepath, ".json")
        const syncUrl = this.props.gameCompose["syncUrls"][filename];
        const hasSyncUrl = syncUrl !== undefined;
        return <div className="pieces-viewer">
            <div className="pieces-controls-input-group">
                <div>
                    <button 
                        onClick={() => this.addPiece()} 
                        disabled={!this.state.hasLoaded}
                        className="btn btn-outline-primary add-field-button" 
                        type="button"
                    >
                        <PlusIcon className="add-field-icon"/>
                        Create a new Piece
                    </button>
                    <button 
                        onClick={() => this.addBlankKeyValuePair()} 
                        disabled={!this.state.hasLoaded || this.state.lockedKey !== undefined}
                        className="btn btn-outline-primary add-field-button" 
                        type="button"
                    >
                        <KeyIcon className="add-field-icon"/>
                        Add a Field
                    </button>
                </div>
                <div>
                    <button 
                        onClick={() => this.setState({ isImportModalOpen: true })} 
                        disabled={!this.state.hasLoaded || this.state.lockedKey !== undefined}
                        className="btn btn-outline-primary add-field-button" 
                        type="button"
                    >
                        <DownloadIcon className="add-field-icon"/>
                        Import CSV / Excel / Sheets
                    </button>
                    {hasSyncUrl && (
                        <>
                        <button 
                            onClick={() => this.syncWithSheet(syncUrl)}
                            className="btn btn-outline-primary add-field-button" 
                            type="button"
                        >
                            <SyncIcon className="add-field-icon"/>
                            Sync
                        </button>
                        <button 
                            onClick={() => this.removeSyncUrl()} 
                            className="btn btn-outline-primary add-field-button" 
                            type="button"
                        >
                            <BreakSyncIcon className="add-field-icon"/>
                            Remove Sync
                        </button>
                        </>
                    )}
                </div>
            </div>
            
            {/* <div className="view-mode-toggle">
                <button 
                    onClick={() => this.toggleViewMode('list')} 
                    className={`btn btn-outline-primary btn-sm view-mode-toggle-button ${this.state.viewMode === 'list' ? 'selected' : ''}`}
                >
                    <JsonListIcon className="view-mode-icon"/>
                    Json List
                </button>
                <button 
                    onClick={() => this.toggleViewMode('table')} 
                    className={`btn btn-outline-primary btn-sm view-mode-toggle-button ${this.state.viewMode === 'table' ? 'selected' : ''}`}
                >
                    <TableIcon className="view-mode-icon"/>
                    Table
                </button>
                <button 
                    onClick={() => this.toggleViewMode('transposed')} 
                    className={`btn btn-outline-primary btn-sm view-mode-toggle-button ${this.state.viewMode === 'transposed' ? 'selected' : ''}`}
                >
                    <TableRotatedIcon className="view-mode-icon"/>
                    Table Rotated
                </button>
            </div> */}

            <div className="pieces-gamedata-row">
                {this.state.viewMode === 'list' ? (
                    rows
                ) : this.state.viewMode === 'table' ? (
                    <PieceTable 
                        content={this.state.content}
                        updateValue={this.updateValue}
                        deletePiece={this.deletePiece}
                        duplicatePieceByIndex={this.duplicatePieceByIndex}
                    />
                ) : (
                    <TransposedTable 
                        content={this.state.content}
                        updateValue={this.updateValue}
                        deletePiece={this.deletePiece}
                        duplicatePieceByIndex={this.duplicatePieceByIndex}
                    />
                )}
            </div> 
            <ImportCsvModal 
                isOpen={this.state.isImportModalOpen} 
                filenameWeAreOverwriting={path.relative(this.props.templativeRootDirectoryPath, this.props.filepath)}
                onClose={() => this.setState({ isImportModalOpen: false })}
                handleFileDropAsync={this.handleFileDropAsync}
            />
        </div> 
    }
}