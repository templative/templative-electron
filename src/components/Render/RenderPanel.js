import React from "react";
import OutputExplorer from "./OutputExplorer"
import RenderButton from "./RenderButton"
import "./RenderPanel.css"
import socket from "../../socket"
import { LimitedHeightConsole } from "../SocketedConsole/LoggedMessages"
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativeAccessTools from "../TemplativeAccessTools";
const path = require('path');

export default class RenderPanel extends React.Component {   
    state={
        components: [],
        selectedDirectory: undefined,
        selectedComponent: undefined,
        isDebugRendering: false,
        isComplexRendering: true,
        selectedLanguage: "en",
        isConnectedToTemplative: false,
        isProcessing: false
    }

    selectDirectoryAsync = async (directory) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(this.props.templativeRootDirectoryPath, gameCompose["outputDirectory"], directory)
        this.setState({selectedDirectory: outputDirectory})
    }
    toggleComponent = (component) => {
        if (this.state.selectedComponent === component) {
            this.setState({selectedComponent:undefined})
            return
        }
        this.setState({selectedComponent:component})
    }
    setDebugCheckbox = () => { 
        this.setState({isDebugRendering: !this.state.isDebugRendering})
    }
    setComplexCheckbox = () => { 
        this.setState({isComplexRendering: !this.state.isComplexRendering})
    }
    setLanguage = (event) => {
        this.setState({selectedLanguage: event.target.value})
    }
    componentDidMount = async () => {
        trackEvent("view_renderPanel")
        if (this.props.templativeRootDirectoryPath !== undefined) {
            var components = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json")
            this.setState({components: components})
        }
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.templativeRootDirectoryPath !== prevProps.templativeRootDirectoryPath) {
            var components = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json")
            this.setState({components: components})
        }
    }
    renderTemplativeProject = () => {
        var request = {
            isDebug: this.state.isDebugRendering,
            isComplex: this.state.isComplexRendering,
            componentFilter: this.state.selectedComponent,
            language: this.state.selectedLanguage,
            directoryPath: this.props.templativeRootDirectoryPath,
        }
        this.setState({isProcessing: true})
        trackEvent("render")
        
        socket.emit('produceGame', request, () => {
            this.setState({isProcessing: false, isConnectedToTemplative: socket.connected,})
        });
    }
    render() {
        var componentDirectoryDivs = this.state.components
            .filter(component => !component.type.startsWith("STOCK_"))
            .map((component) => {
                return <div onClick={()=>this.toggleComponent(component.name)} className={this.state.selectedComponent === component.name ? "directory selected" : "directory"} key={component.name}> 
                    <p className="directory-item">{component.name}</p>
                </div>
            }
        )
        
        return <div className='renderPanel row'>
            <div className="col-4 directoryPanel">
                <div className="headerWrapper">
                    <p className="resourcesHeader">Components</p>
                </div>
                <div className="renderComponents">
                    {componentDirectoryDivs}
                </div>
                <RenderButton 
                    selectedComponent={this.state.selectedComponent} 
                    selectedLanguage={this.state.selectedLanguage} 
                    isDebugRendering={this.state.isDebugRendering}
                    isComplexRendering={this.state.isComplexRendering}
                    toggleDebugCallback={this.setDebugCheckbox}
                    toggleComplexCallback={this.setComplexCheckbox}
                    renderTemplativeProjectCallback={this.renderTemplativeProject}
                    setLanguageCallback={this.setLanguage}
                />

                <LimitedHeightConsole/>
                
                <RenderOutputOptions selectedDirectory={this.state.selectedDirectory} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} selectDirectoryAsyncCallback={this.selectDirectoryAsync}/>
            </div>  
            <div className="col-8 outputPanel">
                <OutputExplorer outputFolderPath={this.state.selectedDirectory}/>
            </div>        
        </div>
    }
}