import React from "react";
import "./SimulatorPanel.css"
import { channels } from "../../../../shared/constants";
import {writeLastUseTableTopSimulatorDirectory, getLastUsedTableTopSimulatorDirectory} from "../../../../settings/SettingsManager"
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativePurchaseButton from "../../../TemplativePurchaseButton";
import SimulatorOutputExplorer from "./SimulatorOutputExplorer";
const axios = require("axios");
const path = require('path');
const fs = require('fs');

const { ipcRenderer } = require('electron');

export default class SimulatorPanel extends React.Component {   
    state={
        selectedSaveFilepath: undefined,
        isCreating: false,
        simulatorDirectory: "",
    }
    componentDidMount = async () => {
        trackEvent("view_simulatorPanel")

        ipcRenderer.on(channels.GIVE_SIMULATOR_FOLDER, (event, simulatorFolder) => {
            writeLastUseTableTopSimulatorDirectory(simulatorFolder)
            if (simulatorFolder !== undefined) {
                this.pullExportedInformation(simulatorFolder)
            }
        });
        var lastUsedTableTopSimulatorDirectory = getLastUsedTableTopSimulatorDirectory()
        if (lastUsedTableTopSimulatorDirectory !== undefined) {
            this.pullExportedInformation(lastUsedTableTopSimulatorDirectory)
        }
    }
    pullExportedInformation = (exportedToDirectory) => {
        var selectedSaveFilepath = path.join(exportedToDirectory, "Saves", `${path.basename(this.props.outputFolderPath)}.json`)
        var selectedSaveExists = fs.existsSync(selectedSaveFilepath)
        this.setState({
            simulatorDirectory: exportedToDirectory,
            selectedSaveFilepath: selectedSaveExists ? selectedSaveFilepath : undefined
        })
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.outputFolderPath === prevProps.outputFolderPath) {
            return
        }
        var lastUsedTableTopSimulatorDirectory = getLastUsedTableTopSimulatorDirectory()
        if (lastUsedTableTopSimulatorDirectory !== undefined) {
            this.pullExportedInformation(lastUsedTableTopSimulatorDirectory)
        }
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_SIMULATOR_FOLDER);
    }
    openSimulatorDirectoryPicker = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_SIMULATOR)
    }
    createSimulator = async () => {
        trackEvent("simulator_create")
        var data = { 
            outputDirectorypath: this.props.outputFolderPath,
            tabletopSimulatorDocumentsDirectorypath: this.state.simulatorDirectory
        }
        try {
            this.setState({isCreating: true})
            await axios.post(`http://localhost:8080/simulator`, data)
            var selectedSaveFilepath = path.join(this.state.simulatorDirectory, "Saves", `${path.basename(this.props.outputFolderPath)}.json`)
            var selectedSaveExists = fs.existsSync(selectedSaveFilepath)
            this.setState({isCreating: false, selectedSaveFilepath: selectedSaveExists ? selectedSaveFilepath : undefined})
        }
        catch(e) {
            console.log(e)
        }
    }
    render() {
        var buttonMessage = this.state.isCreating ? "Creating Simulator Save..." : "Create Simulator Save"
        
        var isCreateDisabled = this.state.isCreating || this.props.outputFolderPath === undefined
        var isSaveCreated = this.state.simulatorDirectory !== undefined && this.state.selectedSaveFilepath !== undefined
        return <React.Fragment>
            {isSaveCreated ?
                <SimulatorOutputExplorer saveFileAsyncCallback={async ()=> {}} selectedSaveFilepath={this.state.selectedSaveFilepath}/>
            :
                <div className="vertical-input-group simulator-save-controls">
                    <div className="input-group input-group-sm simulator-directory-header" data-bs-theme="dark">
                        <span className="input-group-text tts-directory-label" id="basic-addon3">Tabletop Simulator Documents Directory</span>
                    </div>
                    <div className="input-group input-group-sm simulator-package-controls" data-bs-theme="dark">
                        <input className="form-control text-right cornered-top" value={this.state.simulatorDirectory} readOnly placeholder="Usually like ~/Documents/My Games/Tabletop Simulator" aria-label="Tabletop Simulator Documents Directory"/>
                        <button onClick={async () => await this.openSimulatorDirectoryPicker()} className="btn btn-outline-secondary lookup-simulator-button cornered-top" type="button" id="button-addon1">
                        <svg xmlns="htts://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path 
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                            />
                        </svg>
                        </button>
                    </div>
                    <button disabled={isCreateDisabled} type="button" className="btn btn-outline-secondary create-simulator-button" onClick={() => this.createSimulator()}>{buttonMessage}</button>
                    {/* {this.props.doesUserOwnTemplative != "" ? 
                    <button disabled={isCreateDisabled} type="button" className="btn btn-outline-secondary create-simulator-button" onClick={() => this.createSimulator()}>{buttonMessage}</button>
                    :
                    <TemplativePurchaseButton action="Creating Tabletop Simulator Packages"/> 
                }*/}
                </div>
            }
        </React.Fragment>
        
    }
}