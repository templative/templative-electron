import React from "react";
import OutputExplorer from "./OutputExplorer"
import RenderButton from "./RenderButton"
import "./RenderPanel.css"
import {socket} from "../../socket"
import RenderOutput from "./RenderOutput"
import TemplativeAccessTools from "../TemplativeAccessTools";
import RenderOutputOption from "./RenderOutputOption";

export default class RenderPanel extends React.Component {   
    state={
        selectedDirectory: undefined,
        selectedComponent: undefined,
        isDebugRendering: false,
        isComplexRendering: true,
        selectedLanguage: "en",
        isConnectedToTemplative: false,
        isProcessing: false,
        messages: []
    }

    componentDidMount() {
        socket.connect();
        socket.on('printStatement', (message) => this.addMessage(message));
    }
    componentWillUnmount() {
        socket.off("printStatement");
        socket.disconnect()
    }

    addMessage(message) {
        var newMessages = this.state.messages
        newMessages.push(message)
        this.setState({messages: newMessages})
    }

    selectDirectory = (directory) => {
        this.setState({selectedDirectory:directory})
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
    renderTemplativeProject = () => {
        var request = {
            isDebug: this.state.isDebugRendering,
            isComplex: this.state.isComplexRendering,
            componentFilter: this.state.selectedComponent,
            language: this.state.selectedLanguage,
            directoryPath: this.props.templativeRootDirectoryPath,
        }
        this.setState({isProcessing: true})
        
        socket.emit('produceGame', request, () => {
            this.setState({isProcessing: false, isConnectedToTemplative: socket.connected,})
        });
    }
    render() {
        var directories = []
        if (this.props.templativeRootDirectoryPath !== undefined) {
            directories = TemplativeAccessTools.getOutputDirectories(this.props.templativeRootDirectoryPath)
        }
        var outputDirectoryDivs = directories.map((directory) => {
            return <RenderOutputOption directory={directory} key={directory.name} selectDirectory={this.selectDirectory}/>
        })

        var components = []
        if (this.props.templativeRootDirectoryPath !== undefined) {
            components = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "component-compose.json")
        }
        var componentDirectoryDivs = components.map((component) => {
            return <div onClick={()=>this.toggleComponent(component.name)} className={this.state.selectedComponent === component.name ? "directory selected" : "directory"} key={component.name}> 
                <p className="directory-item">{component.name}</p>
            </div>
        })
        var componentDirectories = []
        if (this.state.selectedDirectory !== undefined) {
            componentDirectories = TemplativeAccessTools.getOutputDirectoriesComponentDirectories(this.props.templativeRootDirectoryPath, this.state.selectedDirectory)
        } 
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

                <RenderOutput messages={this.state.messages}/>
                
                <div className="headerWrapper">
                    <p className="resourcesHeader">Output</p>
                </div> 
                {outputDirectoryDivs}
            </div>  
            <div className="col-8">
                <OutputExplorer outputFolderPath={this.state.selectedDirectory} componentDirectories={componentDirectories}/>
            </div>        
        </div>
    }
}