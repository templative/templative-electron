import React from "react";
import "./SimulatorOutputExplorer.css"
import EditableViewerJson from "../../../Edit/Viewers/EditableViewerJson";
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

    renderObjectState = (objectState) => {
        if (objectState["Name"] === "Card" || objectState["Name"] === "HandTrigger") {
            return null;
        }

        const customDeckKey = objectState["CustomDeck"] ? Object.keys(objectState["CustomDeck"])[0] : null;
        const customDeck = customDeckKey ? objectState["CustomDeck"][customDeckKey] : null;
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