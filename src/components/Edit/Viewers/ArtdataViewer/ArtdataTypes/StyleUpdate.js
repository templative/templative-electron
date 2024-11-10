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
            
            <span className="input-group-text">Find</span>
            <input type="text" className="form-control element-id-field" onChange={(event)=>this.props.updateArtdataFieldCallback("styleUpdates", this.props.index, "id", event.target.value)} placeholder="Element with Id..." value={this.props.artdataItem.id}/>

            <span className="input-group-text">update</span>

            <input type="text" className="form-control css-field" onChange={(event)=>this.props.updateArtdataFieldCallback("styleUpdates", this.props.index, "cssValue", event.target.value)} placeholder="Style..." value={this.props.artdataItem.cssValue}/>
            <span className="input-group-text">with the</span>

            <ScopedValueInput 
                index={this.props.index} 
                updateArtdataFieldCallback={(index, field, value) => this.props.updateArtdataFieldCallback("styleUpdates", index, field, value)} 
                source={this.props.artdataItem.source} 
                scope={this.props.artdataItem.scope}
                availableDataSources={this.props.availableDataSources}
            />
            
            { this.state.isHovering && 
                <ArtdataItemControls index={this.props.index} deleteCallback={this.props.deleteCallback} updateArtdataItemOrderCallback={this.props.updateArtdataItemOrderCallback}/>
            }
        </div>
    }
}