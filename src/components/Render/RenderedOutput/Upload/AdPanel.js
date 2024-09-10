import React from "react";
import "./AdPanel.css"
import LabelledImage from "./LabelledImage";

const {shell} = require('electron')
const path = require("path")

export default class AdPanel extends React.Component {  
    openFolder = ()=> {
        shell.openPath(path.join(this.props.templativeRootDirectoryPath, "gamecrafter"));
    } 
    render() {
        return <div className="gamecrafter-ads-container">            
            <div className="ads-header">
                <button onClick={()=> this.openFolder()} className="btn btn-dark ads-folder-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
                    </svg>
                </button>
                <p className="ad-explanation">Game Crafter Store Images</p>
            </div>
            <div className="ads-images">
                
                <LabelledImage path={`${this.props.templativeRootDirectoryPath}/gamecrafter/advertisement.png`} name="GameCrafter Store Advertisement"/>
                <LabelledImage path={`${this.props.templativeRootDirectoryPath}/gamecrafter/backdrop.png`} name="GameCrafter Store Backdrop"/>
                <LabelledImage path={`${this.props.templativeRootDirectoryPath}/gamecrafter/logo.png`} name="GameCrafter Store Logo"/>
                <LabelledImage path={`${this.props.templativeRootDirectoryPath}/gamecrafter/actionShot.png`} name="GameCrafter Store Action Shot"/>
            </div>

        </div>
    }
}