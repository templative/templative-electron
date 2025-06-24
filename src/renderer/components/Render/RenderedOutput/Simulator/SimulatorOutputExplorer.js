import React from "react";
import "./SimulatorOutputExplorer.css"
import EditableViewerJson from "../../../Edit/Viewers/EditableViewerJson";
import JsonRenderer from "./JsonRenderer";
import FrontBackImages from "./FrontBackImages";
import FrontOnlyImage from "./FrontOnlyImage";
import { ipcRenderer } from "electron";
import { channels } from "../../../../../shared/constants";
import SimulatorStockComponent from "./SimulatorStockComponent";
import SimulatorStockComponentBag from "./SimulatorStockComponentBag";
import TutorialQuestionMark from "../../../Tutorial/TutorialQuestionMark";
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
        let content = null;
        var isLeaf = true;
        if (customDeck) {
            content = (
                <FrontBackImages 
                    frontImageUrl={customDeck["FaceURL"]} 
                    backImageUrl={customDeck["BackURL"]}
                />
            );
        } else if (customImage && objectState["Name"] === "Custom_Dice") {
            content = (
                <FrontOnlyImage 
                    imageUrl={customImage["ImageURL"]} 
                />
            );
        } else if (objectState["Name"] === "Bag" && objectState["Nickname"] !== "ComponentLibrary") {
            content = (
                <SimulatorStockComponentBag 
                    quantity={containedObjects.length} 
                    name={objectState["Nickname"]}
                    type={objectState["TemplativeType"]}
                />
            );
        } else if (objectState["TemplativeType"] && objectState["TemplativeType"].startsWith("STOCK_")) {
            content = (
                <SimulatorStockComponent 
                    type={objectState["TemplativeType"]}
                />
            );
        } else if (containedObjects.length > 0) {
            isLeaf = false;
            content = (
                <div className="contained-objects">
                    {containedObjects.map(this.renderObjectState)}
                </div>
            );
        }
        return <div className={`object-state ${isLeaf ? "leaf" : ""}`} key={objectState["GUID"]}>
            <p className="object-state-header">
                {objectState["Nickname"]} · {objectState["Name"]} 
                <span className="object-state-guid"> {objectState["GUID"]}</span>
            </p>     
            {content}
        </div>
    }

    render() {  
        return <div className="simulator-output-explorer">
            {this.state.hasLoaded && 
            <React.Fragment>
                <div className="simulator-save-file-path-container">
                    <div className="simulator-save-file-path-container-left">
                        <span className="simulator-save-file-path">{path.basename(this.props.selectedSaveFilepath)}</span>
                    </div>
                    <div className="simulator-save-file-path-container-right">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => this.openSimulatorSaveFile()}>Open Save File</button>
                        <TutorialQuestionMark tutorialName="Export to Tabletop Simulator" />
                    </div>
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