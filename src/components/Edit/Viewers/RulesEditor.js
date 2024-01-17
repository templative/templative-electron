import React from "react";
import "./RulesEditor.css"
import MarkdownEditor from '@uiw/react-markdown-editor';
import TemplativeAccessTools from "../../TemplativeAccessTools";
const fs = window.require("fs")
const path = window.require("path")

export default class RulesEditor extends React.Component {   
    
    state = {
        rulesMd: "",
        hasLoaded: false
    }
    updateRulesFile = (value, viewUpdate) => {
        this.setState({rulesMd: value})
    }
    saveDocument() {
        if(!this.state.hasLoaded) {
            return
        }

        var rulesFilepath = path.join(this.props.templativeRootDirectoryPath, "rules.md")
        fs.writeFileSync(rulesFilepath, this.state.rulesMd, 'utf-8')
    }
    componentDidMount() {
        var rulesMd = TemplativeAccessTools.readFileContents(this.props.templativeRootDirectoryPath, "rules.md")
        this.setState({rulesMd: rulesMd, hasLoaded: true})
    }
    componentWillUnmount(){
        this.saveDocument()
    }
    render() {
        return <React.Fragment>
            <div className="row rules-title">
                <div className="col">
                    <h1>Rules</h1>
                </div>
            </div>
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