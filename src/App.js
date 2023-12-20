import React from "react";

import { channels } from './shared/constants';
import TemplativeAccessTools from "./components/TemplativeAccessTools"
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
        templativeRootDirectoryPath: undefined
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
            fs.mkdir(getDirName(templativeSettingsDirectoryPath), { recursive: true }, (err) => {});
        }
        var templativeSettingsPath = path.join(templativeSettingsDirectoryPath, "settings.json")
        if (!fs.existsSync(templativeSettingsPath)) {
            this.writeLastOpenedProject(undefined)
            return undefined
        } 
        var settings = JSON.parse(fs.readFileSync(templativeSettingsPath, 'utf8'));
        return settings["lastProjectDirectory"]
    }
    writeLastOpenedProject(lastProjectDirectory) {
        var homeDirectory = os.homedir() 
        var templativeSettingsPath = path.join(homeDirectory, "Documents/Templative/settings.json")
        var newFileContents = JSON.stringify({lastProjectDirectory: lastProjectDirectory}, null, 4)
        
        fs.mkdir(getDirName(templativeSettingsPath), { recursive: true }, (err) => {});
        fs.writeFileSync(templativeSettingsPath, newFileContents, 'utf-8');
    }

    processTemplativeAccessToolsForDirectory(templativeRootDirectoryPath) {
        var componentCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "component-compose.json");
        var gameCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game-compose.json");
        TemplativeAccessTools.hydrateGameComposeFile(templativeRootDirectoryPath, gameCompose)
        
        var gameFile = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game.json");
        var studioFile = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "studio.json");
    }

    attemptToLoadLastTemplativeAccessTools() {
        var lastProjectDirectory = this.attemptToGetLastProjectDirectory()
        if (lastProjectDirectory === undefined) {
            return
        }
        this.processTemplativeAccessToolsForDirectory(lastProjectDirectory)
        this.setState({templativeRootDirectoryPath: lastProjectDirectory})
    }
    componentDidMount() {
        ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            this.processTemplativeAccessToolsForDirectory(templativeRootDirectoryPath)
            this.writeLastOpenedProject(templativeRootDirectoryPath)
            this.setState({templativeRootDirectoryPath: templativeRootDirectoryPath})
        });
        ipcRenderer.on(channels.GIVE_CLOSE_PROJECT, (_) => {
            this.setState({templativeRootDirectoryPath: undefined})
        })
        this.attemptToLoadLastTemplativeAccessTools()
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
