import React from "react";
import "./ResourceHeader.css"
import ContextMenu from "../../../ContextMenu";

const {shell} = require('electron')

export default class ResourceHeader extends React.Component {   
    state = {
        isHovering: false,
        isShowingContextMenu: false,
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
    handleMouseDown = async (event) => {
        if (event.button !== 0) { return }
        if (event.currentTarget !== event.target) {
            event.stopPropagation()
        }
        await this.props.toggleExtendedAsyncCallback()
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    async openFolderAsync() {
        shell.openPath(this.props.directory);
    }
    render() {
        var commands = [
            {name: "View Folder", callback: async () => await this.openFolderAsync()},
        ]
        if (this.props.startCreatingNewFileAsyncCallback !== undefined){
            commands.unshift({name: "Create New File", callback: async () => await this.props.startCreatingNewFileAsyncCallback()}) 
        }
        var chevron = this.props.isExtended ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-down resource-header-chevron" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-right resource-header-chevron" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg>
        
        return <div 
                className="resourcesheader-wrapper"
                
                onMouseOver={this.handleMouseOver}
                onMouseLeave={this.handleMouseOut}
                onMouseDown={this.handleMouseDown}
                onContextMenu={this.handleRightClick}
            >
            { this.state.isShowingContextMenu && 
                <ContextMenu 
                    left={this.state.contextCoordinatesX} 
                    top={this.state.contextCoordinatesY}
                    commands={commands}
                    closeContextMenuCallback={this.closeContextMenu}
                />
            }
            <div className="resourceHeaderContent">
                <p className="resourcesHeader">
                    <span style={{ marginLeft: `${((this.props.depth || 0) * 16)+8}px` }}/>{chevron}<img className="tab-icon" src={this.props.iconSource} alt="Tab icon"/>{this.props.header}
                </p>
            </div>
        </div> 
    }
}