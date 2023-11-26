import React from "react";
import { channels } from '../shared/constants';
import ComponentItem from "./ComponentItem"
import TemplativeProject from "./TemplativeProject"
const { ipcRenderer } = window.require('electron');

export default class TemplativeProjectRenderer extends React.Component {   
    state = {templativeProject: undefined}

    componentDidMount() {
        // this.renderer = ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
        //     var templativeProject = new TemplativeProject(templativeRootDirectoryPath)
        //     this.setState({templativeProject: templativeProject})
        // });
        var templativeProject = new TemplativeProject("C:/Users/User/Documents/git/nextdaygames/apcw-defines")
            this.setState({templativeProject: templativeProject})
    } 
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_TEMPLATIVE_ROOT_FOLDER);
    }

    renderComponentDivs() {
        if (this.state.templativeProject === undefined) {
            return [];
        }
        var divs = [];
        console.log(this.state.templativeProject)
        for(var i = 0; i < this.state.templativeProject.componentCompose.length; i++) {
            var component = this.state.templativeProject.componentCompose[i]
            divs.push(<ComponentItem key={component.name} component={component}/>)
        }
        return divs;
    }

    render() {
        var componentDivs = this.renderComponentDivs()
        return <div>
            {componentDivs}
        </div>        
    }
}