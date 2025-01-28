import React from "react";
import TemplativeProjectRenderer from "./FileExplorer/TemplativeProjectRenderer"
import ArtdataViewer from "./Viewers/ArtdataViewer/ArtdataViewer"
import ComponentsViewer from "./Viewers/ComponentsViewer/ComponentsViewer"
import PieceGamedataViewer from "./Viewers/GamedataViewer/PieceGamedataViewer"
import ComponentGamedataViewer from "./Viewers/GamedataViewer/ComponentGamedataViewer"
import GameGamedataViewer from "./Viewers/GamedataViewer/GameGamedataViewer";
import SettingsViewer from "./Viewers/SettingsViewer";
import ImageViewer from "./Viewers/ImageViewer";
import RulesEditor from "./Viewers/RulesEditor";
import EditPanelTabs from "./EditPanelTabs";
import RenderPreview from "./RenderPreview/RenderPreview";
import { trackEvent } from "@aptabase/electron/renderer";
import noFileIcon from "./noFileIcon.svg"
import "./EditPanel.css"
import "./EditPanelTabs.css"
import StudioGamedataViewer from "./Viewers/GamedataViewer/StudioGamedataViewer";
import UnifiedComponentViewer from "./Viewers/UnifiedViewer/UnifiedComponentViewer";
import { RenderingWorkspaceContext } from '../Render/RenderingWorkspaceProvider';

export default class EditPanel extends React.Component { 
    static contextType = RenderingWorkspaceContext;

    state = {
        componentComposeScollPosition: 0,
        isResizing: false
    }

