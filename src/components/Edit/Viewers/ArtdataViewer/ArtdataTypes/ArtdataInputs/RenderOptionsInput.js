import React from "react";
import "../../ArtdataViewer.css"

export default class RenderOptionsInput extends React.Component {   
    
    render() {
        return <React.Fragment>
            <span className="input-group-text">🪲</span>
            <div className="input-group-text">
                <input className="form-check-input mt-0 rounded-checkbox" type="checkbox" value="" onChange={()=>this.props.updateArtdataFieldCallback(this.props.index, "isDebug", !this.props.isDebug)} checked={this.props.isDebug} aria-label="Checkbox for following text input" />
            </div>
            <span className="input-group-text">🔎</span>
            <div className="input-group-text">
                <input className="form-check-input mt-0 rounded-checkbox" type="checkbox" value="" onChange={()=>this.props.updateArtdataFieldCallback(this.props.index, "isComplex", !this.props.isComplex)} checked={this.props.isComplex} aria-label="Checkbox for following text input"/>
            </div>
       </React.Fragment>
    }
}