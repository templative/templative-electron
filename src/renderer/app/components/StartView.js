import React from "react";
import "./StartView.css"
import logo from "./logo.svg"
export default class StartView extends React.Component {   
    render() {
        return <div className="start-view" data-bs-theme="dark">
            <div className="welcome-modal">
                <img src={logo} className="login-logo"/>
                
                <p>Welcome to Templative</p>
                <div className="d-grid gap-2">
                    <button className="btn btn-primary" onClick={this.props.openCreateTemplativeProjectDirectoryPickerCallback}>Create New Project in Directory</button>
                    <button className="btn btn-primary" onClick={this.props.openTemplativeDirectoryPickerCallback}>Open Existing Directory</button>
                </div>
            </div>
        </div>        
    }
}