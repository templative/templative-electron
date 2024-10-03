import React from "react";

import ScopedValueInput from "./ArtdataInputs/ScopedValueInput"
import ArtdataItemControls from "./ArtdataInputs/ArtdataItemControls"

import "../ArtdataViewer.css"

export default class StyleUpdate extends React.Component {   
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
        return <div className="input-group input-group-sm mb-3 "  data-bs-theme="dark"
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            >
            
            
            <ScopedValueInput 
                index={this.props.index} 
                updateArtdataFieldCallback={(index, field, value) => this.props.updateArtdataFieldCallback("styleUpdates", index, field, value)} 
                source={this.props.artdataItem.source} 
                scope={this.props.artdataItem.scope}
            />
            <input type="text" className="form-control" onChange={(event)=>this.props.updateArtdataFieldCallback("styleUpdates", this.props.index, "id", event.target.value)} aria-label="What key to replace..." value={this.props.artdataItem.id}/>
            <input type="text" className="form-control" onChange={(event)=>this.props.updateArtdataFieldCallback("styleUpdates", this.props.index, "cssValue", event.target.value)} aria-label="What key to replace..." value={this.props.artdataItem.cssValue}/>
            
            {/* { this.state.isHovering &&  */}
                <ArtdataItemControls index={this.props.index} deleteCallback={this.props.deleteCallback} updateArtdataItemOrderCallback={this.props.updateArtdataItemOrderCallback}/>
            {/* } */}
        </div>
    }
}