import React from "react";
import "../ComponentViewer.css"
import TemplativeAccessTools from "../../../../TemplativeAccessTools";

const { resolve } = require('path');
const fs = require('fs/promises');
const path = require("path")

export default class FilepathsAutocompleteInput extends React.Component {   
    state = {
        isFocused: false,
        options: []
    }
    componentDidMount = async () => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var directoryPath = path.join(this.props.templativeRootDirectoryPath, gameCompose[this.props.gameComposeDirectory])
        // console.log(directoryPath)
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

    onFocus = () => {
        this.setState({isFocused: true})
    }
    onBlur = () => {
        this.setState({isFocused: false})
    }
    render() {
        var options = this.state.options
            .filter(option => {
                const startsWithValue = option.startsWith(this.props.value)
                return startsWithValue 
            })
            .sort()
            .map(option => {
                return <p 
                    key={option}
                >
                    <span className="already-written-autocomplete">
                        {this.props.value}
                    </span>
                    {option.replace(this.props.value, "")}
                </p>
            })

        const shouldShowAutocomplete = options.length > 0 && this.state.isFocused
        return <React.Fragment>
            <input 
                onFocus={this.onFocus} onBlur={this.onBlur}
                type="text" 
                aria-label={this.props.ariaLabel} 
                className="form-control autocomplete-input" 
                onChange={(event)=>this.props.onChange(event.target.value)} 
                value={this.props.value}/>
            { shouldShowAutocomplete &&
                <div className="auto-complete"
                    style={{left: `${this.props.left}px`, top: `${this.props.top}px`,}}
                >
                {options}
            </div>
            }
        </React.Fragment>
    }
}