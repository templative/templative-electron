import React from "react";
import "./StartView.css"

export default class StartView extends React.Component {   
    render() {
        return <div className="start-view" data-bs-theme="dark">
            <div className="welcome-modal">
                <p>Welcome to Templative</p>
                <div className="d-grid gap-2">
                    <button className="btn btn-outline-warning" onClick={this.props.openCreateTemplativeProjectDirectoryPickerCallback}>Create New Project in Directory</button>
                    <button className="btn btn-outline-warning" onClick={this.props.openTemplativeDirectoryPickerCallback}>Open Existing Directory</button>
                </div>
            </div>
        </div>        
    }
}