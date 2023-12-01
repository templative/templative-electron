import React from "react";
import TextReplacement from "./ArtdataTypes/TextReplacement";
import StyleUpdate from "./ArtdataTypes/StyleUpdate";
import Overlay from "./ArtdataTypes/Overlay";
import ArtdataAddButton from "./ArtdataAddButton"

export default class ArtdataViewer extends React.Component {   
    state = {
        artdataFile: this.props.fileContents
    }
    // componentDidMount() {
    //     this.setState({})
    // }
    addOverlay(){
        this.state.artdataFile.overlays.push({
            scope:"piece", source: "", isComplex: false, isDebug: false
        })
        this.setState({artdataFile: this.state.artdataFile})
    }
    addTextReplacement(){
        this.state.artdataFile.textReplacements.push({
            key: "", scope:"piece", source: "", isComplex: false, isDebug: false
        })
        this.setState({artdataFile: this.state.artdataFile})
    }
    addStyleUpdate(){
        this.state.artdataFile.styleUpdates.push({
            id: "", cssValue: "", scope: "piece", source: "", isComplex: false, isDebug: false
        })
        this.setState({artdataFile: this.state.artdataFile})
    }
    deleteOverlay(index) {
        console.log(this.state.artdataFile.overlays)
        this.state.artdataFile.overlays.splice(index, 1)
        console.log(this.state.artdataFile.overlays)
        this.setState({artdataFile: this.state.artdataFile})
    }
    deleteTextReplacement(index) {
        this.state.artdataFile.textReplacements.splice(index, 1)
        this.setState({artdataFile: this.state.artdataFile})
    }
    deleteStyleUpdate(index) {
        this.state.artdataFile.styleUpdates.splice(index,1)
        this.setState({artdataFile: this.state.artdataFile})
    }
    updateArtdataScope(artdataType, index, scope) {
        var newArtdataFileContents = this.state.artdataFile
        newArtdataFileContents[artdataType][index].scope = scope
        this.setState({artdataFile: newArtdataFileContents})
    }
    render() {
        var overlays = []
        if(this.state.artdataFile !== undefined) {
            for(var i = 0 ; i < this.state.artdataFile.overlays.length; i++){
                overlays.push(<Overlay index={i} key={i} artdataItem={this.state.artdataFile.overlays[i]} deleteCallback={(index) => this.deleteOverlay(index)}/>)
            };
        }
        overlays.push(<ArtdataAddButton key="addOverlay" addArtdataCallback={()=>this.addOverlay()}/>)

        var textReplacements = []
        if(this.state.artdataFile !== undefined) {
            for(var t = 0 ; t < this.state.artdataFile.textReplacements.length; t++){
                textReplacements.push(<TextReplacement index={t} key={t} artdataItem={this.state.artdataFile.textReplacements[t]} deleteCallback={(index)=> this.deleteTextReplacement(index)}/>)
            };
        }
        textReplacements.push(<ArtdataAddButton key="addTextReplacement" addArtdataCallback={()=>this.addTextReplacement()}/>)
        
        var styleUpdates = []
        if(this.state.artdataFile !== undefined) {
            for(var s = 0 ; s < this.state.artdataFile.styleUpdates.length; s++){
                styleUpdates.push(<StyleUpdate index={s} key={s} artdataItem={this.state.artdataFile.styleUpdates[s]} changeScopeCallback={(index, scope)=>this.updateArtdataScope("styleUpdates", index, scope)}deleteCallback={(index)=> this.deleteStyleUpdate(index)}/>)
            };
        }
        styleUpdates.push(<ArtdataAddButton key="addStyleUpdate" addArtdataCallback={()=>this.addStyleUpdate()}/>)

        return <div className="row">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
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