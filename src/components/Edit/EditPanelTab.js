import React from "react";
import "./EditPanel.css"
import "./EditPanelTabs.css"
import ContextMenu from "../ContextMenu";
const path = window.require("path");
const shell = window.require('electron').shell;

export default class EditPanelTab extends React.Component {       
    state = {
        isHovering: false,
        isHoveringX: false,
        isShowingContextMenu: false
    }
    handleRightClick = (e) => {
        if (this.state.isRenamingFile) {
            return
        }
        this.setState({
            isShowingContextMenu: !this.state.isShowingContextMenu,
            contextCoordinatesX: e.pageX,
            contextCoordinatesY: e.pageY,
        })
    }
    closeContextMenu = () => {
        this.setState({
            isShowingContextMenu: false
        })
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    handleMouseOverX = () => {
        this.setState({isHoveringX: true})
    }
    handleMouseOutX = () => {
        this.setState({isHoveringX: false})
    }
    viewTabFile = () => {
        if (this.state.isHoveringX || this.state.isShowingContextMenu) {
            return
        }
        this.props.updateViewedFileCallback(this.props.tabbedFile.filetype, this.props.tabbedFile.filepath)
    }
    openInDefaultApplication = () => {
        shell.openPath(this.props.tabbedFile.filepath);
    }
    openDirectory = () => {
        shell.openPath(path.parse(this.props.tabbedFile.filepath).dir)
    }
    render() {
        var isSelected = this.props.tabbedFile.filepath === this.props.currentFilepath
        var shouldShowX = (this.state.isHovering || isSelected) && this.props.tabbedFile.canClose
        return <li 
            className="nav-item"
            onClick={this.viewTabFile}
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            onContextMenu={this.handleRightClick}
        >
            { this.state.isShowingContextMenu && 
                <ContextMenu 
                    left={this.state.contextCoordinatesX} 
                    top={this.state.contextCoordinatesY}
                    commands={this.props.tabbedFile.canClose ? [
                        {name: "Open in Default App", callback: this.openInDefaultApplication}, 
                        {name: "Open Container Directory", callback: this.openDirectory}, 
                        {name: "Close", callback: () => this.props.closeTabAtIndexCallback(this.props.index)},
                        {name: "Close Others", callback: ()=>this.props.closeAllTabsButIndexCallback(this.props.index)},
                        {name: "Close to the Left", callback: ()=>this.props.closeTabsToLeftCallback(this.props.index)},
                        {name: "Close to the Right", callback: ()=>this.props.closeTabsToRightCallback(this.props.index)},
                        {name: "Close All", callback: ()=>this.props.closeAllTabsCallback()},
                    ] : [
                        {name: "Open in Default App", callback: this.openInDefaultApplication}, 
                        {name: "Open Container Directory", callback: this.openDirectory}
                    ]}
                    closeContextMenuCallback={this.closeContextMenu}
                />
            }
            <a className={`nav-link ${isSelected && "active"}`}>
                {path.parse(this.props.tabbedFile.filepath).name}
                {this.props.tabbedFile.canClose && 
                    <button 
                        onMouseOver={this.handleMouseOverX}
                        onMouseLeave={this.handleMouseOutX}
                        type="button" 
                        class={`btn-close btn-close-white tab-x-button ${shouldShowX && "visible-x-button"}`}
                        aria-label="Close"
                        onClick={() => this.props.closeTabAtIndexCallback(this.props.index)}
                    />
                } 
                
            </a>
        </li>
    }
}