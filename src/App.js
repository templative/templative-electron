import React from "react";

import { channels } from './shared/constants';
import StartView from "./components/StartView";
import EditProjectView from "./components/EditProjectView";
import './App.css';
import {writeLastOpenedProject, getLastProjectDirectory} from "./settings/SettingsManager"
import { trackEvent } from "@aptabase/electron/renderer";

const { ipcRenderer } = require('electron');

class App extends React.Component {
  
    state = {
        templativeRootDirectoryPath: undefined
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_TEMPLATIVE_ROOT_FOLDER);
    }
    async openTemplativeDirectoryPicker() {
        trackEvent("project_change")
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG)
    }
    async openCreateTemplativeProjectDirectoryPicker() {
        trackEvent("project_create")
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG)
    }

    attemptToLoadLastTemplativeProject() {
        var lastProjectDirectory = getLastProjectDirectory()
        if (lastProjectDirectory === undefined) {
            return
        }
        this.setState({templativeRootDirectoryPath: lastProjectDirectory})
    }
    componentDidMount() {
        ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            writeLastOpenedProject(templativeRootDirectoryPath)
            this.setState({templativeRootDirectoryPath: templativeRootDirectoryPath})
        });
        ipcRenderer.on(channels.GIVE_CLOSE_PROJECT, (_) => {
            this.setState({templativeRootDirectoryPath: undefined})
        })
        this.attemptToLoadLastTemplativeProject()
    }
    updateRoute = (route) => {
        this.setState({currentRoute: route})
    }
    render() {
        return <div className="App">
            <div className="container-fluid">
                { this.state.templativeRootDirectoryPath !== undefined ? 
                    <EditProjectView templativeRootDirectoryPath={this.state.templativeRootDirectoryPath}/> :
                    <StartView 
                        openCreateTemplativeProjectDirectoryPickerCallback={()=> this.openCreateTemplativeProjectDirectoryPicker()}
                        openTemplativeDirectoryPickerCallback={() => this.openTemplativeDirectoryPicker()}/>
                }
            </div>
        </div>
    }
}

export default App;
