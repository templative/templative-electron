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
                console.log("Old has filename, but current doesn't")
                return true
            }
            const isTemplateFileNameChanged = currentState.content.templateFilename !== prevState.content.templateFilename
            console.log(`Old does, current does, they are ${isTemplateFileNameChanged ? "different" : "the same"}.${currentState.content.templateFilename}${prevState.content.templateFilename}`)
            
            return isTemplateFileNameChanged
        }
        else {
            console.log(`Old doesn't, current ${currentHasTemplateFileName ? "does" : "doesn't"}.`)
            return currentHasTemplateFileName
        }
        
    }
    async componentDidUpdate (prevProps, prevState) {
        await super.componentDidUpdate(prevProps, prevState)
        if (!ArtdataViewer.hasFileNameChanged(prevState, this.state)) {
            return
        }
    
        await this.parseTemplateFileForUsefulSuggestions()
    }

    parseTemplateFileForUsefulSuggestions = async () => {
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
    addArtdataItem(artdataType){
        var newArtdataContents = this.state.content
        var newArtdataItem = structuredClone(DEFAULT_ARTDATA_ITEMS[artdataType])
        newArtdataContents[artdataType].push(newArtdataItem)
        this.setState({
            content: newArtdataContents
        }, async () => this.autosave())
    }
    deleteArtdata(artdataType, index) {
        var newArtdataContents = this.state.content
        newArtdataContents[artdataType].splice(index, 1)
        console.log(newArtdataContents)
        this.setState({
            content: newArtdataContents
        }, async () => this.autosave())
    }
    updateArtdataField(artdataType, index, field, value) {
        var newArtdataContents = this.state.content
        newArtdataContents[artdataType][index][field] = value
        this.setState({
            content: newArtdataContents
        }, async () => this.autosave())
    }
    updateTemplate(newTemplate) {
        if (this.state.content === undefined) {
            return
        }
        var newArtdataContents = this.state.content
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
        var newArtdataContents = this.state.content

        var temp = newArtdataContents[type][to]
        newArtdataContents[type][to] = newArtdataContents[type][from]
        newArtdataContents[type][from] = temp

        this.setState({
            content: newArtdataContents
        }, this.autosave)
    };

    addTextSuggestion = (suggestion) => {
        var newArtdataContents = this.state.content
        var newArtdataItem = structuredClone(DEFAULT_ARTDATA_ITEMS["textReplacements"])
        newArtdataItem["key"] = suggestion
        newArtdataItem["source"] = suggestion
        newArtdataContents["textReplacements"].push(newArtdataItem)
        this.setState({
            content: newArtdataContents
        }, this.autosave)
    }

    goToTemplateFile = async (templateFilename) => {
        console.log(templateFilename)
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
                overlays.push(<Overlay index={i} key={i} artdataItem={this.state.content.overlays[i]} 
                    deleteCallback={(index) => this.deleteArtdata("overlays", index)}
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("overlays", from, to)}
                />)
            };
            for(var t = 0 ; t < this.state.content.textReplacements.length; t++) {
                if (uniqueSuggestions.has(this.state.content.textReplacements[t]["key"])) {
                    uniqueSuggestions.delete(this.state.content.textReplacements[t]["key"])
                }
                textReplacements.push(<TextReplacement index={t} key={t} artdataItem={this.state.content.textReplacements[t]} 
                    deleteCallback={(index)=> this.deleteArtdata("textReplacements", index)} 
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("textReplacements", from, to)}
                />)
            };
            for(var s = 0 ; s < this.state.content.styleUpdates.length; s++){
                styleUpdates.push(<StyleUpdate index={s} key={s} 
                    artdataItem={this.state.content.styleUpdates[s]} 
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("styleUpdates", from, to)}
                    deleteCallback={(index)=> this.deleteArtdata("styleUpdates", index)}/>)
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

                <h3>Overlays</h3>
                <div className="vertical-input-group">
                <div className="input-group mb-3 input-group-sm piece-control-input"  data-bs-theme="dark">
                        <span className="input-group-text text-replacement-debugging-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
                                <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
                            </svg>
                        </span>
                        <span className="input-group-text text-replacement-source-type-label flex-grow-1"><img className="tab-icon input-icon" src={pieceIcon} alt="Tab icon"/> Data Source</span>
                        <span className="input-group-text text-replacement-source-label flex-grow-1">Which value from data source?</span>
                        <span className="input-group-text text-replacement-source-label flex-grow-1">X Position</span>
                        <span className="input-group-text text-replacement-source-label flex-grow-1">Y Position</span>
                    </div>
                    {overlays}
                    <ArtdataAddButton addArtdataCallback={()=>this.addArtdataItem("overlays")}/>
                </div>

                <h3>Style Updates</h3>
                <div className="vertical-input-group">
                    <div className="input-group mb-3 input-group-sm piece-control-input"  data-bs-theme="dark">
                        <span className="input-group-text text-replacement-debugging-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
                                <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
                            </svg>
                        </span>
                        <span className="input-group-text flex-grow-1">Find which xml entity by ID in art file?</span>
                        <span className="input-group-text flex-grow-1">Which CSS field to update?</span>
                        <span className="input-group-text text-replacement-source-type-label flex-grow-1"><img className="tab-icon input-icon" src={pieceIcon} alt="Tab icon"/> Data Source</span>
                        <span className="input-group-text text-replacement-source-label flex-grow-1">Which value from data source?</span>
                        <span className="input-group-text text-replacement-controls-label"><span className="hidden-visibility">Invisible</span></span>
                    </div>
                    {styleUpdates}
                    <ArtdataAddButton addArtdataCallback={()=>this.addArtdataItem("styleUpdates")}/>
                </div>

                <h3>Text Replacements</h3>
                {replacementSuggestionElements.length > 0 &&
                    <div className="text-replacement-examples">
                        {replacementSuggestionElements}
                    </div>
                }
                <div className="vertical-input-group">
                    <div className="input-group mb-3 input-group-sm piece-control-input"  data-bs-theme="dark">
                        <span className="input-group-text text-replacement-debugging-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
                                <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
                            </svg>
                        </span>
                        <span className="input-group-text text-replacement-key-label flex-grow-1">Replace what in art file?</span>
                        <span className="input-group-text text-replacement-source-type-label flex-grow-1"><img className="tab-icon input-icon" src={pieceIcon} alt="Tab icon"/> Data Source</span>
                        <span className="input-group-text text-replacement-source-label flex-grow-1">Which value from data source?</span>
                        <span className="input-group-text text-replacement-controls-label"><span className="hidden-visibility">Invisible</span></span>
                    </div>
                    {textReplacements}
                    <ArtdataAddButton addArtdataCallback={()=>this.addArtdataItem("textReplacements")}/>
                </div>
            </div>
        </div> 
    }
}