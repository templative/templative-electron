import React from "react";
import ContextMenu from "../../../ContextMenu";
import RenameableFile from "./RenameableFile";

import "./ContentFiles.css"

const path = require("path");
const shell = require('electron').shell;

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
    startRenamingFileAsync = async () => {
        this.setState({
            isShowingContextMenu: false,
            isRenamingFile: true
        })
    }
    submitFileRenameAsync = async (originalFilepath, newFilename) => {
        await this.props.renameFileAsyncCallback(originalFilepath, newFilename)
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
    openInDefaultAppAsync = async () => {
        shell.openPath(this.props.filepath);
    }
    render() {
        var openFileAsyncCallback = async () => await this.props.updateViewedFileUsingExplorerAsyncCallback(this.props.contentType, this.props.filepath)
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
                        {name: "Open", callback: openFileAsyncCallback},
                        {name: "Open in Default App", callback: this.openInDefaultAppAsync},
                        {name: "Duplicate", callback: async () => await this.props.duplicateFileAsyncCallback(this.props.filepath)},
                        {name: "Rename", callback: this.startRenamingFileAsync},
                        {name: "Delete", callback: async () => await this.props.deleteFileAsyncCallback(this.props.filepath)},
                    ]}
                    closeContextMenuCallback={this.closeContextMenu}
                />
            }
            <RenameableFile 
                renameFileCallback={this.submitFileRenameAsync}
                contentType={this.props.contentType}
                directoryPath={this.props.directoryPath}
                referenceCount={this.props.referenceCount}
                cancelRenamingCallback={this.cancelRenamingFile}
                filepath={this.props.filepath}
                isRenaming={this.state.isRenamingFile}
                onClickCallback={openFileAsyncCallback} 
            />
        </div>
    }
}