import React from "react";
import fs from "fs";
import "./ImageViewer.css";

export default class ImageViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remountKey: 0, // A key to trigger re-renders
            timestamp: Date.now(), // Used to bust the browser cache
        };
        this.fileWatcher = null;
    }

    componentDidMount() {
        // Start watching the file for changes
        this.startFileWatcher();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.filepath !== this.props.filepath) {
            // If the file path changes, restart the file watcher
            this.startFileWatcher();
        }
    }

    componentWillUnmount() {
        // Clean up the file watcher when the component is unmounted
        this.stopFileWatcher();
    }

    startFileWatcher() {
        // Stop any existing watcher
        this.stopFileWatcher();

        // Set up a new file watcher
        if (this.props.filepath) {
            this.fileWatcher = fs.watch(this.props.filepath, (eventType, filename) => {
                if (eventType === "change") {
                    // When the file changes, update the remountKey and timestamp to trigger a re-render and bust the cache
                    this.setState({
                        remountKey: this.state.remountKey + 1,
                        timestamp: Date.now(), // Update the timestamp to force cache busting
                    });
                }
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

    render() {
        const { filepath } = this.props;
        const { timestamp } = this.state;

        return (
            <div className="row image-viewer" key={this.state.remountKey}>
                <div className="col" align="center">
                    {/* Add timestamp to force reload */}
                    <img className="stretchedImage" src={`file://${filepath}?t=${timestamp}`} alt=""/>
                </div>
            </div>
        );
    }
}
