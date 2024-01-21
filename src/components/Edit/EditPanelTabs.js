import React from "react";

import "./EditPanel.css"
import "./EditPanelTabs.css"


export default class EditPanelTabs extends React.Component {       
    render() {
        return <div className="nav nav-tabs">
            <li className="nav-item" onClick={this.openStudioGamedata}>
                <a className="nav-link">Studio</a>
            </li>
            <li className="nav-item" onClick={this.openGameGamedata}>
                <a className="nav-link">Game</a>
            </li>
            <li className="nav-item" onClick={this.openComponents}>
                <a className="nav-link">Components</a>
            </li>
            <li className="nav-item" onClick={this.openRules}>
                <a className="nav-link">Rules</a>
            </li>
            <li className="nav-item">
                <a className="nav-link active">{this.state.filename}</a>
            </li>
            <li className="nav-item">
                <a className="nav-link">pay no attention</a>
            </li>
            <li className="nav-item">
                <a className="nav-link">to the man</a>
            </li>
            <li className="nav-item">
                <a className="nav-link">behind the curtain</a>
            </li>
        </div>
    }
}