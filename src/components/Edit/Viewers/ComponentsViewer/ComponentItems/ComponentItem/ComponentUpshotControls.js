import React from "react";

import artdataIcon from "../../../../Icons/artDataIcon.svg"
import componentIcon from "../../../../Icons/componentIcon.svg"
import pieceIcon from "../../../../Icons/pieceIcon.svg"
import unifiedComponentIcon from "../../../../Icons/unifiedComponentIcon.svg"
const path = require("path")

export default class ComponentUpshotControls extends React.Component {  
    addSpaces = (str) => {
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
            .replace(/(\d)([a-zA-Z])/g, '$1 $2') // Add space between numbers and letters
            .replace("D 4", "D4")
            .replace("D 6", "D6")
            .replace("D 8", "D8")
            .replace("D 12", "D12")
            .replace("D 20", "D20")
    }     
    render() {
        return <React.Fragment>             
            <p className={`component-name ${this.props.disabled && "disabled-title"}`}>
                {this.props.disabled && 
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-slash-circle disabled-component-icon" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708"/>
                    </svg>
                }
                {this.props.quantity}x {this.props.componentName} 
                <span className="component-type"> - {this.addSpaces(this.props.componentType)}</span>
                </p>    
            <div className="goto-buttons">
                <div className="component-file-goto-button" onClick={async () => await this.props.openUnifiedComponentViewCallback(this.props.componentName)}>
                    <span><img src={unifiedComponentIcon} className="component-file-goto-img"/> Edit Component</span>
                </div>
                <div className="component-file-goto-button" onClick={this.props.toggleIsEditingCallback}>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-code change-files-icon" viewBox="0 0 16 16">
                            <path d="M6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708zm2.708 0a.5.5 0 1 0-.708.708L10.293 8 8.646 9.646a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708z"/>
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
                        </svg> Change Files</span>
                </div>
                {/* {this.props.pieceGamedataExists && 
                    <div className="component-file-goto-button" onClick={async () => await this.props.goToFileCallback("PIECE_GAMEDATA", this.props.pieceGameDataFilePath)}>
                        <span><img src={pieceIcon} className="component-file-goto-img"/> Piece Gamedata</span>
                    </div>
                }
                {this.props.componentGameDataExists && 
                    <div className="component-file-goto-button" onClick={async () => await this.props.goToFileCallback("COMPONENT_GAMEDATA", this.props.componentGameDataFilePath)}>
                        <span><img src={componentIcon} className="component-file-goto-img"/> Component Gamedata</span>
                    </div>
                }
                {this.props.hasFrontArtdata && 
                    <div className="component-file-goto-button" onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataFrontFilePath)}>
                        <span><img src={artdataIcon} className="component-file-goto-img"/> Front Artdata</span>
                    </div>
                }
                {this.props.hasDieFaceArtdata && 
                    <div className="component-file-goto-button" onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataDieFaceFilePath)}>
                        <span><img src={artdataIcon} className="component-file-goto-img"/> Die Face Artdata</span>
                    </div>
                }
                {this.props.hasBackArtdata && 
                    <div className="component-file-goto-button" onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataBackFilePath)}>
                        <span><img src={artdataIcon} className="component-file-goto-img"/> Back Artdata</span>
                    </div>
                } */}
            </div>
        </React.Fragment>
    }
}