import React from "react";
import axios from "axios";
import OutputExplorer from "./OutputExplorer"
import RenderButton from "./RenderButton"
import "./RenderPanel.css"

export default class RenderPanel extends React.Component {   
    state={
        selectedDirectory: undefined,
        selectedComponent: undefined,
        isDebugRendering: false,
        isComplexRendering: true,
        selectedLanguage: "en"
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
    runTempaltive = () => {
        axios.post(`http://localhost:3001/render`, null, { params: {
            isDebug: this.state.isDebugRendering,
            isComplex: this.state.isComplexRendering,
            componentFilter: this.state.selectedComponent,
            language: this.state.selectedLanguage
        }})
        .then(res => {
            console.log(res)
        })
    }
    render() {
        var directories = []
        if (this.props.templativeProject !== undefined) {
            directories = this.props.templativeProject.getOutputDirectories()
        }
        var outputDirectoryDivs = directories.map((directory) => {
            return <div onClick={()=>this.selectDirectory(directory)} className={this.state.selectedDirectory === directory ? "directory selected" : "directory"} key={directory}> 
                <p className="directory-item">{directory}</p>
            </div>
        })

        var components = []
        if (this.props.templativeProject !== undefined) {
            components = this.props.templativeProject.componentCompose
        }
        var componentDirectoryDivs = components.map((component) => {
            return <div onClick={()=>this.toggleComponent(component.name)} className={this.state.selectedComponent === component.name ? "directory selected" : "directory"} key={component.name}> 
                <p className="directory-item">{component.name}</p>
            </div>
        })
        var componentDirectories = []
        if (this.state.selectedDirectory !== undefined) {
            componentDirectories = this.props.templativeProject.getOutputDirectoriesComponentDirectories(this.state.selectedDirectory)
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
                    runTempaltiveCallback={this.runTempaltive}
                    setLanguageCallback={this.setLanguage}
                />
                
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