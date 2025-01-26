import React from "react";
import MarkdownEditor from '@uiw/react-markdown-editor';
import EditableViewerRaw from "./EditableViewerRaw";
import "./RulesEditor.css"

const path = require("path")

export default class RulesEditor extends EditableViewerRaw {       
    getFilePath = (props) => {
        return path.join(props.templativeRootDirectoryPath, "rules.md")
    }
    render() {
        return <div className="rules-body">
            <MarkdownEditor 
                value={this.state.hasLoaded ? this.state.content : ""} 
                onChange={this.state.hasLoaded ? (value, viewUpdate) => this.updateContent(value) : undefined}
            />
        </div>
    }
}