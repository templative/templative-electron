import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import TemplativeFileExplorers from "./TemplativeFileExplorers"
import "./TemplativeProjectRenderer.css"

export default class TemplativeProjectRenderer extends React.Component {   
    state = {
        gameCompose: undefined
    }
    
    componentDidMount() {
        var gameCompose = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "game-compose.json");
        this.setState({gameCompose: gameCompose})
    }

    render() {
        return <div className="resources">
            <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary open-components-button" onClick={this.props.openComponentsCallback}>Components</button>
            </div>
            {this.state.gameCompose !== undefined && 
                <TemplativeFileExplorers 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    gameCompose={this.state.gameCompose}
                    currentFilepath={this.props.currentFilepath}
                    updateViewedFileCallback={this.props.updateViewedFileCallback}
                />
            }
        </div>        
    }
}