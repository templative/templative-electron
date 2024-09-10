import React from "react";
import OutputExplorer from "./RenderedOutput/OutputExplorer"
import RenderButton from "./RenderControls/RenderButton"
import "./RenderPanel.css"
import socket from "../../socket"
import { LoggedMessages } from "../SocketedConsole/LoggedMessages"
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativeAccessTools from "../TemplativeAccessTools";
import TemplativeClient from "../../TemplativeClient"

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
        isProcessing: false,
        doesUserOwnTemplative: false,
    }
    checkIfOwnsTemplative = async () => {
        var ownsTemplative = await TemplativeClient.doesUserOwnTemplative(this.props.email, this.props.token)
        this.setState({ doesUserOwnTemplative: ownsTemplative})
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
        await this.checkIfOwnsTemplative()
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
            .sort(function (a, b) {
                if (a.name < b.name) {
                  return -1;
                }
                if (a.name > b.name) {
                  return 1;
                }
                return 0;
              })
            .map((component) => {
                return <div onClick={()=>this.toggleComponent(component.name)} className={this.state.selectedComponent === component.name ? "directory component-selected-for-rendering" : "directory"} key={component.name}> 
                    <p className="directory-item">{component.name}</p>
                </div>
            }
        )
        
        return <div className='mainBody'>
            <div className="row">
                <div className="col-xs-12 col-md-7 col-lg-6 col-xl-3 directoryPanel">
                    <div className="component-filter-container">
                        <div className="headerWrapper">
                            <p className="resourcesHeader">Render Specific Component?</p>
                        </div>
                        <div className="component-filter-options">
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
                        
                    </div>
                    <LoggedMessages messages={this.props.templativeMessages}/>
    
                    <RenderOutputOptions selectedDirectory={this.state.selectedDirectory} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} selectDirectoryAsyncCallback={this.selectDirectoryAsync}/>
                </div>  
                <div className="col-xs-12 col-md-5 col-lg-6 col-xl-9 outputPanel">
                    <OutputExplorer templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} outputFolderPath={this.state.selectedDirectory} doesUserOwnTemplative={this.state.doesUserOwnTemplative} templativeMessages={this.props.templativeMessages}/>
                </div>        
            </div>
        </div>
    }
}