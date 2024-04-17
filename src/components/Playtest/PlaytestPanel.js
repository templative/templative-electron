import React from "react";
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import "./PlaytestPanel.css"
import SelectDirectoryInDirectory from "../SelectDirectory/SelectDirectoryInDirectory";
import { channels } from "../../shared/constants";
import {writeLastUseTableTopPlaygroundDirectory, getLastUsedTableTopPlaygroundDirectory} from "../../settings/SettingsManager"
import { trackEvent } from "@aptabase/electron/renderer";
import axios from "axios"
import TemplativeAccessTools from "../TemplativeAccessTools";
const path = require('path');

const { ipcRenderer } = require('electron');

export default class PlaytestPanel extends React.Component {   
    state={
        selectedOutputDirectory: undefined,
        selectedPackageDirectory: undefined,
        isCreating: false,
        playgroundDirectory: ""
    }
    componentDidMount() {
        trackEvent("view_playtestPanel")

        ipcRenderer.on(channels.GIVE_PLAYGROUND_FOLDER, (event, playgroundFolder) => {
            writeLastUseTableTopPlaygroundDirectory(playgroundFolder)
            console.log(playgroundFolder)
            this.setState({playgroundDirectory: playgroundFolder})
        });
        var lastUsedTableTopPlaygroundDirectory = getLastUsedTableTopPlaygroundDirectory()
        if (lastUsedTableTopPlaygroundDirectory !== undefined)
            this.setState({playgroundDirectory: lastUsedTableTopPlaygroundDirectory})
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_PLAYGROUND_FOLDER);
    }
    selectDirectoryAsync = async (directory) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(this.props.templativeRootDirectoryPath, gameCompose["outputDirectory"], directory)
        this.setState({selectedOutputDirectory:outputDirectory})
    }
    selectPackageDirectoryAsync = async (directory) => {
        this.setState({selectedPackageDirectory:directory})
    }
    openPlaygroundDirectoryPicker = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND)
    }
    createPlayground = async () => {
        trackEvent("playtest_create")
        var data = { 
            outputDirectorypath: this.state.selectedOutputDirectory,
            playgroundPackagesDirectorypath: this.state.playgroundDirectory
        }
        try {
            this.setState({isCreating: true})
            await axios.post(`http://localhost:8080/playground`, data)
            this.setState({isCreating: false})
        }
        catch(e) {
            console.log(e)
        }
    }
    render() {
        var buttonMessage = "Select an Output Directory"
        if (this.state.isCreating) {
            buttonMessage = "Creating Playground Package..."
        }
        else if (this.state.selectedOutputDirectory !== undefined) {
            buttonMessage = "Create Playground Package"
        }
        
        return <div className='mainBody'>
            <div className="col-4">
                
                <div className="create-button-container">
                    <div className="input-group input-group-sm playground-directory-header" data-bs-theme="dark">
                        <span className="input-group-text ttp-directory-label" id="basic-addon3">TTP Package Directory</span>
                    </div>
                    <div className="input-group input-group-sm playground-package-controls" data-bs-theme="dark">
                        <input className="form-control text-right cornered-top" value={this.state.playgroundDirectory} readOnly placeholder="TTP Package Directory" aria-label="Tabletop Playground Package Directory"/>
                        <button onClick={async () => await this.openPlaygroundDirectoryPicker()} className="btn btn-outline-secondary lookup-playground-button cornered-top" type="button" id="button-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path 
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                            />
                        </svg>
                        </button>
                    </div>
                </div>
                <SelectDirectoryInDirectory directoryPath={this.state.playgroundDirectory} 
                    selectDirectoryAsyncCallback={this.selectPackageDirectoryAsync} 
                    selectedDirectory={this.state.selectedPackageDirectory} title="Tabletop Playground Packages"
                />
                <RenderOutputOptions 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                    selectedDirectory={this.state.selectedOutputDirectory} 
                    selectDirectoryAsyncCallback={this.selectDirectoryAsync}
                />
                <button disabled={this.state.isCreating || this.state.selectedOutputDirectory === undefined} type="button" className="btn btn-outline-secondary create-playground-button" onClick={() => this.createPlayground()}>{buttonMessage}</button>
                
            </div>
            <div className="col ">
                
            </div>
        </div>
    }
}