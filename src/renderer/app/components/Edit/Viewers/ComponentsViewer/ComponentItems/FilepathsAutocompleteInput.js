import React from "react";
import "../ComponentViewer.css"
import TemplativeAccessTools from "../../../../TemplativeAccessTools";

const { resolve } = require('path');
const fs = require('fs/promises');
const path = require("path")

export default class FilepathsAutocompleteInput extends React.Component {   
    state = {
        options: []
    }
    componentDidMount = async () => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var directoryPath = path.join(this.props.templativeRootDirectoryPath, gameCompose[this.props.gameComposeDirectory])
        var files = await this.walkThroughDirectoryForRelativeFilepaths(directoryPath)
        this.setState({
            options: files.map(dirent => dirent.name.replace(/\.[^/.]+$/, ""))    
        })        
    }
    walkThroughDirectoryForRelativeFilepaths = async (filepath) => {
        var filepaths = []
        var dirents = await fs.readdir(filepath, { withFileTypes: true })
        for (const dirent of dirents) {
            const res = resolve(filepath, dirent.name);
            if (dirent.isDirectory()) {
                filepaths.concat(await this.walkThroughDirectoryForRelativeFilepaths(res))
            } else {
                filepaths.push(dirent)
            }
        }
        return filepaths
    }

    render() {
        return <select 
            className="form-control"
            value={this.props.value}
            onChange={(event) => this.props.onChange(event.target.value)}
            aria-label={this.props.ariaLabel}
        >
            <option value="">Select a file...</option>
            {this.state.options.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    }
}