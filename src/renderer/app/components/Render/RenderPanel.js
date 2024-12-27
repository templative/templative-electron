import React from "react";
import OutputExplorer from "./RenderedOutput/OutputExplorer"
import RenderButton from "./RenderControls/RenderButton"
import "./RenderPanel.css"
import socket from "../../utility/socket"
import { LoggedMessages } from "../SocketedConsole/LoggedMessages"
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativeAccessTools from "../TemplativeAccessTools";
import { RenderingWorkspaceContext } from "./RenderingWorkspaceProvider";

const path = require('path');



export default class RenderPanel extends React.Component {  
    static contextType = RenderingWorkspaceContext; 
    state={
        components: [],
        isDebugRendering: false,
        isComplexRendering: true,
        selectedLanguage: "en",
        isConnectedToTemplative: false,
        isProcessing: false,
        isResizing: false
    }

    selectDirectoryAsync = async (directory) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(this.props.templativeRootDirectoryPath, gameCompose["outputDirectory"], directory)
        this.setState({selectedOutputDirectory: outputDirectory})
        this.context.setSelectedOutputFolder(outputDirectory)
    }
    toggleComponent = (componentName) => {
        if (this.context.selectedComponentFilter === componentName) {
            this.context.setSelectedComponentFilter(undefined)
            return
        }
        this.context.setSelectedComponentFilter(componentName)
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
            componentFilter: this.context.selectedComponentFilter,
            language: this.state.selectedLanguage,
            directoryPath: this.props.templativeRootDirectoryPath,
        }
        this.context.setExportOptionIndex(0)
        this.setState({isProcessing: true})
        trackEvent("render")
        
        socket.emit('produceGame', request, () => {
            this.setState({isProcessing: false, isConnectedToTemplative: socket.connected,})
        });
    }
    startResize = (e) => {
        const startX = e.clientX;
        const startWidth = this.context.renderControlsColumnWidth;
        const container = document.querySelector('.mainBody .row');
        
        this.setState({ isResizing: true });
        
        const doDrag = (e) => {
            const containerWidth = container.offsetWidth;
            const difference = e.clientX - startX;
            const newWidth = startWidth + (difference / containerWidth * 100);
            this.context.setRenderControlsColumnWidth(Math.min(Math.max(8, newWidth), 50));
        };

        const stopResize = () => {
            this.setState({ isResizing: false });
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopResize);
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
                return <div onClick={()=>this.toggleComponent(component.name)} className={this.context.selectedComponentFilter === component.name ? "directory component-selected-for-rendering" : "directory"} key={component.name}> 
                    <p className="directory-item">{component.name}</p>
                </div>
            }
        )
        
        return <div className='mainBody'>
            <div className="row render-panel-row">
                <div className="col-xs-12 col-md-7 col-lg-6 col-xl-3 directoryPanel" 
                     style={{width: `${this.context.renderControlsColumnWidth}%`}}>
                    <div className={`resize-handle${this.state.isResizing ? ' active' : ''}`} onMouseDown={this.startResize}></div>
                    <div className="component-filter-container">
                        <div className="headerWrapper">
                            <p className="resourcesHeader">Composition Filter</p>
                        </div>
                        <div className="component-filter-options">
                            {componentDirectoryDivs}
                        </div>
                        <RenderButton 
                            selectedComponent={this.context.selectedComponentFilter} 
                            selectedLanguage={this.state.selectedLanguage} 
                            isDebugRendering={this.state.isDebugRendering}
                            isComplexRendering={this.state.isComplexRendering}
                            toggleDebugCallback={this.setDebugCheckbox}
                            toggleComplexCallback={this.setComplexCheckbox}
                            renderTemplativeProjectCallback={this.renderTemplativeProject}
                            setLanguageCallback={this.setLanguage}
                        />
                        
                    </div>
                    <LoggedMessages 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                        messages={this.props.templativeMessages}
                    />
                    <RenderOutputOptions 
                        selectedDirectory={this.context.selectedOutputDirectory} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} selectDirectoryAsyncCallback={this.selectDirectoryAsync}/>
                </div>  
                <div className="outputPanel">
                    <OutputExplorer 
                        changeTabsToEditAFileCallback={this.props.changeTabsToEditAFileCallback}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                        outputFolderPath={this.context.selectedOutputDirectory}
                    />
                </div>        
            </div>
        </div>
    }
}