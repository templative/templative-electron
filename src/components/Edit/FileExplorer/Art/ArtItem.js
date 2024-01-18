import React from "react";
import "./Art.css"
import ContextMenu from "../../../ContextMenu";
import RenameableFile from "../RenameableFile";
const path = window.require("path");
const shell = window.require('electron').shell;
var debounceDurationMilliseconds = 3000

export default class ArtItem extends React.Component {   
    state = {
        isHovering: false,
        lastLaunchTime: this.getCurrentTime(),
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
    getCurrentTime() {
        return new Date().getTime()
    }
    openFile = () => {
        if (this.getCurrentTime() - this.state.lastLaunchTime < debounceDurationMilliseconds) {
            return
        }
        shell.openPath(this.props.filepath);
        this.setState({
            lastLaunchTime: this.getCurrentTime()
        })
    }
    parsePathForCommonPath() {
        return path.relative(this.props.directoryPath, this.props.filepath).split(".")[0]
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
    cancelRenamingFile = () => {
        this.setState({
            isRenamingFile: false
        })
    }
    render() {
        var callback = () => this.props.updateViewedFileCallback("ART", this.props.filepath)
        return <div className="artItemWrapper"
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
                        {name: "Open in Default SVG Viewer", callback: this.openFile},
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
                filename={this.parsePathForCommonPath()}
            />
        </div>
    }
}