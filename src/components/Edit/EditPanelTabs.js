import React from "react";
import "./EditPanel.css"
import "./EditPanelTabs.css"
import EditPanelTab from "./EditPanelTab";

export default class EditPanelTabs extends React.Component {       
    render() {
        return <div className="nav nav-tabs d-flex flex-nowrap">
            {this.props.tabbedFiles.map((tabbedFile, index) => {
                return <EditPanelTab 
                    key={tabbedFile.filepath} 
                    index={index}
                    closeAllTabsCallback={this.props.closeAllTabsCallback}
                    closeTabAtIndexCallback={this.props.closeTabAtIndexCallback}
                    closeTabsToLeftCallback={this.props.closeTabsToLeftCallback}
                    closeTabsToRightCallback={this.props.closeTabsToRightCallback}
                    closeAllTabsButIndexCallback={this.props.closeAllTabsButIndexCallback}
                    updateViewedFileCallback={this.props.updateViewedFileCallback}
                    tabbedFile={tabbedFile} 
                    currentFilepath={this.props.currentFilepath}
                />
            
            })}
        </div>
    }
}