import React from "react";
import { channels } from '../shared/constants';
import TemplativeProject from "./TemplativeProject"
const { ipcRenderer } = window.require('electron');

export default class TemplativeProjectRenderer extends React.Component {   
    state = {templativeProject: undefined}

    componentDidMount() {
        this.renderer = ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            var templativeProject = new TemplativeProject(templativeRootDirectoryPath)
            this.setState({templativeProject: templativeProject})
        });
    } 
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_TEMPLATIVE_ROOT_FOLDER);
    }
    render() {
        return <div>
        </div>        
    }
}