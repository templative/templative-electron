import React from "react";
import TextReplacement from "./ArtdataTypes/TextReplacement";
import StyleUpdate from "./ArtdataTypes/StyleUpdate";
import Overlay from "./ArtdataTypes/Overlay";
import ArtdataAddButton from "./ArtdataAddButton"
import EditableViewerJson from "../EditableViewerJson";
import TemplativeAccessTools from "../../../TemplativeAccessTools";
import FilepathsAutocompleteInput from "../ComponentsViewer/ComponentItems/FilepathsAutocompleteInput";
import pieceIcon from "../../Icons/pieceIcon.svg"
const path = require("path")

const DEFAULT_ARTDATA_ITEMS = {
    "overlays": {
        scope:"piece", source: "", isComplex: false, isDebug: false, positionX: 0, positionY: 0,
    },
    "textReplacements": {
        key: "", scope:"piece", source: "", isComplex: false, isDebug: false
    },
    "styleUpdates": {
        id: "", cssValue: "", scope: "piece", source: "", isComplex: false, isDebug: false
    } 
}

export default class ArtdataViewer extends EditableViewerJson {  
    state = {
        replacementSuggestions: [],
        templateFileExists: false
    }

    static hasFileNameChanged = (prevState, currentState) => {
        const oldHasTemplateFileName = prevState.content !== undefined && prevState.content.templateFilename !== undefined
        const currentHasTemplateFileName = currentState.content !== undefined && currentState.content.templateFilename !== undefined
        if (oldHasTemplateFileName) {
            if (!currentHasTemplateFileName) {
                // console.log("Old has filename, but current doesn't")
                return true
            }
            const isTemplateFileNameChanged = currentState.content.templateFilename !== prevState.content.templateFilename
            // console.log(`Old does, current does, they are ${isTemplateFileNameChanged ? "different" : "the same"}.${currentState.content.templateFilename}${prevState.content.templateFilename}`)
            
            return isTemplateFileNameChanged
        }
        else {
            // console.log(`Old doesn't, current ${currentHasTemplateFileName ? "does" : "doesn't"}.`)
            return currentHasTemplateFileName
        }
        
    }
    async componentDidUpdate (prevProps, prevState) {
        await super.componentDidUpdate(prevProps, prevState)
        if (ArtdataViewer.hasFileNameChanged(prevState, this.state)) {
            await this.parseTemplateFileForUsefulSuggestions()
        }
    }

    parseTemplateFileForUsefulSuggestions = async () => {
        if (!this.state.hasLoaded) {
            return
        }
        const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        const templateFilepath = path.join(this.props.templativeRootDirectoryPath, gameCompose["artTemplatesDirectory"], this.state.content.templateFilename) + ".svg"
        if (!await TemplativeAccessTools.doesFileExistAsync(templateFilepath)) {
            this.setState({
                templateFileExists: false,
                replacementSuggestions: []
            })
            return
        }
        const templateFileContents = await TemplativeAccessTools.readFileContentsAsync(templateFilepath)
        await this.searchForSuggestions(templateFileContents)
    }

