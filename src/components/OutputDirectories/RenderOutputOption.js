import React from "react";
import "../Render/RenderPanel.css"
import ContextMenu from "../ContextMenu";
const {shell} = require('electron')
const path = require("path")
const fs = require("fs/promises");
const fsOld = require('fs');

export default class RenderOutputOption extends React.Component {  
    state = {
        isHovering: false,
        gameName: "",
        versionName: "",
        versionNumber: "",
        timestamp: undefined,
        isShowingContextMenu: false,
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
    openFolder() {
        shell.openPath(path.join(this.props.directory.path, this.props.directory.name));
    }
    getDirectoryPath = () => path.join(this.props.directory.path, this.props.directory.name)

    static #parseTimeStamp = (timestamp) => {
        var timestampComponents = timestamp.split("_")
        var timeOfDayComponents = timestampComponents[1].split("-")
        var dateTime = new Date(`${timestampComponents[0]}T${timeOfDayComponents[0]}:${timeOfDayComponents[1]}:${timeOfDayComponents[2]}`)
        return dateTime.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric", hour: '2-digit', minute:'2-digit'}) 
    }
    static doesFileExist = async (filepath) => {
        console.log(filepath)
        try {
          await fs.stat(filepath);
          return true;
        } catch {
          return false;
        }
      }
    #getGameInformation = async () => {
        const gameJsonFilepath = path.join(this.getDirectoryPath(), "game.json")
        if (!await RenderOutputOption.doesFileExist(gameJsonFilepath)) {
            console.log("doesnt exist")
            return
        }
        const gameJsonFile = JSON.parse(await fs.readFile(gameJsonFilepath))
        this.setState({
            gameDisplayName: gameJsonFile["displayName"],
            versionName: gameJsonFile["versionName"],
            versionNumber: gameJsonFile["version"],
            timestamp: RenderOutputOption.#parseTimeStamp(gameJsonFile["timestamp"]),
            componentFilter: gameJsonFile["componentFilter"]
        })
    }
    #stopWatchingGameJsonForChanges = () => {
        if (this.outputFolderWatcher === undefined) {
            return
        }
        this.outputFolderWatcher.close();
        this.outputFolderWatcher = undefined;
    }
    #watchGameJsonForChanges = async () => {
        this.#stopWatchingGameJsonForChanges()            
        this.outputFolderWatcher = fsOld.watch(this.getDirectoryPath(), async (event, filename) => {
            await this.#getGameInformation()
        })
        await this.#getGameInformation()
    }
    componentDidMount = async () => {
        if (this.props.directory === undefined) {
            return
        }
        await this.#watchGameJsonForChanges()        
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.directory === prevProps.directory) {
            return
        }
        this.#stopWatchingGameJsonForChanges()            
        if (this.props.directory === undefined) {
            return
        }
        await this.#watchGameJsonForChanges()
    }
    openFolderAsync = async () => {
        shell.openPath(this.getDirectoryPath());
    }
    deleteFolderAsync = async () => {

    }
    render() {
        const isSelected = this.props.selectedDirectory === this.getDirectoryPath()
        var commands = [
            {name: "View Folder", callback: async () => await this.openFolderAsync()},
            // {name: "Delete Folder", callback: async () => await this.deleteFolder()},
        ]

        return <div className={`render-output-option ${isSelected && "selected-output-directory"}`} 
                onClick={async () => await this.props.selectDirectoryAsyncCallback(this.props.directory.name)}
                onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut}
                onContextMenu={this.handleRightClick}
            >
                { this.state.isShowingContextMenu && 
                    <ContextMenu 
                        left={this.state.contextCoordinatesX} 
                        top={this.state.contextCoordinatesY}
                        commands={commands}
                        closeContextMenuCallback={this.closeContextMenu}
                    />
                }
            <p className="render-output-name">{this.state.gameDisplayName}</p>
            <p className="render-output-version-name">- {this.state.versionName}</p>
            <p className="render-output-version">v{this.state.versionNumber}</p>
            <p className="render-output-component-filter">{this.state.componentFilter}</p>
            <p className="render-output-date">{this.state.timestamp}</p>
        </div>
        
    }
}