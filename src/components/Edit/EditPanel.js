import React from "react";
import TemplativeProjectRenderer from "./FileExplorer/TemplativeProjectRenderer"
import ArtdataViewer from "./Viewers/ArtdataViewer/ArtdataViewer"
import ComponentsViewer from "./Viewers/ComponentsViewer/ComponentsViewer"
import PieceGamedataViewer from "./Viewers/GamedataViewer/PieceGamedataViewer"
import KeyValueGamedataViewer from "./Viewers/GamedataViewer/KeyValueGamedataViewer"
import ImageViewer from "./Viewers/ImageViewer";
import TemplativeAccessTools from "../TemplativeAccessTools"
import RulesEditor from "./Viewers/RulesEditor";
import EditPanelTabs from "./EditPanelTabs";

import "./EditPanel.css"
import "./EditPanelTabs.css"

export default class EditPanel extends React.Component {       
    render() {
        var components = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "component-compose.json")
        var filepathSplit = this.props.currentFilepath.replace(/\\/g,"/").replace(/^\/|\/$/g, '').split("/").join(" > ")
        return <div className='mainBody row '>
            <div className='col-3 left-column'>
                <TemplativeProjectRenderer 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} 
                    currentFileType={this.props.currentFileType}
                    currentFilepath={this.props.currentFilepath} 
                    clearViewedFileCallback={this.props.clearViewedFileCallback}
                    updateViewedFileCallback={this.props.updateViewedFileCallback}
                    openComponentsCallback={this.props.openComponentsCallback}
                    openStudioGamedataCallback={this.props.openStudioGamedataCallback}
                    openGameGamedataCallback={this.props.openGameGamedataCallback}
                    openRulesCallback={this.props.openRulesCallback}
                />
            </div>
            <div className='col-9 viewer'>
                <EditPanelTabs 
                    currentFilepath={this.props.currentFilepath} 
                    tabbedFiles={this.props.tabbedFiles}
                    updateViewedFileCallback={this.props.updateViewedFileCallback}
                    closeAllTabsCallback={this.props.closeAllTabsCallback}
                    closeTabAtIndexCallback={this.props.closeTabAtIndexCallback}
                    closeTabsToLeftCallback={this.props.closeTabsToLeftCallback}
                    closeTabsToRightCallback={this.props.closeTabsToRightCallback}
                    closeAllTabsButIndexCallback={this.props.closeAllTabsButIndexCallback}
                />
                <div className="filename-row">
                    <p className="filename-title">{filepathSplit}</p>
                </div>
                <div className="file-contents">
                    {this.props.currentFileType === "RULES" &&
                        <RulesEditor 
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            filename={this.props.filename} fileContents={this.props.fileContents} currentFilepath={this.props.currentFilepath}/>
                    }
                    {this.props.currentFileType === "ARTDATA" &&
                        <ArtdataViewer filename={this.props.filename} fileContents={this.props.fileContents} currentFilepath={this.props.currentFilepath}/>
                    }
                    {this.props.currentFileType === "ART" &&
                        <ImageViewer filename={this.props.filename} fileContents={this.props.fileContents} currentFilepath={this.props.currentFilepath}/>
                    }
                    {this.props.currentFileType === "PIECE_GAMEDATA" &&
                        <PieceGamedataViewer filename={this.props.filename} fileContents={this.props.fileContents} currentFilepath={this.props.currentFilepath}/>
                    }
                    {this.props.currentFileType === "KEYVALUE_GAMEDATA" &&
                        <KeyValueGamedataViewer filename={this.props.filename} fileContents={this.props.fileContents} currentFilepath={this.props.currentFilepath}/>
                    }
                    {this.props.currentFileType === "COMPONENTS" && 
                        <ComponentsViewer 
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            componentsFilepath={this.props.currentFilepath} 
                            components={components}
                        />
                    }
                </div>
            </div>
            
      </div>
    }
}