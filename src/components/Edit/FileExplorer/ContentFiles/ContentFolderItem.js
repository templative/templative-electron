import React from "react";
import ContextMenu from "../../../ContextMenu.js";
import RenameableFolder from "./RenameableFolder.js";
import "./ContentFiles.css"

const path = require("path");
const shell = require('electron').shell;

export default class ContentFolderItem extends React.Component {   
    state = {
        isHovering: false,
        isShowingContextMenu: false,
        contextCoordinatesX: 0,
        contextCoordinatesY: 0,
        isRenamingFolder: false
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    handleRightClick = (e) => {
        if (this.state.isRenamingFolder) {
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
    startRenamingFolderAsync = async () => {
        this.setState({
            isShowingContextMenu: false,
            isRenamingFolder: true
        })
    }
    submitFolderRenameAsync = async (originalFilepath, newDirectoryName) => {
        await this.props.changeExtendedDirectoryAsyncCallback(!this.props.isExtended, originalFilepath)
        await this.props.renameFileAsyncCallback(originalFilepath, newDirectoryName)
        await this.props.changeExtendedDirectoryAsyncCallback(this.props.isExtended, this.props.filepath)
        this.setState({
            isRenamingFolder: false
        })
    }
    parsePathForCommonPath() {
        return path.relative(this.props.directoryPath, this.props.filepath).split(".")[0]
    }
    cancelRenamingFolder = () => {
        this.setState({
            isRenamingFolder: false
        })
    }
    static convertToOsPath = (filepath) => {
        if (filepath.split(path.sep).length === 1) {
            var seperatedBy = path.sep === "//" ? "\\" : "/" 
            return filepath.replaceAll(seperatedBy, path.sep)
        }
        return filepath
    }
    openFolderAsync = async () => {
        shell.openPath(ContentFolderItem.convertToOsPath(this.props.filepath));
    }
    handleMouseDownAsync = async (event) => {
        if (event.button !== 0) { return }
        await this.props.changeExtendedDirectoryAsyncCallback(!this.props.isExtended, this.props.filepath)
    }
    render() {        
        return <div 
            className={`content-file-item-wrapper ${this.props.isSelected && "selected-content-file-item-wrapper"}`} 
            key={this.props.filepath} 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            onContextMenu={this.handleRightClick}
            onMouseDown={this.handleMouseDownAsync}
        >
            { this.state.isShowingContextMenu && 
                <ContextMenu 
                    left={this.state.contextCoordinatesX} 
                    top={this.state.contextCoordinatesY}
                    commands={[
                        {name: "Open Folder", callback: this.openFolderAsync},
                        {name: "Rename", callback: this.startRenamingFolderAsync},
                        {name: "Delete", callback: async () => await this.props.deleteFolderAsyncCallback(this.props.filepath)},
                    ]}
                    closeContextMenuCallback={this.closeContextMenu}
                />
            }
            <RenameableFolder 
                isExtended={this.props.isExtended}
                renameFolderAsyncCallback={this.submitFolderRenameAsync}
                contentType={this.props.contentType}
                depth={this.props.depth}
                directoryPath={this.props.directoryPath}
                cancelRenamingCallback={this.cancelRenamingFolder}
                filepath={this.props.filepath}
                isRenaming={this.state.isRenamingFolder}
            />
        </div>
    }
}