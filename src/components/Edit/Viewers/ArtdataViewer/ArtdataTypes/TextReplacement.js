import React from "react";

import ScopedValueInput from "./ArtdataInputs/ScopedValueInput"
import ArtdataItemControls from "./ArtdataInputs/ArtdataItemControls"

import "../ArtdataViewer.css"

export default class TextReplacement extends React.Component {   
    state = {
        isHovering: false
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    render() {
        var isDebug = this.props.artdataItem.isDebug === true
        var isComplex = this.props.artdataItem.isComplex === true
        return <div className="input-group mb-3 input-group-sm"  data-bs-theme="dark"
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            >
            <ScopedValueInput index={this.props.index} 
                updateArtdataFieldCallback={(index, field, value) => this.props.updateArtdataFieldCallback("textReplacements", index, field, value)} 
                source={this.props.artdataItem.source} scope={this.props.artdataItem.scope}/>
            
            <input type="text" className="form-control" onChange={(event)=>this.props.updateArtdataFieldCallback("textReplacements", this.props.index, "key", event.target.value)} value={this.props.artdataItem.key}/>
            <ArtdataItemControls index={this.props.index} deleteCallback={this.props.deleteCallback} updateArtdataItemOrderCallback={this.props.updateArtdataItemOrderCallback}/>
        </div> 
    }
}