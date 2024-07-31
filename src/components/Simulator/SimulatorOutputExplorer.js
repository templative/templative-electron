import React from "react";
import "./SimulatorOutputExplorer.css"
import EditableViewerJson from "../Edit/Viewers/EditableViewerJson";
import JsonRenderer from "./JsonRenderer";
import FrontBackImages from "./FrontBackImages";

const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class SimulatorOutputExplorer extends EditableViewerJson {   
    getFilePath = (props) => {
        return props.selectedSaveFilepath
    }    
    saveFileAsync = async () => {}
    render() {  
        return <div className="simulator-output-explorer">
            {this.state.hasLoaded && 
            <React.Fragment>
                <div className="simulator-package-header">
                    <p className="simulator-package-name">{this.state.content["SaveName"]}</p>
                </div>
                <div className="object-states">
                    {this.state.content["ObjectStates"].map(objectState => {
                        return <div className="object-state" key={objectState["GUID"]}>
                            <p className="object-state-header">{objectState["Nickname"]} · {objectState["Name"]} <span className="object-state-guid">{objectState["GUID"]}</span></p>     
                            <FrontBackImages frontImageUrl={objectState["CustomDeck"][2]["FaceURL"]} backImageUrl={objectState["CustomDeck"][2]["BackURL"]}/>
                        </div>
                    })}         
                </div>
                <div className="simulator-json-content">
                    <JsonRenderer json={this.state.content}/>
                </div>
                
            </React.Fragment>
            }
            
        </div>
    }
}