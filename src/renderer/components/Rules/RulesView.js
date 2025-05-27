import React, { useState } from "react";
import MarkdownEditor from "./MarkdownEditor";
import "./RulesView.css"
import EditableViewerRaw from "../Edit/Viewers/EditableViewerRaw";
import FileLoadFailure from "../Edit/Viewers/FileLoadFailure";
import path from "path";

export default class RulesView extends EditableViewerRaw {       
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
                markdownContent={this.state.content}
                onContentChange={this.updateContent}
            />
        </div>
    }
}