import React from "react";
import { relative, basename } from "path";
import "./FileLoadFailure.css"
import WarningIcon from "../../Toast/error.svg?react"
export default function FileLoadFailure({ templativeRootDirectoryPath, filepath, errorMessage }) {
    
    if (!filepath) {
        console.error("No filepath given to FileLoadFailure.");
        return null;
    }
    if (!templativeRootDirectoryPath) {
        console.error("No templativeRootDirectoryPath given to FileLoadFailure.");
        return null;
    }
    
    const relativeFilepath = relative(templativeRootDirectoryPath, filepath).replace(/\\/g, "/");
    const message = filepath ? `Failed to load ${relativeFilepath}.` : "Failed to load file.";
    return (
        <div className="file-load-failure">
            <div className="file-load-container">
                <WarningIcon className="file-load-failure-warning-icon" />
                <p className="file-load-failure-message">{message}</p>
                {errorMessage && <p className="file-load-failure-error-reason">{errorMessage}</p>}
            </div>
        </div>
    );
}
