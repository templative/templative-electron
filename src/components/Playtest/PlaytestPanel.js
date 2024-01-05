import React from "react";
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import "./PlaytestPanel.css"
import SelectDirectoryInDirectory from "../SelectDirectory/SelectDirectoryInDirectory";
import { channels } from "../../shared/constants";
import {writeLastUseTableTopPlaygroundDirectory, getLastUsedTableTopPlaygroundDirectory} from "../../settings/SettingsManager"
const axios = window.require("axios")
const { ipcRenderer } = window.require('electron');

export default class PlaytestPanel extends React.Component {   
    state={
        selectedOutputDirectory: undefined,
        selectedPackageDirectory: undefined,
        isCreating: false,
        playgroundDirectory: ""
    }
    componentDidMount() {
        ipcRenderer.on(channels.GIVE_PLAYGROUND_FOLDER, (event, playgroundFolder) => {
            writeLastUseTableTopPlaygroundDirectory(playgroundFolder)
            console.log(playgroundFolder)
            this.setState({playgroundDirectory: playgroundFolder})
        });
        var lastUsedTableTopPlaygroundDirectory = getLastUsedTableTopPlaygroundDirectory()
        if (lastUsedTableTopPlaygroundDirectory != undefined)
            this.setState({playgroundDirectory: lastUsedTableTopPlaygroundDirectory})
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_PLAYGROUND_FOLDER);
    }
    selectDirectory = (directory) => {
        this.setState({selectedOutputDirectory:directory})
    }
    selectPackageDirectory = (directory) => {
        this.setState({selectedPackageDirectory:directory})
    }
    openPlaygroundDirectoryPicker = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND)
    }
    createPlayground = async () => {
        var data = { 
            outputDirectorypath: `${this.props.templativeRootDirectoryPath}/output/${this.state.selectedOutputDirectory}`,
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
        
        return <div className='mainBody row'>
            <div className="col-4">
                <RenderOutputOptions selectedDirectory={this.state.selectedOutputDirectory} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} selectDirectory={this.selectDirectory}/>
                <div className="create-button-container">
                    <div className="input-group input-group-sm playground-package-controls" data-bs-theme="dark">
                        <span className="input-group-text" id="basic-addon3">TTP Package Directory</span>
                        <input className="form-control" value={this.state.playgroundDirectory} readOnly placeholder="TTP Package Directory" aria-label="Tabletop Playground Package Directory"/>
                        <button onClick={async () => await this.openPlaygroundDirectoryPicker()} className="btn btn-outline-secondary" type="button" id="button-addon1">↗</button>
                    </div>
                    <button disabled={this.state.isCreating || this.state.selectedOutputDirectory === undefined} type="button" className="btn btn-outline-secondary create-playground-button" onClick={() => this.createPlayground()}>{buttonMessage}</button>
                </div>
                <SelectDirectoryInDirectory directoryPath={this.state.playgroundDirectory} selectDirectoryCallback={this.selectPackageDirectory} selectedDirectory={this.state.selectedPackageDirectory} title="Tabletop Playground Packages"/>
            </div>
            <div className="col ">
                
            </div>
        </div>
    }
}