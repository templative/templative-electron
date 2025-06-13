import React from "react";
const fs = require('fs');
const { shell } = require('electron');
import FileLoadFailure from "./FileLoadFailure";
import TutorialQuestionMark from "../../Tutorial/TutorialQuestionMark";
const path = require('path');
import "./ImageViewer.css";

export default class ImageViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remountKey: 0, // A key to trigger re-renders
            timestamp: Date.now(), // Used to bust the browser cache
            rotation: 0, // Add rotation state
            failedToLoad: false,
            errorMessage: null,
        };
        this.fileWatcher = null;
    }

    async componentDidMount() {
        // Start watching the file for changes
        await this.startFileWatcher();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.filepath !== this.props.filepath) {
            // If the file path changes, restart the file watcher and reset rotation
            this.setState({ rotation: 0 });
            await this.startFileWatcher();
        }
    }

    componentWillUnmount() {
        // Clean up the file watcher when the component is unmounted
        this.stopFileWatcher();
    }

    async startFileWatcher() {
        // Stop any existing watcher
        this.stopFileWatcher();

        // Set up a new file watcher
        if (!this.props.filepath) {
            return
        }
        
        try {
            this.fileWatcher = fs.watch(this.props.filepath, (eventType, filename) => {
                if (eventType !== "change") {
                    return
                }
                this.setState({
                    remountKey: this.state.remountKey + 1,
                    timestamp: Date.now(), // Update the timestamp to force cache busting
                });
            });
        }
        catch (error) {
            if (error.code === "ENOENT") {
                this.setState({
                    failedToLoad: true,
                    errorMessage: "File not found.",
                });
                return;
            }
            this.setState({
                failedToLoad: true,
                errorMessage: null,
            });
            
        }        
    }

    openImageFolder = () => {
        const folderPath = path.dirname(this.props.filepath);
        shell.openPath(folderPath);
    }

    openImageInDefaultApp = () => {
        const imagePath = this.props.filepath;
        shell.openPath(imagePath);
    }
    
    stopFileWatcher() {
        // Stop watching the file if there's an active watcher
        if (this.fileWatcher) {
            this.fileWatcher.close();
            this.fileWatcher = null;
        }
    }

    rotateImage = () => {
        this.setState(prevState => ({
            rotation: (prevState.rotation + 90) % 360
        }));
    }

    render() {
        const { filepath } = this.props;
        const { timestamp, rotation } = this.state;
        
        if (this.state.failedToLoad) {
            return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.props.filepath} errorMessage={this.state.errorMessage} />
        }

        // Calculate if we need to swap dimensions (at 90° or 270°)
        const isVertical = rotation % 180 !== 0;
        
        // Get rotation class based on current rotation
        const getRotationClass = () => {
            const normalizedRotation = rotation % 360;
            switch(normalizedRotation) {
                case 90: return 'rotate-90';
                case 180: return 'rotate-180';
                case 270: return 'rotate-270';
                default: return '';
            }
        };
        const rotateIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
        </svg>
        const openFolderIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z"/>
        </svg>
        const openInDefaultAppIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>

        return (
            <div className="row image-viewer" key={this.state.remountKey}>
                <div className="col image-viewer-col" align="center">
                    <div className="image-viewer-controls">
                        <button className="rotate-button" onClick={this.rotateImage} title="Rotate Image">{rotateIcon}</button>
                        <button className="rotate-button" onClick={this.openImageFolder} title="Open Image Folder">{openFolderIcon}</button>
                        <button className="rotate-button" onClick={this.openImageInDefaultApp} title="Open Image in Default App">{openInDefaultAppIcon}</button>
                        <TutorialQuestionMark tutorialName="Image Viewer" />
                    </div>
                    <div className="image-viewer-container">
                        {isVertical ? (
                            <div className="rotation-wrapper-outer">
                                <div className="rotation-wrapper-inner">
                                    <img 
                                        className={`stretched-image vertical-rotation ${getRotationClass()}`}
                                        src={`file://${filepath}?t=${timestamp}`} 
                                        alt=""
                                        draggable="false"
                                    />
                                </div>
                            </div>
                        ) : (
                            <img 
                                className="stretched-image"
                                src={`file://${filepath}?t=${timestamp}`} 
                                alt=""
                                style={{ transform: `rotate(${rotation}deg)` }}
                                draggable="false"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
