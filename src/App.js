import React from "react";

import { channels } from './shared/constants';
import TemplativeProject from "./components/TemplativeProject"
import StartView from "./components/StartView";
import EditProjectView from "./components/EditProjectView";
import './App.css';

const os = window.require('os')
const path = window.require('path')
const fs = window.require("fs")
var getDirName = require('path').dirname;

const { ipcRenderer } = window.require('electron');

class App extends React.Component {
  
    state = {
        templativeProject: undefined
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_TEMPLATIVE_ROOT_FOLDER);
    }
    async openTemplativeDirectoryPicker() {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG)
    }
    async openCreateTemplativeProjectDirectoryPicker() {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG)
    }

    attemptToGetLastProjectDirectory() {
        var homeDirectory = os.homedir() 
        var templativeSettingsDirectoryPath = path.join(homeDirectory, "Documents/templative")
        if (!fs.existsSync(templativeSettingsDirectoryPath)) {
            return undefined
        }
        var templativeSettingsPath = path.join(templativeSettingsDirectoryPath, "settings.json")
        if (!fs.existsSync(templativeSettingsPath)) {
            return undefined
        } 
        var settings = JSON.parse(fs.readFileSync(templativeSettingsPath, 'utf8'));
        return settings["lastProjectDirectory"]
    }
    writeLastOpenedProject(lastProjectDirectory) {
        var homeDirectory = os.homedir() 
        var templativeSettingsPath = path.join(homeDirectory, "Documents/Templative/settings.json")
        var newFileContents = JSON.stringify({lastProjectDirectory: lastProjectDirectory}, null, 4)
        
        fs.mkdir(getDirName(templativeSettingsPath), { recursive: true}, (err) => {});
        fs.writeFileSync(templativeSettingsPath, newFileContents, 'utf-8');
    }
    attemptToLoadLastTemplativeProject() {
        var lastProjectDirectory = this.attemptToGetLastProjectDirectory()
        if (lastProjectDirectory === undefined) {
            return
        }
        var templativeProject = new TemplativeProject(lastProjectDirectory)
        this.setState({templativeProject: templativeProject})
    }
    componentDidMount() {
        ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            var templativeProject = new TemplativeProject(templativeRootDirectoryPath)
            this.writeLastOpenedProject(templativeRootDirectoryPath)
            this.setState({templativeProject: templativeProject})
        });
        ipcRenderer.on(channels.GIVE_CLOSE_PROJECT, (_) => {
            this.setState({templativeProject: undefined})
        })
        this.attemptToLoadLastTemplativeProject()
    }
    updateRoute = (route) => {
        this.setState({currentRoute: route})
    }
    render() {
        return <div className="App">
            <div className="container-fluid">
                { this.state.templativeProject !== undefined ? 
                    <EditProjectView templativeProject={this.state.templativeProject}/> :
                    <StartView 
                        openCreateTemplativeProjectDirectoryPickerCallback={()=> this.openCreateTemplativeProjectDirectoryPicker()}
                        openTemplativeDirectoryPickerCallback={() => this.openTemplativeDirectoryPicker()}/>
                }
            </div>
        </div>
    }
}

export default App;
