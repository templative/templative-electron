import React from "react";
import "../Render/RenderPanel.css"
import "./OutputDirectories.css"
import TemplativeAccessTools from "../TemplativeAccessTools";
import RenderOutputOption from "./RenderOutputOption";

export default class RenderOutputOptions extends React.Component {   
    state = {
        directories: []
    }
    componentDidMount = async () => {
        if (this.props.templativeRootDirectoryPath === undefined) {
            return
        }
        this.setState({directories: await TemplativeAccessTools.getOutputDirectoriesAsync(this.props.templativeRootDirectoryPath)})
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.templativeRootDirectoryPath === prevProps.templativeRootDirectoryPath) {
            return
        }
        this.setState({directories: await TemplativeAccessTools.getOutputDirectoriesAsync(this.props.templativeRootDirectoryPath)})
    }
    render() {        
        var outputDirectoryDivs = this.state.directories.map((directory) => {
            return <RenderOutputOption selectedDirectory={this.props.selectedDirectory} directory={directory} key={directory.name} selectDirectoryAsyncCallback={this.props.selectDirectoryAsyncCallback}/>
        })
        return <React.Fragment>
            <div className="headerWrapper">
                <p className="resourcesHeader">Output</p>
            </div> 
            <div className="outputFolderOptions">
                {outputDirectoryDivs}
            </div>
        </React.Fragment>
    }
}