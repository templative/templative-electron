import React from "react";
import "./Gamedata.css"
import ContextMenu from "../../../ContextMenu";
import RenameableFile from "../RenameableFile";
const path = window.require("path");

export default class GamedataItem extends React.Component {   
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
    cancelRenamingFile = () => {
        this.setState({
            isRenamingFile: false
        })
    }
    render() {
        var callback = () => this.props.updateViewedFileCallback(this.props.gamedataType, this.props.filepath)
        return <div 
            className={this.props.isSelected ? "gamedataItemWrapper selected" : "gamedataItemWrapper"} 
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