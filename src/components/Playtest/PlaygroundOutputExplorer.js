import React from "react";
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import "./PlaytestPanel.css"
import SelectDirectoryInDirectory from "../SelectDirectory/SelectDirectoryInDirectory";
import { channels } from "../../shared/constants";

const { ipcRenderer } = require('electron');

export default class PlaygroundOutputExplorer extends React.Component {   
    state={
        
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {

    }
    
    openPlaygroundDirectoryPicker = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND)
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
                
                <div className="create-button-container">
                    <div className="input-group input-group-sm playground-directory-header" data-bs-theme="dark">
                        <span className="input-group-text ttp-directory-label" id="basic-addon3">TTP Package Directory</span>
                    </div>
                    <div className="input-group input-group-sm playground-package-controls" data-bs-theme="dark">
                        <input className="form-control cornered-top" value={this.state.playgroundDirectory} readOnly placeholder="TTP Package Directory" aria-label="Tabletop Playground Package Directory"/>
                        <button onClick={async () => await this.openPlaygroundDirectoryPicker()} className="btn btn-outline-secondary cornered-top" type="button" id="button-addon1">↗</button>
                    </div>
                </div>
                <SelectDirectoryInDirectory directoryPath={this.state.playgroundDirectory} selectDirectoryCallback={this.selectPackageDirectory} selectedDirectory={this.state.selectedPackageDirectory} title="Tabletop Playground Packages"/>
                <RenderOutputOptions selectedDirectory={this.state.selectedOutputDirectory} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} selectDirectoryAsyncCallback={this.selectDirectoryAsync}/>
                <button disabled={this.state.isCreating || this.state.selectedOutputDirectory === undefined} type="button" className="btn btn-outline-secondary create-playground-button" onClick={() => this.createPlayground()}>{buttonMessage}</button>
                
            </div>
            <div className="col ">
                
            </div>
        </div>
    }
}