    clickIntoFile = () => {
        if (this.props.italicsTabFilepath !== this.props.currentFilepath) {
            return
        }
        this.props.clickIntoFileCallback()
    }      
    componentDidMount() {
        trackEvent("view_editPanel")
    }
    updateComponentComposeScrollPosition = (scrollPosition) => {
        this.setState({ componentComposeScollPosition: scrollPosition });
    }
    startResize = (e) => {
        const startX = e.clientX;
        const startWidth = this.context.fileExplorerColumnWidth;
        const container = document.querySelector('.mainBody .row');
        
        this.setState({ isResizing: true });
        
        const doDrag = (e) => {
            const containerWidth = container.offsetWidth;
            const difference = e.clientX - startX;
            const newWidth = startWidth + (difference / containerWidth * 100);
            this.context.setFileExplorerColumnWidth(Math.min(Math.max(8, newWidth), 50));
        };

        const stopResize = () => {
            this.setState({ isResizing: false });
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopResize);
    }
    render () {
        var filepathSplit = this.props.currentFilepath !== undefined ? this.props.currentFilepath.replace(/\\/g,"/").replace(/^\/|\/$/g, '').split("/").join(" > ") : ""
        return <div className='mainBody'>
            <div className="row g-0">
                <div className='col-3 col-xl-2 left-column' style={{width: `${this.context.fileExplorerColumnWidth}%`}}>
                    <div className={`resize-handle${this.state.isResizing ? ' active' : ''}`} onMouseDown={this.startResize}></div>
                    <TemplativeProjectRenderer 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                        currentFileType={this.props.currentFileType}
                        currentFilepath={this.props.currentFilepath} 
                        clearViewedFileCallback={this.props.clearViewedFileCallback}
                        updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                        openComponentsCallback={this.props.openComponentsCallback}
                        openStudioGamedataCallback={this.props.openStudioGamedataCallback}
                        openGameGamedataCallback={this.props.openGameGamedataCallback}
                        openRulesCallback={this.props.openRulesCallback}
                        closeTabIfOpenByFilepathCallback={this.props.closeTabIfOpenByFilepathCallback}
                        extendedFileTypes={this.props.extendedFileTypes}    
                        changeExtendedFileTypeAsyncCallback={this.props.changeExtendedFileTypeAsyncCallback}
                        extendedDirectories={this.props.extendedDirectories}
                        changeExtendedDirectoryAsyncCallback={this.props.changeExtendedDirectoryAsyncCallback}
                        updateRouteCallback={this.props.updateRouteCallback}
                        componentCompose={this.props.componentCompose}
                        saveComponentComposeAsync={this.props.saveComponentComposeAsync}
                    />
                </div>
                <div className='col viewer'>
                    <EditPanelTabs 
                        italicsTabFilepath={this.props.italicsTabFilepath}
                        currentFilepath={this.props.currentFilepath} 
                        tabbedFiles={this.props.tabbedFiles}
                        updateViewedFileToUnifiedAsyncCallback={this.props.updateViewedFileToUnifiedAsyncCallback}
                        updateViewedFileUsingTabAsyncCallback={this.props.updateViewedFileUsingTabAsyncCallback}
                        closeAllTabsAsyncCallback={this.props.closeAllTabsAsyncCallback}
                        closeTabAtIndexAsyncCallback={this.props.closeTabAtIndexAsyncCallback}
                        closeTabsToLeftAsyncCallback={this.props.closeTabsToLeftAsyncCallback}
                        closeTabsToRightAsyncCallback={this.props.closeTabsToRightAsyncCallback}
                        closeAllTabsButIndexAsyncCallback={this.props.closeAllTabsButIndexAsyncCallback}
                        componentTypesCustomInfo={this.props.componentTypesCustomInfo}
                        componentTypesStockInfo={this.props.componentTypesStockInfo}
                        updateRouteCallback={this.props.updateRouteCallback}
                    />
                    <div className="filename-row">
                        <p className="filename-title">{filepathSplit}</p>
                    </div>
                    <div className="file-contents" onClick={this.clickIntoFile}>
                        {this.props.currentFileType === "SETTINGS" &&
                            <SettingsViewer 
                                filepath={this.props.currentFilepath} 
                                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                                saveFileAsyncCallback={this.props.saveFileAsyncCallback}
                            />
                        }
                        {this.props.currentFileType === "RULES" &&
                            <RulesEditor 
                                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                                saveFileAsyncCallback={this.props.saveFileAsyncCallback}
                            />
                        }
                        {this.props.currentFileType === "ARTDATA" &&
                            <ArtdataViewer 
                                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                                filepath={this.props.currentFilepath} 
                                saveFileAsyncCallback={this.props.saveFileAsyncCallback}
                                updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                            />
                        }
                        {(this.props.currentFileType === "ART" || this.props.currentFileType === "GAMECRAFTER") &&
                            <ImageViewer filepath={this.props.currentFilepath}/>
                        }
                        {this.props.currentFileType === "PIECE_GAMEDATA" &&
                            <PieceGamedataViewer 
                                componentName={undefined} // Reserved for use by previewing the piece
                                showPreviewCallback={()=>{}}
                                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                                isPreviewEnabled={false} 
                                filepath={this.props.currentFilepath} 
                                saveFileAsyncCallback={this.props.saveFileAsyncCallback}
                            />
                        }
                        {this.props.currentFileType === "COMPONENT_GAMEDATA" &&
                            <ComponentGamedataViewer filepath={this.props.currentFilepath} saveFileAsyncCallback={this.props.saveFileAsyncCallback}/>
                        }
                        {this.props.currentFileType === "STUDIO_GAMEDATA" &&
                            <StudioGamedataViewer filepath={this.props.currentFilepath} saveFileAsyncCallback={this.props.saveFileAsyncCallback}/>
                        }
                        {this.props.currentFileType === "GAME_GAMEDATA" &&
                            <GameGamedataViewer filepath={this.props.currentFilepath} saveFileAsyncCallback={this.props.saveFileAsyncCallback}/>
                        }
                        {this.props.currentFileType === "UNIFIED_COMPONENT" && 
                            <UnifiedComponentViewer 
                                componentCompose={this.props.componentCompose}
                                saveComponentComposeAsync={this.props.saveComponentComposeAsync}
                                componentName={this.props.currentFilepath.split("#")[1]}
                                showPreviewCallback={this.context.showPreview}
                                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}      
                                saveFileAsyncCallback={this.props.saveFileAsyncCallback}  
                                updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}  
                                componentTypesCustomInfo={this.props.componentTypesCustomInfo}        
                                updateRouteCallback={this.props.updateRouteCallback}     
                            />
                        }
                        {this.props.currentFileType === undefined && 
                            <div className="no-file-icon-container">
                                <img src={noFileIcon} className="no-file-icon"/>
                            </div>
                        }
                    </div>
                </div>
                <div className="preview-vertical-bar" onClick={this.context.togglePreviewVisibility}>
                    <span>Preview {this.context.isPreviewVisible ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down tags-chevron" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up tags-chevron" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                            </svg>
                    }</span>
                </div>
                {this.context.isPreviewVisible &&
                    <div className="col-2 render-preview-column">
                        <RenderPreview templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/>
                    </div>
                }
            </div>
      </div>
    }
}