import React from "react";
import "./EditPanel.css"
import "./EditPanelTabs.css"
import EditPanelTab from "./EditPanelTab";
const path = window.require("path");

export default class EditPanelTabs extends React.Component {       
    render() {
        return <div className="nav nav-tabs">
            {this.props.tabbedFiles.map((tabbedFile, index) => {
                return <EditPanelTab 
                    key={tabbedFile.filepath} 
                    index={index}
                    closeTabsCallback={this.props.closeTabsCallback}
                    closeTabAtIndexCallback={this.props.closeTabAtIndexCallback}
                    updateViewedFileCallback={this.props.updateViewedFileCallback}
                    tabbedFile={tabbedFile} 
                    currentFilepath={this.props.currentFilepath}
                />
            
            })}
        </div>
    }
}