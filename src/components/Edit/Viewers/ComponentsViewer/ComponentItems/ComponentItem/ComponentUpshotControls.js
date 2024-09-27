import React from "react";

import artdataIcon from "../../../../Icons/artDataIcon.svg"
import componentIcon from "../../../../Icons/componentIcon.svg"
import pieceIcon from "../../../../Icons/pieceIcon.svg"
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
            {this.props.isHovering && 
                
                <svg onClick={this.props.toggleIsEditingCallback} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square component-edit-toggle" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
              </svg>
            }                
            <p className="component-name">{this.props.componentName} <span className="component-type">- {this.addSpaces(this.props.componentType)}</span></p>    
            <div className="goto-buttons">
                {this.props.pieceGamedataExists && 
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
                }
            </div>
        </React.Fragment>
    }
}