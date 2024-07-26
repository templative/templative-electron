import React from "react";
import "./SimulatorOutputExplorer.css"
import EditableViewerJson from "../Edit/Viewers/EditableViewerJson";

const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class SimulatorOutputExplorer extends EditableViewerJson {   
    getFilePath = (props) => {
        return props.selectedSaveFilepath
    }    
    saveFileAsync = async () => {}
    render() {  
        return <React.Fragment>
            {this.state.hasLoaded && 
            <React.Fragment>
                <div className="simulator-package-header">
                    <p className="simulator-package-name">{this.state.content["SaveName"]}</p>
                </div>
                <div className="object-states">
                    {this.state.content["ObjectStates"].map(objectState => {
                        return <div className="object-state" key={objectState["GUID"]}>
                            <p className="object-state-header">{objectState["Nickname"]} · {objectState["Name"]} <span className="object-state-guid">{objectState["GUID"]}</span></p>     
                            <img className="object-state-image" src={objectState["CustomDeck"][1]["FaceURL"]}/>
                            <img className="object-state-image" src={objectState["CustomDeck"][1]["BackURL"]}/>
                        </div>
                    })}        
                </div>
            </React.Fragment>
            }
            
        </React.Fragment>
    }
}