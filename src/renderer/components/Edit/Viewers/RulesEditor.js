import React from "react";
import MarkdownEditor from '@uiw/react-markdown-editor';
import EditableViewerRaw from "./EditableViewerRaw";
import "./RulesEditor.css"
import FileLoadFailure from "./FileLoadFailure";
const path = require("path")

export default class RulesEditor extends EditableViewerRaw {       
    getFilePath = (props) => {
        return path.join(props.templativeRootDirectoryPath, "rules.md")
    }
    updateContent = (value) => {
        if (this.state.content !== value) {
            this.setState({content: value}, async () => {
                await this.autosave()
            })
        }
    }
    render() {
        if (this.state.failedToLoad) {
            return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.state.filepath} errorMessage={this.state.errorMessage} />
        }
        if (!this.state.hasLoaded) {
            return null
        }        
        
        return <div className="rules-body">
            <MarkdownEditor 
                value={this.state.content || ""} 
                onChange={(value, _) => this.updateContent(value)}
            />
        </div>
    }
}