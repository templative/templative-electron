import React from "react";

import ScopedValueInput from "./ArtdataInputs/ScopedValueInput"
import RenderOptionsInput from "./ArtdataInputs/RenderOptionsInput"
import DeleteArtdataButton from "./ArtdataInputs/DeleteArtdataButton"

import "../ArtdataViewer.css"

export default class TextReplacement extends React.Component {   
    
    render() {
        var isDebug = this.props.artdataItem.isDebug === true
        var isComplex = this.props.artdataItem.isComplex === true
        return <div className="input-group mb-3 input-group-sm"  data-bs-theme="dark">
            <span className="input-group-text">🔑</span>
            <input type="text" className="form-control" onChange={()=>{}} aria-label="What key to replace..." value={this.props.artdataItem.key}/>
            <ScopedValueInput index={this.props.index} changeScopeCallback={this.props.changeScopeCallback} source={this.props.artdataItem.source} scope={this.props.artdataItem.scope}/>
            <RenderOptionsInput isDebug={isDebug} isComplex={isComplex}/>
            <DeleteArtdataButton deleteCallback={this.props.deleteCallback}/>
        </div> 
    }
}