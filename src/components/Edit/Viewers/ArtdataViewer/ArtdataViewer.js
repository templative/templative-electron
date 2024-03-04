import React from "react";
import TextReplacement from "./ArtdataTypes/TextReplacement";
import StyleUpdate from "./ArtdataTypes/StyleUpdate";
import Overlay from "./ArtdataTypes/Overlay";
import ArtdataAddButton from "./ArtdataAddButton"
import EditableViewerJson from "../EditableViewerJson";

const DEFAULT_ARTDATA_ITEMS = {
    "overlays": {
        scope:"piece", source: "", isComplex: false, isDebug: false
    },
    "textReplacements": {
        key: "", scope:"piece", source: "", isComplex: false, isDebug: false
    },
    "styleUpdates": {
        id: "", cssValue: "", scope: "piece", source: "", isComplex: false, isDebug: false
    } 
}

export default class ArtdataViewer extends EditableViewerJson {   
    getFilePath = (props) => {
        return props.filepath
    }
    addArtdataItem(artdataType){
        var newArtdataContents = this.state.content
        var newArtdataItem = structuredClone(DEFAULT_ARTDATA_ITEMS[artdataType])
        newArtdataContents[artdataType].push(newArtdataItem)
        this.setState({
            content: newArtdataContents
        })
    }
    deleteArtdata(artdataType, index) {
        var newArtdataContents = this.state.content
        newArtdataContents[artdataType].splice(index, 1)
        console.log(newArtdataContents)
        this.setState({
            content: newArtdataContents
        })
    }
    updateArtdataField(artdataType, index, field, value) {
        var newArtdataContents = this.state.content
        newArtdataContents[artdataType][index][field] = value
        this.setState({
            content: newArtdataContents
        })
    }
    updateTemplate(newTemplate) {
        if (this.state.content === undefined) {
            return
        }
        var newArtdataContents = this.state.content
        newArtdataContents.templateFilename = newTemplate
        this.setState({
            content: newArtdataContents
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
        })
    };

    render() {
        var templateFilename = ""
        var overlays = []
        var textReplacements = []
        var styleUpdates = []
        if(this.state.hasLoaded && this.state.content !== undefined) {
            templateFilename = this.state.content.templateFilename

            for(var i = 0 ; i < this.state.content.overlays.length; i++){
                overlays.push(<Overlay index={i} key={i} artdataItem={this.state.content.overlays[i]} 
                    deleteCallback={(index) => this.deleteArtdata("overlays", index)}
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("overlays", from, to)}
                />)
            };
            for(var t = 0 ; t < this.state.content.textReplacements.length; t++) {
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
        }
        overlays.push(<ArtdataAddButton key="addOverlay" addArtdataCallback={()=>this.addArtdataItem("overlays")}/>)
        textReplacements.push(<ArtdataAddButton key="addTextReplacement" addArtdataCallback={()=>this.addArtdataItem("textReplacements")}/>)
        styleUpdates.push(<ArtdataAddButton key="addStyleUpdate" addArtdataCallback={()=>this.addArtdataItem("styleUpdates")}/>)
        return <div className="row">
            <div className="col">
                <div className="row">
                    <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                    <span className="input-group-text">Template</span>
                        <input type="text" className="form-control" onChange={(event)=>this.updateTemplate(event.target.value)} aria-label="What key to get from the scope..." value={templateFilename}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <h3>Overlays</h3>
                        </div>
                        <div className="row">
                            <div className="vertical-input-group">
                                {overlays}
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <h3>Style Updates</h3>
                        </div>
                        <div className="row">
                            <div className="vertical-input-group">
                                {styleUpdates}
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <h3>Text Replacements</h3>
                        </div>
                        <div className="row">
                            <div className="vertical-input-group">
                                {textReplacements}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    }
}