import React from "react";
import "./ArtdataViewer.css"

export default class ArtdataAddButton extends React.Component {   
    
    render() {
        return <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
            <button onClick={this.props.addArtdataCallback} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">➕</button>
        </div>
    }
}