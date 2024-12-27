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
            
            <span className="input-group-text soft-label" title={"What is the id of the element you are updating?"}>Find</span>

            <input type="text" className="form-control element-id-field no-left-border" onChange={(event)=>this.props.updateArtdataFieldCallback("styleUpdates", this.props.index, "id", event.target.value)} placeholder="Element with Id..." value={this.props.artdataItem.id}
                title={this.props.artdataItem.id === "" ? 
                    "Look for an element with an id like 'my-element' in the template and overlays." :
                    `Look for an element with the id ${this.props.artdataItem.id} in the template and overlays.`}
            />

            <span className="input-group-text soft-label" title={`Which style field are you updating in the element?`}>update</span>

            <input type="text" className="form-control css-field no-left-border" onChange={(event)=>this.props.updateArtdataFieldCallback("styleUpdates", this.props.index, "cssValue", event.target.value)} placeholder="Style..." value={this.props.artdataItem.cssValue}
                title={this.props.artdataItem.cssValue === "" ? 
                    "Update a style field like 'fill' of the element." :
                    `Update the ${this.props.artdataItem.cssValue} style field of the element.`}
            />

            <span className="input-group-text soft-label" title={`What value are you updating the style to?`}>with</span>

            <ScopedValueInput 
                index={this.props.index} 
                updateArtdataFieldCallback={(index, field, value) => this.props.updateArtdataFieldCallback("styleUpdates", index, field, value)} 
                source={this.props.artdataItem.source} 
                scope={this.props.artdataItem.scope}
                availableDataSources={this.props.availableDataSources}
            />
            
            { this.state.isHovering && 
                <ArtdataItemControls index={this.props.index} deleteCallback={this.props.deleteCallback} updateArtdataItemOrderCallback={this.props.updateArtdataItemOrderCallback} isFirst={this.props.index === 0}
                isLast={this.props.isLast}/>
            }
        </div>
    }
}