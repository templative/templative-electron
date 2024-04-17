import React from "react";
import "./EditPanel.css"
import "./EditPanelTabs.css"
import EditPanelTab from "./EditPanelTab";

export default class EditPanelTabs extends React.Component {       
    render() {
        return <div className="nav nav-tabs d-flex flex-nowrap edit-panel-tabs">
            {this.props.tabbedFiles.map((tabbedFile, index) => {
                return <EditPanelTab 
                    isItalics={this.props.italicsTabFilepath === tabbedFile.filepath}
                    key={tabbedFile.filepath} 
                    index={index}
                    closeAllTabsAsyncCallback={this.props.closeAllTabsAsyncCallback}
                    closeTabAtIndexAsyncCallback={this.props.closeTabAtIndexAsyncCallback}
                    closeTabsToLeftAsyncCallback={this.props.closeTabsToLeftAsyncCallback}
                    closeTabsToRightAsyncCallback={this.props.closeTabsToRightAsyncCallback}
                    closeAllTabsButIndexAsyncCallback={this.props.closeAllTabsButIndexAsyncCallback}
                    updateViewedFileUsingTabAsyncCallback={this.props.updateViewedFileUsingTabAsyncCallback}
                    tabbedFile={tabbedFile} 
                    currentFilepath={this.props.currentFilepath}
                />
            
            })}
        </div>
    }
}