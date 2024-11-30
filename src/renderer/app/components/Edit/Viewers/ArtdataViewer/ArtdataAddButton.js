import React from "react";
import "./ArtdataViewer.css"

export default class ArtdataAddButton extends React.Component {   
    
    render() {
        return <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
            <button onClick={this.props.addArtdataCallback} className="btn btn-outline-secondary add-button" type="button" id="button-addon1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg add-field-plus" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                </svg>
                Add {this.props.whatToAdd}
            </button>
        </div>
    }
}