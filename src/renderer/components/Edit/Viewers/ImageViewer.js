import React from "react";
const fs = require('fs');
import FileLoadFailure from "./FileLoadFailure";
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

        return (
            <div className="row image-viewer" key={this.state.remountKey}>
                <div className="col image-viewer-col" align="center">
                    <div className="image-viewer-controls">
                        <button className="rotate-button" onClick={this.rotateImage}>
                            ⟲
                        </button>
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
