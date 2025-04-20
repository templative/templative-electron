/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./EditPanel.css"
import "./EditPanelTabs.css"
import ContextMenu from "../ContextMenu";

import artDataIcon from "./Icons/artDataIcon.svg?react"
import artIcon from "./Icons/artIcon.svg?react"
import componentComposeIcon from "./Icons/componentComposeIcon.svg?react"
import pieceIcon from "./Icons/pieceIcon.svg?react"
import gameCrafterIcon from "./Icons/gameCrafterIcon.svg?react"
import gameIcon from "./Icons/gameIcon.svg?react"
import studioIcon from "./Icons/studioIcon.svg?react"
import componentIcon from "./Icons/componentIcon.svg?react"
import rulesIcon from "./Icons/rulesIcon.svg?react"
import settingsIcon from "./Icons/settingsIcon.svg?react"

const path = require("path");
const shell = require('electron').shell;

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
    viewTabFileAsync = async () => {
        if (this.state.isHoveringX || this.state.isShowingContextMenu) {
            return
        }
        await this.props.updateViewedFileUsingTabAsyncCallback(this.props.tabbedFile.filetype, this.props.tabbedFile.filepath)
    }
    openInDefaultApplicationAsync = async () => {
        if (this.props.tabbedFile === undefined || this.props.tabbedFile.filepath === undefined) {
            return
        }
        shell.openPath(this.props.tabbedFile.filepath);
    }
    openDirectoryAsync = async () => {
        if (this.props.tabbedFile === undefined || this.props.tabbedFile.filepath === undefined) {
            return
        }
        shell.openPath(path.parse(this.props.tabbedFile.filepath).dir)
    }
    render() {
        var icons = {
            "RULES": rulesIcon,
            "COMPONENTS": componentComposeIcon,
            "COMPONENT_GAMEDATA": componentIcon,
            "PIECE_GAMEDATA": pieceIcon,
            "GAMECRAFTER": gameCrafterIcon,
            "ART": artIcon,
            "ARTDATA": artDataIcon,
            "STUDIO_GAMEDATA": studioIcon,
            "GAME_GAMEDATA": gameIcon,
            "SETTINGS": settingsIcon,
        }
        var IconElement = icons[this.props.tabbedFile.filetype]
        
        var isSelected = this.props.tabbedFile.filepath === this.props.currentFilepath
        var shouldShowX = (this.state.isHovering || isSelected) && this.props.tabbedFile.canClose
        
        var tabName = path.parse(this.props.tabbedFile.filepath).name
        if (this.props.tabbedFile.filetype === "COMPONENTS") {
            tabName = "project"
        }
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
                    commands={this.props.tabbedFile.canClose ? [
                        {name: "Open in Default App", callback: this.openInDefaultApplicationAsync}, 
                        {name: "Open Container Directory", callback: this.openDirectoryAsync}, 
                        {name: "Close", callback: async () => await this.props.closeTabAtIndexAsyncCallback(this.props.index)},
                        {name: "Close Others", callback: async () => await this.props.closeAllTabsButIndexAsyncCallback(this.props.index)},
                        {name: "Close to the Left", callback: async () => await this.props.closeTabsToLeftAsyncCallback(this.props.index)},
                        {name: "Close to the Right", callback: async () => await this.props.closeTabsToRightAsyncCallback(this.props.index)},
                        {name: "Close All", callback: async () => await this.props.closeAllTabsAsyncCallback()},
                    ] : [
                        {name: "Open in Default App", callback: this.openInDefaultApplicationAsync}, 
                        {name: "Open Container Directory", callback: this.openDirectoryAsync}
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