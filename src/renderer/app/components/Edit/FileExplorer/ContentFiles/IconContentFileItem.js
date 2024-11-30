import React from "react";
import ContextMenu from "../../../ContextMenu";

import "./ContentFiles.css"

import componentComposeIcon from "../../Icons/componentComposeIcon.svg"
import gameIcon from "../../Icons/gameIcon.svg"
import studioIcon from "../../Icons/studioIcon.svg"
import gamecrafterIcon from "../../Icons/gameCrafterIcon.svg"
import rulesIcon from "../../Icons/rulesIcon.svg"

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
        shell.openPath(this.props.filepath);
    }
    render() {
        var openFileAsyncCallback = async () => await this.props.updateViewedFileUsingExplorerAsyncCallback(this.props.contentType, this.props.filepath)
        var isSelected = this.props.currentFilepath !== undefined && path.normalize(this.props.currentFilepath) === path.normalize(this.props.filepath)
        var icons = {
            "RULES": rulesIcon,
            "COMPONENTS": componentComposeIcon,
            "GAME_GAMEDATA": gameIcon,
            "STUDIO_GAMEDATA": studioIcon,
            "GAMECRAFTER": gamecrafterIcon,
        }
        var icon = rulesIcon
        if (icons[this.props.contentType] !== undefined) {
            icon = icons[this.props.contentType]
        }
        var numberSpaces = this.props.depth || 0
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
                <img src={icon} className="tab-icon"/>{path.parse(this.props.filepath).name}
            </p>
        </div>
    }
}