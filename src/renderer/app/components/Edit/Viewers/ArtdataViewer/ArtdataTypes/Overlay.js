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
        return <div className="input-group input-group-sm mb-3"  data-bs-theme="dark"
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            >
            <span className="input-group-text soft-label" title={`Update the X position of the overlay in pixels.`}>At X</span>

            <input type="number" className="form-control scoped-value-coordinate-input no-left-border" 
                onChange={(event) => {
                    const value = event.target.value;
                    if (value === '-' || value === '') {
                        this.props.updateArtdataFieldCallback("overlays", this.props.index, "positionX", value)
                    } else {
                        const numValue = parseInt(value);
                        if (!isNaN(numValue)) {
                            this.props.updateArtdataFieldCallback("overlays", this.props.index, "positionX", numValue)
                        }
                    }
                }} title={`Update the X position of the overlay in pixels.`} aria-label="X position..." value={this.props.artdataItem.positionX} placeholder="0"/>

            <span className="input-group-text soft-label" title={`Update the Y position of the overlay in pixels.`}>Y</span>

            <input type="number" className="form-control scoped-value-coordinate-input no-left-border" 
                onChange={(event) => {
                    const value = event.target.value;
                    if (value === '-' || value === '') {
                        this.props.updateArtdataFieldCallback("overlays", this.props.index, "positionY", value)
                    } else {
                        const numValue = parseInt(value);
                        if (!isNaN(numValue)) {
                            this.props.updateArtdataFieldCallback("overlays", this.props.index, "positionY", numValue)
                        }
                    }
                }} title={`Update the Y position of the overlay in pixels.`} aria-label="Y position..." value={this.props.artdataItem.positionY} placeholder="0"/>
            <span className="input-group-text soft-label" title={`Which file are you overlaying? This searches in the 'Art Files/Overlays' folder.`}>overlay</span>
            <ScopedValueInput 
                index={this.props.index}
                updateArtdataFieldCallback={(index, field, value) => this.props.updateArtdataFieldCallback("overlays", index, field, value)} 
                source={this.props.artdataItem.source} 
                scope={this.props.artdataItem.scope}
                availableDataSources={this.props.availableDataSources}
            />
            

            { this.state.isHovering && 
                <ArtdataItemControls 
                    index={this.props.index} 
                    deleteCallback={this.props.deleteCallback} 
                    updateArtdataItemOrderCallback={this.props.updateArtdataItemOrderCallback}
                    isFirst={this.props.index === 0}
                    isLast={this.props.isLast}
                />
            }
        </div>
    }
}