import React from "react";
import ContextMenu from "../../../ContextMenu";

import "./ContentFiles.css"

import componentComposeIcon from "../../Icons/componentComposeIcon.svg?react"
import gameIcon from "../../Icons/gameIcon.svg?react"
import studioIcon from "../../Icons/studioIcon.svg?react"
import gamecrafterIcon from "../../Icons/gameCrafterIcon.svg?react"
import rulesIcon from "../../Icons/rulesIcon.svg?react"

const path = require("path");
const shell = require('electron').shell;

export default class IconContentFileItem extends React.Component {   
    state = {
        isHovering: false,
        isShowingContextMenu: false,
        contextCoordinatesX: 0,
        contextCoordinatesY: 0,
        isRenamingFile: false
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
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
    
    parsePathForCommonPath() {
        return path.relative(this.props.directoryPath, this.props.filepath).split(".")[0]
    }
    openInDefaultAppAsync = async () => {
        if (this.props.filepath === undefined) {
            return
        }
        shell.openPath(this.props.filepath);
    }
    render() {
        var openFileAsyncCallback = async () => await this.props.updateViewedFileUsingExplorerAsyncCallback(this.props.contentType, this.props.filepath)
        var isSelected = this.props.currentFilepath !== undefined && path.normalize(this.props.currentFilepath) === path.normalize(this.props.filepath)
        var icons = {
            "RULES": rulesIcon,
            "COMPONENTS": componentComposeIcon,
            "UNIFIED_COMPONENT": componentComposeIcon,
            "UNIFIED_STOCK": componentComposeIcon,
            "GAME_GAMEDATA": gameIcon,
            "STUDIO_GAMEDATA": studioIcon,
            "GAMECRAFTER": gamecrafterIcon,
        }
        var Icon = rulesIcon
        if (icons[this.props.contentType] !== undefined) {
            Icon = icons[this.props.contentType]
        }
        var numberSpaces = this.props.depth || 0

        var filename = path.parse(this.props.filepath).name
        
        if (this.props.contentType === "COMPONENTS") {
            filename = "project"
        }
        else if (this.props.contentType === "UNIFIED_COMPONENT" || this.props.contentType === "UNIFIED_STOCK") {
            filename = this.props.filepath.split("#")[1]
        }

        return <div 
            className={`icon-content-file-item-wrapper ${isSelected && "selected-content-file-item-wrapper"}`} 
            key={this.props.filepath} 
            onClick={openFileAsyncCallback}
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            onContextMenu={this.handleRightClick}
        >
            { this.state.isShowingContextMenu && 
                <ContextMenu 
                    left={this.state.contextCoordinatesX} 
                    top={this.state.contextCoordinatesY}
                    commands={[
                        {name: "Open", callback: openFileAsyncCallback},
                        {name: "Open in Default App", callback: this.openInDefaultAppAsync},
                    ]}
                    closeContextMenuCallback={this.closeContextMenu}
                />
            }
            <p className={`renameable-file`}>
                <span style={{ marginLeft: `${(numberSpaces * 16) + 8}px` }}/>
                {(this.props.hasIcon==undefined || this.props.hasIcon) && <Icon className="tab-icon"/>}
                {filename}
            </p>
        </div>
    }
}