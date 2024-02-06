import React from "react";
import MarkdownEditor from '@uiw/react-markdown-editor';
import TemplativeAccessTools from "../../TemplativeAccessTools";

import "./RulesEditor.css"

const path = window.require("path")

export default class RulesEditor extends React.Component {   
    
    state = {
        rulesMd: "",
        hasLoaded: false
    }
    updateRulesFile = (value, viewUpdate) => {
        this.setState({rulesMd: value})
    }
    saveDocumentAsync = async () => {
        if(!this.state.hasLoaded) {
            return
        }

        var rulesFilepath = path.join(this.props.templativeRootDirectoryPath, "rules.md")
        await this.props.saveFileAsyncCallback(rulesFilepath, this.state.rulesMd)
    }
    componentDidMount = async () => {
        var rulesMd = await TemplativeAccessTools.readFileContentsAsync(this.props.templativeRootDirectoryPath, "rules.md")
        this.setState({rulesMd: rulesMd, hasLoaded: true})
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.templativeRootDirectoryPath === this.props.templativeRootDirectoryPath) {
            return
        }
        var rulesMd = await TemplativeAccessTools.readFileContentsAsync(this.props.templativeRootDirectoryPath, "rules.md")
        this.setState({rulesMd: rulesMd})
    }
    componentWillUnmount = async () => {
        await this.saveDocumentAsync()
    }
    render() {
        return <React.Fragment>
            <div className="row rules-body">
                <div className="col">
                    <MarkdownEditor 
                        value={this.state.rulesMd} 
                        onChange={(value, viewUpdate) => this.updateRulesFile(value,viewUpdate)}
                    />
                </div>
            </div>
        </React.Fragment> 
    }
}