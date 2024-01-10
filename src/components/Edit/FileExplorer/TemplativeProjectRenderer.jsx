import React from "react";
import TemplativeFileExplorers from "./TemplativeFileExplorers"
import "./TemplativeProjectRenderer.css"

export default class TemplativeProjectRenderer extends React.Component {   
    render() {
        return <React.Fragment>
            <div className="row main-game-button-row">
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openStudioGamedataCallback()}>Studio</button>
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openGameGamedataCallback()}>Game</button>
                <button className={`btn btn-outline-secondary main-game-button`} onClick={() => this.props.openComponentsCallback()}>Components</button>
            </div>
            
            <TemplativeFileExplorers 
                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                currentFilepath={this.props.currentFilepath}
                updateViewedFileCallback={this.props.updateViewedFileCallback}
                clearViewedFileCallback={this.props.clearViewedFileCallback}
            />
        </React.Fragment>        
    }
}