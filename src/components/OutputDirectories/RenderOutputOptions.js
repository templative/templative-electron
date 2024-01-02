import React from "react";
import "../Render/RenderPanel.css"
import TemplativeAccessTools from "../TemplativeAccessTools";
import RenderOutputOption from "./RenderOutputOption";

export default class RenderOutputOptions extends React.Component {   
    render() {
        var directories = []
        if (this.props.templativeRootDirectoryPath !== undefined) {
            directories = TemplativeAccessTools.getOutputDirectories(this.props.templativeRootDirectoryPath)
        }
        var outputDirectoryDivs = directories.map((directory) => {
            return <RenderOutputOption selectedDirectory={this.props.selectedDirectory} directory={directory} key={directory.name} selectDirectory={this.props.selectDirectory}/>
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