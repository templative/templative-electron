/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./EditPanel.css"
import "./EditPanelTabs.css"
import ContextMenu from "../ContextMenu";

import artDataIcon from "./Icons/artDataIcon.svg"
import artIcon from "./Icons/artIcon.svg"
import componentComposeIcon from "./Icons/componentComposeIcon.svg"
import pieceIcon from "./Icons/pieceIcon.svg"
import rulesIcon from "./Icons/rulesIcon.svg"

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
        shell.openPath(this.props.tabbedFile.filepath);
    }
    openDirectoryAsync = async () => {
        shell.openPath(path.parse(this.props.tabbedFile.filepath).dir)
    }
    render() {
        var iconSource = componentComposeIcon
        if (this.props.tabbedFile.filetype === "RULES") {
            iconSource = rulesIcon
        }
        if (this.props.tabbedFile.filetype === "COMPONENTS") {
            iconSource = componentComposeIcon
        }
        if (this.props.tabbedFile.filetype === "KEYVALUE_GAMEDATA" || this.props.tabbedFile.filetype === "PIECE_GAMEDATA") {
            iconSource = pieceIcon
        }
        if (this.props.tabbedFile.filetype === "ART") {
            iconSource = artIcon
        }
        if (this.props.tabbedFile.filetype === "ARTDATA") {
            iconSource = artDataIcon
        }
        var isSelected = this.props.tabbedFile.filepath === this.props.currentFilepath
        var shouldShowX = (this.state.isHovering || isSelected) && this.props.tabbedFile.canClose
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
                <img className="tab-icon" src={iconSource} alt="Tab icon"/>
                {path.parse(this.props.tabbedFile.filepath).name}
                {this.props.tabbedFile.canClose && 
                    <button 
                        onMouseOver={this.handleMouseOverX}
                        onMouseLeave={this.handleMouseOutX}
                        type="button" 
                        className={`btn-close btn-close-white tab-x-button ${shouldShowX && "visible-x-button"}`}
                        aria-label="Close"
                        onClick={() => this.props.closeTabAtIndexAsyncCallback(this.props.index)}
                    />
                } 
                
            </a>
        </li>
    }
}