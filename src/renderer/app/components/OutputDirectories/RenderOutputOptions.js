import React from "react";
import "../Render/RenderPanel.css"
import "./OutputDirectories.css"
import TemplativeAccessTools from "../TemplativeAccessTools";
import RenderOutputOption from "./RenderOutputOption";

const fsOld = require('fs');

export default class RenderOutputOptions extends React.Component {   
    outputFolderWatcher = undefined
    state = {
        directories: []
    }
    #getOutputDirectoryNames = async () => {
        this.setState({directories: await TemplativeAccessTools.getOutputDirectoriesAsync(this.props.templativeRootDirectoryPath)})
    }
    #stopWatchingBasepath = () => {
        if (this.outputFolderWatcher === undefined) {
            return
        }
        this.outputFolderWatcher.close();
        this.outputFolderWatcher = undefined;
    }
    #watchBasepathAsync = async () => {
        this.#stopWatchingBasepath()                
        this.outputFolderWatcher = fsOld.watch(this.props.templativeRootDirectoryPath, {recursive: true}, async (event, filename) => {
            // console.log(event, filename)
            await this.#getOutputDirectoryNames()
        })
            
        await this.#getOutputDirectoryNames()
    }
    componentDidMount = async () => {
        if (this.props.templativeRootDirectoryPath === undefined) {
            return
        }
        await this.#watchBasepathAsync()        
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState.directories.length !== this.state.directories.length) {
            await this.props.selectDirectoryAsyncCallback(this.state.directories[this.state.directories.length-1].name)
        }
        if (this.props.templativeRootDirectoryPath === prevProps.templativeRootDirectoryPath) {
            return
        }
        if (this.props.templativeRootDirectoryPath === undefined) {
            return
        }
        await this.#watchBasepathAsync()
    }
    componentWillUnmount = () => {
        this.#stopWatchingBasepath()
    }
    render() {        
        var outputDirectoryDivs = this.state.directories.map((directory) => {
            return <RenderOutputOption selectedDirectory={this.props.selectedDirectory} directory={directory} key={directory.name} selectDirectoryAsyncCallback={this.props.selectDirectoryAsyncCallback}/>
        })
        outputDirectoryDivs = outputDirectoryDivs.reverse()

        return <div className="render-output-options-container">
            <div className="header-wrapper">
                <p className="resourcesHeader">Rendered Output</p>
            </div> 
            <div className="output-folder-options">
                {outputDirectoryDivs}
            </div>
        </div>
    }
}