import React from "react";

import ScopedValueInput from "./ArtdataInputs/ScopedValueInput"
import RenderOptionsInput from "./ArtdataInputs/RenderOptionsInput"
import DeleteArtdataButton from "./ArtdataInputs/DeleteArtdataButton"

import "../ArtdataViewer.css"

export default class StyleUpdate extends React.Component {   
    
    render() {
        var isDebug = this.props.artdataItem.isDebug === true
        var isComplex = this.props.artdataItem.isComplex === true
        return <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
            <ScopedValueInput 
                index={this.props.index}
                updateArtdataFieldCallback={(index, field, value) => this.props.updateArtdataFieldCallback("overlays", index, field, value)} 
                source={this.props.artdataItem.source} 
                scope={this.props.artdataItem.scope}
            />
            <RenderOptionsInput 
                updateArtdataFieldCallback={(index, field, value) => this.props.updateArtdataFieldCallback("overlays", index, field, value)} 
                isDebug={isDebug} 
                isComplex={isComplex}
                index={this.props.index} 
            />
            <DeleteArtdataButton index={this.props.index} deleteCallback={this.props.deleteCallback}/>
        </div>
    }
}