/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./EditPanel.css"
import "./EditPanelTabs.css"
import ContextMenu from "../ContextMenu";

import UnifiedComponentIcon from "./Icons/unifiedComponentIcon.svg?react"
import StockIcon from "./Icons/stockIcon.svg?react"

export default class UnifiedComponentTab extends React.Component {       
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
    viewTabFileAsync = async () => {
        if (this.state.isHoveringX || this.state.isShowingContextMenu) {
            return
        }
        const componentName = this.props.tabbedFile.filepath.split("#")[1]
        await this.props.updateViewedFileToUnifiedAsyncCallback(componentName)
    }
    render() {
        var isSelected = this.props.tabbedFile.filepath === this.props.currentFilepath
        var shouldShowX = (this.state.isHovering || isSelected) && this.props.tabbedFile.canClose
        
        var tabName = this.props.tabbedFile.filepath.split("#")[1]
        var IconElement = this.props.tabbedFile.filetype === "UNIFIED_COMPONENT" ? UnifiedComponentIcon : StockIcon

        return <li 
            className="nav-item"
            onClick={this.viewTabFileAsync}
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            onContextMenu={this.handleRightClick}
        >
            { this.state.isShowingContextMenu && 
                <ContextMenu 
                    left={this.state.contextCoordinatesX} 
                    top={this.state.contextCoordinatesY}
                    commands={[
                        {name: "Close", callback: async () => await this.props.closeTabAtIndexAsyncCallback(this.props.index)},
                        {name: "Close Others", callback: async () => await this.props.closeAllTabsButIndexAsyncCallback(this.props.index)},
                        {name: "Close to the Left", callback: async () => await this.props.closeTabsToLeftAsyncCallback(this.props.index)},
                        {name: "Close to the Right", callback: async () => await this.props.closeTabsToRightAsyncCallback(this.props.index)},
                        {name: "Close All", callback: async () => await this.props.closeAllTabsAsyncCallback()},
                    ]}
                    closeContextMenuCallback={this.closeContextMenu}
                />
            }
            
            <a className={`nav-link ${isSelected && "active"} ${this.props.isItalics && "italics-tab"}`}>
                <IconElement className="tab-icon"/>
                {tabName}
                {this.props.tabbedFile.canClose && 
                    <button 
                        onMouseOver={this.handleMouseOverX}
                        onMouseLeave={this.handleMouseOutX}
                        type="button" 
                        className={`btn-close btn-close-white tab-x-button ${shouldShowX && "visible-x-button"}`}
                        aria-label="Close"
                        onClick={async () => await this.props.closeTabAtIndexAsyncCallback(this.props.index)}
                    />
                } 
                
            </a>
        </li>
    }
}