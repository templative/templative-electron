import React from "react";
import MarkdownEditor from '@uiw/react-markdown-editor';
import EditableViewerRaw from "./EditableViewerRaw";
import "./RulesEditor.css"

const path = require("path")

export default class RulesEditor extends EditableViewerRaw {       
    getFilePath = (props) => {
        return path.join(props.templativeRootDirectoryPath, "rules.md")
    }
    updateContent = (value) => {
        if (!this.state.hasLoaded) {
            return
        }
        this.setState({content: value}, async () => {
            await this.autosave()
        })
    }
    render() {
        return <div className="rules-body">
            <MarkdownEditor 
                value={this.state.hasLoaded ? this.state.content : ""} 
                onChange={(value, _) => this.updateContent(value)}
            />
        </div>
    }
}