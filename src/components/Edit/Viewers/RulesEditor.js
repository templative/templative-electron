import React from "react";
import MarkdownEditor from '@uiw/react-markdown-editor';
import TemplativeAccessTools from "../../TemplativeAccessTools";
import "./RulesEditor.css"

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');
const path = require("path")

export default class RulesEditor extends React.Component {   
    
    state = {
        rulesMd: "",
        hasLoaded: false
    }
    updateRulesFile = (value, viewUpdate) => {
        this.setState({rulesMd: value})
    }
    saveDocumentAsync = async (filepath, fileContents) => {
        await this.props.saveFileAsyncCallback(filepath, fileContents)
    }
    autosave = async () => {
        var rulesFilepath = path.join(this.props.templativeRootDirectoryPath, "rules.md")
        await this.saveDocumentAsync(rulesFilepath, this.state.rulesMd)
    }
    componentDidMount = async () => {
        var rulesMd = await TemplativeAccessTools.readFileContentsAsync(this.props.templativeRootDirectoryPath, "rules.md")
        this.saveIntervalId = setIntervalAsync(this.autosave, 10*1000)
        this.setState({rulesMd: rulesMd, hasLoaded: true})
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.templativeRootDirectoryPath === this.props.templativeRootDirectoryPath) {
            return
        }
        var previousFilepath = path.join(prevProps.templativeRootDirectoryPath, "rules.md")
        await this.saveDocumentAsync(previousFilepath, this.state.rulesMd)
        
        var rulesMd = await TemplativeAccessTools.readFileContentsAsync(this.props.templativeRootDirectoryPath, "rules.md")
        this.setState({rulesMd: rulesMd})
    }
    componentWillUnmount = async () => {
        if (this.saveIntervalId !== undefined) {
            await clearIntervalAsync(this.saveIntervalId)
            this.saveIntervalId = undefined
        }
        await this.autosave()
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