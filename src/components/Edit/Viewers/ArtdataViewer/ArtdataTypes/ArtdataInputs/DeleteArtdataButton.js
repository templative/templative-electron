import React from "react";
import "../../ArtdataViewer.css"
export default class DeleteArtdataButton extends React.Component {   
    
    render() {
        return <button onClick={()=>this.props.deleteCallback(this.props.index)} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">🗑️</button>
    }
}