import React from "react";
import "./OutputExplorer.css"
import PrintPanel from "./PrintExporting/PrintPanel";
import UploadPanel from "./Upload/UploadPanel";
import SimulatorPanel from "./Simulator/SimulatorPanel"
import PlaygroundPanel from "./Playground/PlaygroundPanel";
import RenderedImages from "./RenderedImages/RenderedImages";
import RulesViewer from "./Rules/RulesViewer";
import { PostRenderOptions, RenderingWorkspaceContext } from "../RenderingWorkspaceProvider";

const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');


export default class OutputExplorer extends React.Component { 
    static contextType = RenderingWorkspaceContext; 
    state = {
        gameName: "",
        versionName: "",
        versionNumber: "",
        timestamp: undefined,
        componentDirectories: [],
        totalFiles: 1,
        doneFiles: 1,
        typeQuantities: {}
    }  
    static #parseTimeStamp = (timestamp) => {
        if (!timestamp) {
            return undefined;
        }
        try {
            const timestampComponents = timestamp.split("_");
            if (timestampComponents.length < 2) {
                return undefined;
            }
            
            const timeOfDayComponents = timestampComponents[1].split("-");
            if (timeOfDayComponents.length < 3) {
                return undefined;
            }

            const dateTime = new Date(
                `${timestampComponents[0]}T${timeOfDayComponents[0]}:${timeOfDayComponents[1]}:${timeOfDayComponents[2]}`
            );
            
            if (isNaN(dateTime.getTime())) {
                return undefined;
            }

            return dateTime.toLocaleDateString('en-us', { 
                year: "numeric", 
                month: "short", 
                day: "numeric", 
                hour: '2-digit', 
                minute: '2-digit'
            });
        } catch (error) {
            console.warn("Error parsing timestamp:", error);
            return undefined;
        }
    }
    #getGameInformation = async () => {
        const gameJsonFilepath = path.join(this.props.outputFolderPath, "game.json")
        const gameJsonFile = JSON.parse(await fs.readFile(gameJsonFilepath))
        this.setState({
            gameDisplayName: gameJsonFile["displayName"],
            versionName: gameJsonFile["versionName"],
            versionNumber: gameJsonFile["version"],
            componentFilter: gameJsonFile["componentFilter"],
            gameJsonFile: gameJsonFile,
            timestamp: OutputExplorer.#parseTimeStamp(gameJsonFile["timestamp"]),
        })
    }
    #getOutputComponentDirectories = async () => {
        var componentDirectories = await fs.readdir(this.props.outputFolderPath, { withFileTypes: true, })
        componentDirectories = componentDirectories
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(this.props.outputFolderPath, dirent.name))
        var customComponentDirectories = []
        var fileCountForCompleteRender = 0
        var doneFiles = 0
        var typeQuantities = {}
        for(var i in componentDirectories) {
            var componentDirectory = componentDirectories[i]
            var fileExtensions = await fs.readdir(componentDirectory, { withFileTypes: true, })
            var componentInstructions = await fs.readFile(`${componentDirectory}/component.json`)
            componentInstructions = JSON.parse(componentInstructions);
            var quantity = Number(componentInstructions["quantity"])
            var uniquePieceCount = 0
            
            if (componentInstructions["frontInstructions"] !== undefined) {
                for (var index in componentInstructions["frontInstructions"]) {
                    var pieceQuantity = Number(componentInstructions["frontInstructions"][index]["quantity"])
                    uniquePieceCount += pieceQuantity * quantity
                }
                fileCountForCompleteRender += 1
            }
            if (componentInstructions["backInstructions"] !== undefined) {
                fileCountForCompleteRender += 1
            }
            if (componentInstructions["type"].startsWith("STOCK")) {
                uniquePieceCount = quantity
            }
            else {
                customComponentDirectories.push(componentDirectory)
            }
            var type = componentInstructions["type"].replace("STOCK_","")
            typeQuantities[type] = (typeQuantities[type] !== undefined || 0) + uniquePieceCount;

            fileExtensions = fileExtensions    
                .filter(dirent => dirent.isFile())
                .map(dirent => dirent.name)
            var done = fileExtensions.filter(filename => filename.endsWith('.png') && !filename.endsWith('_temp.png'))
            doneFiles += done.length
        }
        this.setState({
            componentDirectories: customComponentDirectories,
            totalFiles: fileCountForCompleteRender,
            doneFiles: doneFiles,
            typeQuantities: typeQuantities,
        })
    }
    #stopWatchingOutputPath = () => {
        if (this.outputFolderWatcher === undefined) {
            return
        }
        this.outputFolderWatcher.close();
        this.outputFolderWatcher = undefined;
    }
    #parseComponentDirectoryImageFilepathsAsync = async () => {
        this.#stopWatchingOutputPath()            
        this.outputFolderWatcher = fsOld.watch(this.props.outputFolderPath, {recursive: true}, async (event, filename) => {
            await this.#getOutputComponentDirectories()
            await this.#getGameInformation()
        })
            
        await this.#getGameInformation()
        await this.#getOutputComponentDirectories()
    }
    componentDidMount = async () => {
        if (this.props.outputFolderPath === undefined) {
            return
        }
        await this.#parseComponentDirectoryImageFilepathsAsync() 
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.outputFolderPath === prevProps.outputFolderPath) {
            return
        }
        if (this.props.outputFolderPath === undefined) {
            return
        }
        await this.#parseComponentDirectoryImageFilepathsAsync()
    }
    componentWillUnmount = () => {
        this.#stopWatchingOutputPath()
    }
        
    render = () => {
        var outputName = ""
        if (this.props.outputFolderPath !== undefined) {
            outputName = this.props.outputFolderPath.replaceAll("\\", "/")
            outputName = outputName.substring(outputName.lastIndexOf("/") + 1, outputName.length)
        }
        var percentageDone = this.state.doneFiles/this.state.totalFiles * 100
        var style = {"width": `${percentageDone}%`} 
        
        const views = [
            <RenderedImages componentDirectories={this.state.componentDirectories} typeQuantities={this.state.typeQuantities} changeTabsToEditAFileCallback={this.props.changeTabsToEditAFileCallback} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/>,
            <RulesViewer outputFolderPath={this.props.outputFolderPath} />,
            <SimulatorPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}  outputFolderPath={this.props.outputFolderPath} changeTabsToEditAFileCallback={this.props.changeTabsToEditAFileCallback}/>,
            // <PlaygroundPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}  outputFolderPath={this.props.outputFolderPath} changeTabsToEditAFileCallback={this.props.changeTabsToEditAFileCallback}/>,
            <PrintPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}  outputFolderPath={this.props.outputFolderPath}/>,
            // <UploadPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}  outputFolderPath={this.props.outputFolderPath} changeTabsToEditAFileCallback={this.props.changeTabsToEditAFileCallback}/>
        ]
        
        return <React.Fragment>
            <div className="row render-progress-row">
                <div className="col">
                    {outputName !== "" && <>
                        <div className="output-header-container">
                            <p className="output-folder-name">{this.state.gameDisplayName}</p>
                            <p className="output-folder-version-info">- {this.state.versionName}</p>
                            <p className="output-folder-version-info">v{this.state.versionNumber}</p>
                            <p className="output-folder-component-filter">{this.state.componentFilter}</p>
                            {this.state.timestamp !== undefined && 
                                <p className="outputFolderName output-folder-date">{this.state.timestamp}</p>
                            }
                        </div>
                    
                        { percentageDone < 100 ?
                            <div className="progress render-progress-bar-outer">
                                <div 
                                    className={`progress-bar render-progress-bar-inner ${percentageDone!==100 && "progress-bar-striped progress-bar-animated"}`} 
                                    role="progressbar" 
                                    style={style}
                                    aria-valuenow={percentageDone.toString()} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                    />
                            </div>
                            :
                            <div className="post-render-options">
                                {PostRenderOptions.map((postRenderOption, index) => {
                                    var key = `tab-${postRenderOption}`
                                    var selectedClass = this.context.exportOptionIndex === index ? "selected-post-render-option" : ""
                                    return <p key={key} className={selectedClass} onClick={() => this.context.setExportOptionIndex(index)}>{postRenderOption}</p>
                                })}
                            </div>
                        }
                    </>}
                </div>
            </div>
            <div className="row render-output-row">
                <div className="col">
                    { views[this.context.exportOptionIndex] }
                </div>
            </div>
            
        </React.Fragment>
    }
}