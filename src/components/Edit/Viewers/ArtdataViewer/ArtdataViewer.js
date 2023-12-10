import React from "react";
import TextReplacement from "./ArtdataTypes/TextReplacement";
import StyleUpdate from "./ArtdataTypes/StyleUpdate";
import Overlay from "./ArtdataTypes/Overlay";
import ArtdataAddButton from "./ArtdataAddButton"
const fs = window.require("fs")

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

export default class ArtdataViewer extends React.Component {   
    state = {
        artdataFile: this.props.fileContents
    }
    componentDidUpdate(prevProps) {
        if (this.props.filename === prevProps.filename) {
          return;
        }
        this.saveDocument(prevProps.currentFilepath, this.state.artdataFile)

        this.setState({
            artdataFile: this.props.fileContents
        })
    }

    saveDocument(filepath, fileContents) {
        var newFileContents = JSON.stringify(fileContents, null, 4)
        if (filepath.split('.').pop() !== "json") {
            console.log(`No saving this file as its not json ${filepath}`)
            return
        }
        fs.writeFileSync(filepath, newFileContents, 'utf-8')
    }
    componentWillUnmount(){
        this.saveDocument(this.props.currentFilepath, this.state.artdataFile)
    }
    addArtdataItem(artdataType){
        var newArtdataContents = this.state.artdataFile
        var newArtdataItem = structuredClone(DEFAULT_ARTDATA_ITEMS[artdataType])
        newArtdataContents[artdataType].push(newArtdataItem)
        this.setState({
            artdataFile: newArtdataContents
        })
    }
    deleteArtdata(artdataType, index) {
        var newArtdataContents = this.state.artdataFile
        newArtdataContents[artdataType].splice(index, 1)
        console.log(newArtdataContents)
        this.setState({
            artdataFile: newArtdataContents
        })
    }
    updateArtdataField(artdataType, index, field, value) {
        var newArtdataContents = this.state.artdataFile
        newArtdataContents[artdataType][index][field] = value
        this.setState({
            artdataFile: newArtdataContents
        })
    }
    updateTemplate(newTemplate) {
        var newArtdataContents = this.state.artdataFile
        newArtdataContents.templateFilename = newTemplate
        this.setState({
            artdataFile: newArtdataContents
        })
    }

    updateArtdataItemOrder = (type, from, to) => {
        if (to === -1 || to === this.state.artdataFile[type].length) {
            return;
        }
        var newArtdataContents = this.state.artdataFile

        var temp = newArtdataContents[type][to]
        newArtdataContents[type][to] = newArtdataContents[type][from]
        newArtdataContents[type][from] = temp

        this.setState({
            artdataFile: newArtdataContents
        })
    };

    render() {
        var overlays = []
        if(this.state.artdataFile !== undefined) {
            for(var i = 0 ; i < this.state.artdataFile.overlays.length; i++){
                overlays.push(<Overlay index={i} key={i} artdataItem={this.state.artdataFile.overlays[i]} 
                    deleteCallback={(index) => this.deleteArtdata("overlays", index)}
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("overlays", from, to)}
                />)
            };
        }
        overlays.push(<ArtdataAddButton key="addOverlay" addArtdataCallback={()=>this.addArtdataItem("overlays")}/>)

        var textReplacements = []
        if(this.state.artdataFile !== undefined) {
            for(var t = 0 ; t < this.state.artdataFile.textReplacements.length; t++) {
                textReplacements.push(<TextReplacement index={t} key={t} artdataItem={this.state.artdataFile.textReplacements[t]} 
                    deleteCallback={(index)=> this.deleteArtdata("textReplacements", index)} 
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("textReplacements", from, to)}
                />)
            };
        }
        textReplacements.push(<ArtdataAddButton key="addTextReplacement" addArtdataCallback={()=>this.addArtdataItem("textReplacements")}/>)
        
        var styleUpdates = []
        if(this.state.artdataFile !== undefined) {
            for(var s = 0 ; s < this.state.artdataFile.styleUpdates.length; s++){
                styleUpdates.push(<StyleUpdate index={s} key={s} 
                    artdataItem={this.state.artdataFile.styleUpdates[s]} 
                    updateArtdataFieldCallback={(artdataType, index, field, value)=>this.updateArtdataField(artdataType, index, field, value)}
                    updateArtdataItemOrderCallback={(from,to) => this.updateArtdataItemOrder("styleUpdates", from, to)}
                    deleteCallback={(index)=> this.deleteArtdata("styleUpdates", index)}/>)
            };
        }
        styleUpdates.push(<ArtdataAddButton key="addStyleUpdate" addArtdataCallback={()=>this.addArtdataItem("styleUpdates")}/>)
        
        return <div className="row">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}{/* {this.state.hasChanged && "*"} */}</h1>
                </div>
                <div className="row">
                    <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                    <span className="input-group-text">Template</span>
                        <input type="text" className="form-control" onChange={(event)=>this.updateTemplate(event.target.value)} aria-label="What key to get from the scope..." value={this.state.artdataFile.templateFilename}/>
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