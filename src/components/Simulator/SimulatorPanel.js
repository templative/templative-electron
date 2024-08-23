import React from "react";
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import "./SimulatorPanel.css"
import SelectDirectoryInDirectory from "../SelectDirectory/SelectDirectoryInDirectory";
import { channels } from "../../shared/constants";
import {writeLastUseTableTopSimulatorDirectory, getLastUsedTableTopSimulatorDirectory} from "../../settings/SettingsManager"
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativeAccessTools from "../TemplativeAccessTools";
import SimulatorOutputExplorer from "./SimulatorOutputExplorer";
import TemplativeClient from "../../TemplativeClient";
import TemplativePurchaseButton from "../TemplativePurchaseButton";
import SimulatorSaveChoices from "./SimulatorSaveChoices";
const axios = require("axios");
const path = require('path');

const { ipcRenderer } = require('electron');

export default class SimulatorPanel extends React.Component {   
    state={
        selectedOutputDirectory: undefined,
        selectedSaveFilepath: undefined,
        isCreating: false,
        simulatorDirectory: "",
        doesUserOwnTemplative: false,
    }
    checkIfOwnsTemplative = async () => {
        var ownsTemplative = await TemplativeClient.doesUserOwnTemplative(this.props.email, this.props.token)
        this.setState({ doesUserOwnTemplative: ownsTemplative})
    }
    componentDidMount = async () => {
        await this.checkIfOwnsTemplative()
        trackEvent("view_simulatorPanel")

        ipcRenderer.on(channels.GIVE_PLAYGROUND_FOLDER, (event, simulatorFolder) => {
            writeLastUseTableTopSimulatorDirectory(simulatorFolder)
            console.log(simulatorFolder)
            this.setState({simulatorDirectory: simulatorFolder})
        });
        var lastUsedTableTopSimulatorDirectory = getLastUsedTableTopSimulatorDirectory()
        if (lastUsedTableTopSimulatorDirectory !== undefined)
            this.setState({simulatorDirectory: lastUsedTableTopSimulatorDirectory})
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_PLAYGROUND_FOLDER);
    }
    selectDirectoryAsync = async (directory) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(this.props.templativeRootDirectoryPath, gameCompose["outputDirectory"], directory)
        this.setState({selectedOutputDirectory:outputDirectory})
    }
    selectSaveAsync = async (filepath) => {
        console.log(filepath)
        this.setState({selectedSaveFilepath:filepath})
    }
    openSimulatorDirectoryPicker = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND)
    }
    createSimulator = async () => {
        trackEvent("simulator_create")
        var data = { 
            outputDirectorypath: this.state.selectedOutputDirectory,
            tabletopSimulatorDocumentsDirectorypath: this.state.simulatorDirectory
        }
        try {
            this.setState({isCreating: true})
            await axios.post(`http://localhost:8080/simulator`, data)
            this.setState({isCreating: false})
        }
        catch(e) {
            console.log(e)
        }
    }
    render() {
        var buttonMessage = "Select an Output Directory"
        if (this.state.isCreating) {
            buttonMessage = "Creating Simulator Save..."
        }
        else if (this.state.selectedOutputDirectory !== undefined) {
            buttonMessage = "Create Simulator Save"
        }
        var isCreateDisabled = this.state.isCreating || this.state.selectedOutputDirectory === undefined
        
        return <div className='mainBody'>
            <div className="row simulator-row">
                <div className="col-4 simulator-controls" align="center">
                    
                    <div className="create-button-container">
                        <div className="input-group input-group-sm simulator-directory-header" data-bs-theme="dark">
                            <span className="input-group-text tts-directory-label" id="basic-addon3">TTS Package Directory</span>
                        </div>
                        <div className="input-group input-group-sm simulator-package-controls" data-bs-theme="dark">
                            <input className="form-control text-right cornered-top" value={this.state.simulatorDirectory} readOnly placeholder="TTS Package Directory" aria-label="Tabletop Simulator Package Directory"/>
                            <button onClick={async () => await this.openSimulatorDirectoryPicker()} className="btn btn-outline-secondary lookup-simulator-button cornered-top" type="button" id="button-addon1">
                            <svg xmlns="htts://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path 
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                                />
                            </svg>
                            </button>
                        </div>
                    </div>
                    {this.state.simulatorDirectory && 
                        <SimulatorSaveChoices baseFilepath={path.join(this.state.simulatorDirectory,"Saves")} 
                            selectSaveAsyncCallback={this.selectSaveAsync} 
                            selectedSaveFilepath={this.state.selectedSaveFilepath}
                        />
                    }
                    <RenderOutputOptions 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                        selectedDirectory={this.state.selectedOutputDirectory} 
                        selectDirectoryAsyncCallback={this.selectDirectoryAsync}
                    />
                    {this.state.doesUserOwnTemplative != "" ? 
                        <button disabled={isCreateDisabled} type="button" className="btn btn-outline-secondary create-simulator-button" onClick={() => this.createSimulator()}>{buttonMessage}</button>
                        :
                        <TemplativePurchaseButton action="Creating Tabletop Simulator Packages"/>
                    }
                    
                </div>
                <div className="col">
                    {(this.state.simulatorDirectory !== undefined && this.state.selectedSaveFilepath !== undefined) &&
                        <SimulatorOutputExplorer saveFileAsyncCallback={async ()=> {}} selectedSaveFilepath={this.state.selectedSaveFilepath}/>
                    }
                </div>
            </div>
        </div>
        
    }
}