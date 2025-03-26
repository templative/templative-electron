import React from "react";
import "./PlaygroundPanel.css"
import { channels } from "../../../../../../shared/constants";
import {writeLastUseTableTopPlaygroundDirectory, getLastUsedTableTopPlaygroundDirectory} from "../../../../utility/SettingsManager"
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativePurchaseButton from "../../../TemplativePurchaseButton";
import PlaygroundOutputExplorer from "./PlaygroundOutputExplorer";
import playgroundLogo from "./playgroundLogo.png"
const path = require('path');
const fs = require('fs');
const { ipcRenderer } = require('electron');

export default class PlaygroundPanel extends React.Component {   
    state={
        outputFolderPath: undefined,
        selectedPackageDirectory: undefined,
        isCreating: false,
        playgroundDirectory: "",
    }
    
    componentDidMount = async () => {
        trackEvent("view_playgroundPanel")

        ipcRenderer.on(channels.GIVE_PLAYGROUND_FOLDER, (event, playgroundFolder) => {
            writeLastUseTableTopPlaygroundDirectory(playgroundFolder)
            if (playgroundFolder !== undefined) {
                this.pullExportedInformation(playgroundFolder)
            }
        });
        var lastUsedTableTopPlaygroundDirectory = getLastUsedTableTopPlaygroundDirectory()
        if (lastUsedTableTopPlaygroundDirectory !== undefined) {
            this.pullExportedInformation(lastUsedTableTopPlaygroundDirectory)
        }
    }
    pullExportedInformation = (exportedToDirectory) => {
        var outputName = path.basename(this.props.outputFolderPath);
        var selectedPackageDirectory = path.join(exportedToDirectory, outputName)
        var selectedPackageExists = fs.existsSync(selectedPackageDirectory)
        this.setState({
            playgroundDirectory: exportedToDirectory,
            selectedPackageDirectory: selectedPackageExists ? selectedPackageDirectory : undefined
        })
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.outputFolderPath === prevProps.outputFolderPath) {
            return
        }
        var lastUsedTableTopPlaygroundDirectory = getLastUsedTableTopPlaygroundDirectory()
        if (lastUsedTableTopPlaygroundDirectory !== undefined) {
            this.pullExportedInformation(lastUsedTableTopPlaygroundDirectory)
        }
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_PLAYGROUND_FOLDER);
    }
    openPlaygroundDirectoryPicker = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND)
    }
    createPlayground = async () => {
        trackEvent("playground_create")
        var data = { 
            outputDirectorypath: this.props.outputFolderPath,
            playgroundPackagesDirectorypath: this.state.playgroundDirectory
        }
        try {
            this.setState({isCreating: true})
            const result = await ipcRenderer.invoke(channels.TO_SERVER_CREATE_PLAYGROUND_PACKAGE, data);
            var outputName = path.basename(this.props.outputFolderPath);
            var selectedPackageDirectory = path.join(this.state.playgroundDirectory, outputName)
            var selectedPackageExists = fs.existsSync(selectedPackageDirectory)
            this.setState({isCreating: false, selectedPackageDirectory: selectedPackageExists ? selectedPackageDirectory : undefined})
        }
        catch(e) {
            console.error(e)
        }
    }
    render() {
        var buttonMessage = this.state.isCreating ? "Creating Playground Package..." : "Create Playground Package"
        var isCreateDisabled = this.state.isCreating || this.props.outputFolderPath === undefined
        var isPackageCreated = this.state.playgroundDirectory !== undefined && this.state.selectedPackageDirectory !== undefined
        
        return <React.Fragment>
            { isPackageCreated ?
                <PlaygroundOutputExplorer packageDirectory={this.state.selectedPackageDirectory}/>
                :
                <div className="playground-save-controls">
                    <div className="playground-logo-container">
                        <img src={playgroundLogo} alt="Playground Logo" className="playground-logo"/>
                    </div>
                    
                    <div className="vertical-input-group">
                        <div className="input-group input-group-sm playground-directory-header" data-bs-theme="dark">
                            <span className="input-group-text ttp-directory-label" id="basic-addon3">Tabletop Playground Package Directory</span>
                        </div>
                        <div className="input-group input-group-sm playground-package-controls" data-bs-theme="dark">
                            <input onClick={async () => await this.openPlaygroundDirectoryPicker()} className="form-control text-right cornered-top" value={this.state.playgroundDirectory} title="Usually Steam/steamapps/common/TabletopPlayground/TabletopPlayground/PersistentDownloadDir" readOnly placeholder="Usually Steam/steamapps/common/TabletopPlayground/TabletopPlayground/PersistentDownloadDir" aria-label="Tabletop Playground Package Directory"/>
                            <button onClick={async () => await this.openPlaygroundDirectoryPicker()} className="btn btn-outline-primary lookup-playground-button cornered-top" type="button" id="button-addon1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path 
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                                />
                            </svg>
                            </button>
                        </div>
                        <button disabled={isCreateDisabled} type="button" className="btn btn-outline-primary create-playground-button" onClick={() => this.createPlayground()}>{buttonMessage}</button>
                    </div>
                </div>
            }                    
        </React.Fragment>
        
    }
}