    readRegex = (regex, collectTo, contents) => {
        var curMatch = regex.exec(contents);
        if (curMatch === null) {
            return
        }
        collectTo.push(curMatch[1]);
        this.readRegex(regex, collectTo, contents)
    }
    searchForSuggestions = async (templateFileContents) => {
        const curlyBraceRegex = /{([^}]+)}/g
        const replacementSuggestions = []
        this.readRegex(curlyBraceRegex, replacementSuggestions, templateFileContents)       
        this.setState({templateFileExists: true, replacementSuggestions: replacementSuggestions})
    }
    getFilePath = (props) => {
        return props.filepath
    }
    addArtdataItem(artdataType) {
        const newArtdataContents = { ...this.state.content }
        const newArtdataItem = structuredClone(DEFAULT_ARTDATA_ITEMS[artdataType])
        newArtdataContents[artdataType].push(newArtdataItem)
        this.setState({
            content: newArtdataContents
        }, async () => this.autosave())
    }
    deleteArtdata(artdataType, index) {
        const newArtdataContents = { ...this.state.content }
        newArtdataContents[artdataType].splice(index, 1)
        console.log(newArtdataContents)
        this.setState({
            content: newArtdataContents
        }, async () => this.autosave())
    }
    updateArtdataField(artdataType, index, field, value) {
        const newArtdataContents = { ...this.state.content }
        newArtdataContents[artdataType][index][field] = value
        this.setState({
            content: newArtdataContents
        }, async () => this.autosave())
    }
    updateTemplate(newTemplate) {
        if (this.state.content === undefined) {
            return
        }
        const newArtdataContents = { ...this.state.content }
        newArtdataContents.templateFilename = newTemplate
        this.setState({
            content: newArtdataContents
        }, async() => {
            await this.autosave()
            await this.parseTemplateFileForUsefulSuggestions()
        })
    }

    updateArtdataItemOrder = (type, from, to) => {
        if (to === -1 || to === this.state.content[type].length) {
            return;
        }
        const newArtdataContents = { ...this.state.content }

        const temp = newArtdataContents[type][to]
        newArtdataContents[type][to] = newArtdataContents[type][from]
        newArtdataContents[type][from] = temp

        this.setState({
            content: newArtdataContents
        }, this.autosave)
    };

    addTextSuggestion = (suggestion) => {
        const newArtdataContents = { ...this.state.content }
        const newArtdataItem = structuredClone(DEFAULT_ARTDATA_ITEMS["textReplacements"])
        newArtdataItem["key"] = suggestion
        newArtdataItem["source"] = suggestion
        newArtdataContents["textReplacements"].push(newArtdataItem)
        this.setState({
            content: newArtdataContents
        }, this.autosave)
    }

    goToTemplateFile = async (templateFilename) => {
        if (templateFilename.trim() === "") {
            return
        }
        const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        const templateFilepath = path.join(this.props.templativeRootDirectoryPath, gameCompose["artTemplatesDirectory"], templateFilename) + ".svg"
        await this.props.updateViewedFileUsingExplorerAsyncCallback("ART", templateFilepath)
    }

    render() {
        var templateFilename = ""
        var overlays = []
        var textReplacements = []
        var styleUpdates = []
        var replacementSuggestionElements = []
        if(this.state.hasLoaded && this.state.content !== undefined) {
            templateFilename = this.state.content.templateFilename
            var uniqueSuggestions = new Set(this.state.replacementSuggestions)
            for(var i = 0 ; i < this.state.content.overlays.length; i++){
                overlays.push(<Overlay 
                    index={i} 
                    key={i} 
                    artdataItem={this.state.content.overlays[i]} 
                    deleteCallback={(index) => this.deleteArtdata("overlays", index)}
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("overlays", from, to)}
                    availableDataSources={this.props.availableDataSources}
                    isLast={i === this.state.content.overlays.length - 1}
                />)
            };
            for(var t = 0 ; t < this.state.content.textReplacements.length; t++) {
                if (uniqueSuggestions.has(this.state.content.textReplacements[t]["key"])) {
                    uniqueSuggestions.delete(this.state.content.textReplacements[t]["key"])
                }
                textReplacements.push(<TextReplacement 
                    index={t} 
                    key={t} 
                    artdataItem={this.state.content.textReplacements[t]} 
                    deleteCallback={(index)=> this.deleteArtdata("textReplacements", index)} 
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("textReplacements", from, to)}
                    availableDataSources={this.props.availableDataSources}
                    isLast={t === this.state.content.textReplacements.length - 1}
                />)
            };
            for(var s = 0 ; s < this.state.content.styleUpdates.length; s++){
                styleUpdates.push(<StyleUpdate 
                    index={s} 
                    key={s} 
                    artdataItem={this.state.content.styleUpdates[s]} 
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("styleUpdates", from, to)}
                    deleteCallback={(index)=> this.deleteArtdata("styleUpdates", index)}
                    availableDataSources={this.props.availableDataSources}
                    isLast={s === this.state.content.styleUpdates.length - 1}
                />)
            };
            var textReplacementSuggestions = [...uniqueSuggestions]
            replacementSuggestionElements = textReplacementSuggestions.map((suggestion) => 
                <button key={suggestion} className="btn btn-primary add-text-replacement-suggestion-button" onClick={() => this.addTextSuggestion(suggestion)}>+ {suggestion}</button>
            )
        }
        
        return <div className="row artdata-viewer">
            <div className="col">
                <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                    { this.state.templateFileExists ? 
                        <button onClick={async () => await this.goToTemplateFile(templateFilename)} className="btn btn-outline-secondary go-to-template-button" type="button">Template ↗</button> :
                        <span className="input-group-text templative-label">Template</span> 
                    }
                    <FilepathsAutocompleteInput 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        value={templateFilename} 
                        onChange={(value)=> this.updateTemplate(value)}
                        ariaLabel="Template Filename"
                        gameComposeDirectory="artTemplatesDirectory"
                    />
                </div>

                <h3 className="artdata-type-header">Overlays</h3>
                <div className="vertical-input-group">
                    
                    {overlays}
                    <ArtdataAddButton addArtdataCallback={()=>this.addArtdataItem("overlays")} whatToAdd={"an Overlay"}/>
                </div>

                <h3 className="artdata-type-header">Style Updates</h3>
                <div className="vertical-input-group">
                    {styleUpdates}
                    <ArtdataAddButton addArtdataCallback={()=>this.addArtdataItem("styleUpdates")} whatToAdd={"a Style Update"}/>
                </div>

                <h3 className="artdata-type-header">Text Replacements</h3>
                {replacementSuggestionElements.length > 0 &&
                    <div className="text-replacement-examples">
                        {replacementSuggestionElements}
                    </div>
                }
                <div className="vertical-input-group">
                    {textReplacements}
                    <ArtdataAddButton addArtdataCallback={()=>this.addArtdataItem("textReplacements")} whatToAdd={"a Text Replacement"}/>
                </div>
            </div>
        </div> 
    }
}