import React from "react";
import TextReplacement from "./TextReplacement";
import StyleUpdate from "./StyleUpdate";
import Overlay from "./Overlay";

export default class ArtdataViewer extends React.Component {   
    render() {
        var overlays = []
        if(this.props.fileContents !== undefined) {
            this.props.fileContents.overlays.forEach(element => {
                overlays.push(<Overlay key={element.scope + element.source} overlay={element}/>)
            });
        }
        var textReplacements = []
        if(this.props.fileContents !== undefined) {
            this.props.fileContents.textReplacements.forEach(element => {
                textReplacements.push(<TextReplacement key={element.scope + element.id + element.source} textReplacement={element}/>)
            });
        }
        var styleUpdates = []
        if(this.props.fileContents !== undefined) {
            this.props.fileContents.styleUpdates.forEach(element => {
                styleUpdates.push(<StyleUpdate key={element.scope + element.key + element.source} styleUpdate={element}/>)
            });
        }

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
                            {overlays}
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <h3>Style Updates</h3>
                        </div>
                        <div className="row">
                            {styleUpdates}
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <h3>Text Replacements</h3>
                        </div>
                        <div className="row">
                            {textReplacements}
                        </div>
                    </div>
                </div>

                
            </div>
        </div> 
    }
}