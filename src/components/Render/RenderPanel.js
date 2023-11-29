import React from "react";
import axios from "axios";
import "./RenderPanel.css"

export default class RenderPanel extends React.Component {   
    state={
        selectedDirectory: undefined,
        selectedComponent: undefined
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
    runTempaltive = () => {
        axios.post(`http://localhost:3001/render`)
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

        return <div className='renderPanel row'>
            <div className="col-4 directoryPanel">
                <div className="headerWrapper">
                    <p className="resourcesHeader">Components</p>
                </div>
                <div className="renderComponents">
                    {componentDirectoryDivs}
                </div>
                <button type="button" className="btn btn-dark renderButton" onClick={() => this.runTempaltive()}>Render {this.state.selectedComponent !== undefined ? this.state.selectedComponent : "All"}</button>
                <div className="headerWrapper">
                    <p className="resourcesHeader">Output</p>
                </div> 
                {outputDirectoryDivs}
            </div>  
            <div className="col-8">
                
            </div>        
        </div>
    }
}