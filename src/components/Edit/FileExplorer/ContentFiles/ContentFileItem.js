import React from "react";
import ContextMenu from "../../../ContextMenu";
import RenameableFile from "./RenameableFile";

import "./ContentFiles.css"

const path = window.require("path");
const shell = window.require('electron').shell;

export default class ContentFileItem extends React.Component {   
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
    startRenamingFile = () => {
        this.setState({
            isShowingContextMenu: false,
            isRenamingFile: true
        })
    }
    submitFileRename = (originalFilepath, newFilename) => {
        this.props.renameFileCallback(originalFilepath, newFilename)
        this.setState({
            isRenamingFile: false
        })
    }
    parsePathForCommonPath() {
        return path.relative(this.props.directoryPath, this.props.filepath).split(".")[0]
    }
    cancelRenamingFile = () => {
        this.setState({
            isRenamingFile: false
        })
    }
    openInDefaultApp = () => {
        shell.openPath(this.props.filepath);
    }
    render() {
        var callback = () => this.props.updateViewedFileUsingExplorerCallback(this.props.contentType, this.props.filepath)
        return <div 
            className={`content-file-item-wrapper ${this.props.isSelected && "selected-content-file-item-wrapper"}`} 
            key={this.props.filepath} 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            onContextMenu={this.handleRightClick}
        >
            { this.state.isShowingContextMenu && 
                <ContextMenu 
                    left={this.state.contextCoordinatesX} 
                    top={this.state.contextCoordinatesY}
                    commands={[
                        {name: "Open", callback: callback},
                        {name: "Open in Default App", callback: this.openInDefaultApp},
                        {name: "Duplicate", callback: () => this.props.duplicateFileCallback(this.props.filepath)},
                        {name: "Rename", callback: this.startRenamingFile},
                        {name: "Delete", callback: () => this.props.deleteFileCallback(this.props.filepath)},
                    ]}
                    closeContextMenuCallback={this.closeContextMenu}
                />
            }
            <RenameableFile 
                renameFileCallback={this.submitFileRename}
                cancelRenamingCallback={this.cancelRenamingFile}
                filepath={this.props.filepath}
                isRenaming={this.state.isRenamingFile}
                onClickCallback={callback} 
                filename={path.parse(this.props.filepath).name}
            />
        </div>
    }
}