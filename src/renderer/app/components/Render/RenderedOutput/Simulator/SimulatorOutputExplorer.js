import React from "react";
import "./SimulatorOutputExplorer.css"
import EditableViewerJson from "../../../Edit/Viewers/EditableViewerJson";
import JsonRenderer from "./JsonRenderer";
import FrontBackImages from "./FrontBackImages";
import FrontOnlyImage from "./FrontOnlyImage";
import { ipcRenderer } from "electron";
import { channels } from "../../../../../../shared/constants";

const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class SimulatorOutputExplorer extends EditableViewerJson {   
    getFilePath = (props) => {
        return props.selectedSaveFilepath
    }    
    saveFileAsync = async () => {}
    openSimulatorSaveFile = async () => {
        const saveFilepath = this.props.selectedSaveFilepath;
        if (!saveFilepath) {
            console.error("No save file path selected");
            return;
        }
        ipcRenderer.invoke(channels.TO_SERVER_OPEN_FILEPATH, saveFilepath);
    }
    renderObjectState = (objectState) => {
        if (objectState["Name"] === "Card" || objectState["Name"] === "HandTrigger") {
            return null;
        }

        const customDeckKey = objectState["CustomDeck"] ? Object.keys(objectState["CustomDeck"])[0] : null;
        const customDeck = customDeckKey ? objectState["CustomDeck"][customDeckKey] : null;
        const customImage = objectState["CustomImage"];
        const containedObjects = objectState["ContainedObjects"] || [];

        return <div className="object-state" key={objectState["GUID"]}>
            <p className="object-state-header">
                {objectState["Nickname"]} · {objectState["Name"]} 
                <span className="object-state-guid"> {objectState["GUID"]}</span>
            </p>     
            {customDeck && 
                <FrontBackImages 
                    frontImageUrl={customDeck["FaceURL"]} 
                    backImageUrl={customDeck["BackURL"]}
                />
            }
            {customImage && objectState["Name"] === "Custom_Dice" &&
                <FrontOnlyImage 
                    imageUrl={customImage["ImageURL"]} 
                />
            }
            {containedObjects.length > 0 && 
                <div className="contained-objects">
                    {containedObjects.map(this.renderObjectState)}
                </div>
            }
        </div>
    }

    render() {  
        return <div className="simulator-output-explorer">
            {this.state.hasLoaded && 
            <React.Fragment>
                <div className="simulator-save-file-path-container">
                    <span className="simulator-save-file-path">{path.basename(this.props.selectedSaveFilepath)}</span>
                    <button className="btn btn-primary" onClick={() => this.openSimulatorSaveFile()}>Open Save File</button>
                </div>
                <div className="object-states">
                    {this.state.content["ObjectStates"].map(this.renderObjectState)}         
                </div>
                {/* <div className="simulator-json-content">
                    <JsonRenderer json={this.state.content}/>
                </div> */}
                
            </React.Fragment>
            }
            
        </div>
    }
}