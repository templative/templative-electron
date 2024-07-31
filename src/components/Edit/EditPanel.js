import React from "react";
import TemplativeProjectRenderer from "./FileExplorer/TemplativeProjectRenderer"
import ArtdataViewer from "./Viewers/ArtdataViewer/ArtdataViewer"
import ComponentsViewer from "./Viewers/ComponentsViewer/ComponentsViewer"
import PieceGamedataViewer from "./Viewers/GamedataViewer/PieceGamedataViewer"
import KeyValueGamedataViewer from "./Viewers/GamedataViewer/KeyValueGamedataViewer"
import ImageViewer from "./Viewers/ImageViewer";
import RulesEditor from "./Viewers/RulesEditor";
import EditPanelTabs from "./EditPanelTabs";
import RenderPreview from "./RenderPreview/RenderPreview";
import { trackEvent } from "@aptabase/electron/renderer";

import "./EditPanel.css"
import "./EditPanelTabs.css"

export default class EditPanel extends React.Component { 
    clickIntoFile = () => {
        if (this.props.italicsTabFilepath !== this.props.currentFilepath) {
            return
        }
        this.props.clickIntoFileCallback()
    }      
    componentDidMount() {
        trackEvent("view_editPanel")
    }
    render () {
        var filepathSplit = this.props.currentFilepath.replace(/\\/g,"/").replace(/^\/|\/$/g, '').split("/").join(" > ")
        return <div className='mainBody'>
            <div className="row g-0">
                <div className='col-3 left-column'>
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
                    />
                </div>
                <div className='col-7 viewer'>
                    <EditPanelTabs 
                        italicsTabFilepath={this.props.italicsTabFilepath}
                        currentFilepath={this.props.currentFilepath} 
                        tabbedFiles={this.props.tabbedFiles}
                        updateViewedFileUsingTabAsyncCallback={this.props.updateViewedFileUsingTabAsyncCallback}
                        closeAllTabsAsyncCallback={this.props.closeAllTabsAsyncCallback}
                        closeTabAtIndexAsyncCallback={this.props.closeTabAtIndexAsyncCallback}
                        closeTabsToLeftAsyncCallback={this.props.closeTabsToLeftAsyncCallback}
                        closeTabsToRightAsyncCallback={this.props.closeTabsToRightAsyncCallback}
                        closeAllTabsButIndexAsyncCallback={this.props.closeAllTabsButIndexAsyncCallback}
                    />
                    <div className="filename-row">
                        <p className="filename-title">{filepathSplit}</p>
                    </div>
                    <div className="file-contents" onClick={this.clickIntoFile}>
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
                        {this.props.currentFileType === "ART" &&
                            <ImageViewer filepath={this.props.currentFilepath}/>
                        }
                        {this.props.currentFileType === "PIECE_GAMEDATA" &&
                            <PieceGamedataViewer filepath={this.props.currentFilepath} saveFileAsyncCallback={this.props.saveFileAsyncCallback}/>
                        }
                        {this.props.currentFileType === "KEYVALUE_GAMEDATA" &&
                            <KeyValueGamedataViewer filepath={this.props.currentFilepath} saveFileAsyncCallback={this.props.saveFileAsyncCallback}/>
                        }
                        {this.props.currentFileType === "COMPONENTS" && 
                            <ComponentsViewer 
                                updateViewedFileUsingExplorerAsyncCallback ={this.props.updateViewedFileUsingExplorerAsyncCallback}
                                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                                saveFileAsyncCallback={this.props.saveFileAsyncCallback}
                                componentTypesCustomInfo={this.props.componentTypesCustomInfo}
                                componentTypesStockInfo={this.props.componentTypesStockInfo}
                            />
                        }
                    </div>
                </div>
                <div className="col-2 render-preview-column">
                    <RenderPreview templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/>
                </div>
            </div>
      </div>
    }
}