import React from "react";
import "./LoadingView.css"
import Logo from "./Edit/noFileIcon.svg?react"

export default class LoadingView extends React.Component { 
    render() {
        return <div className="loading-view" data-bs-theme="dark">
            <Logo className="loading-logo"/>
        </div>        
    }
}