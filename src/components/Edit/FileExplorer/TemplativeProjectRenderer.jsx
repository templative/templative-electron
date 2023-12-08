import React from "react";
import TemplativeFileExplorers from "./TemplativeFileExplorers"
import "./TemplativeProjectRenderer.css"

export default class TemplativeProjectRenderer extends React.Component {   
    render() {
        return <div className="resources">
            <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary open-components-button" onClick={this.props.openComponentsCallback}>Components</button>
            </div>
            
            <TemplativeFileExplorers 
                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                currentFilepath={this.props.currentFilepath}
                updateViewedFileCallback={this.props.updateViewedFileCallback}
                clearViewedFileCallback={this.props.clearViewedFileCallback}
            />
        </div>        
    }
}