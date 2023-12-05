import React from "react";
import "../../ArtdataViewer.css"
export default class ArtdataItemControls extends React.Component {   
    
    render() {
        return <React.Fragment>
            <button onClick={() => this.props.updateArtdataItemOrderCallback(this.props.index,this.props.index-1)} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">🡹</button>
            <button onClick={() => this.props.updateArtdataItemOrderCallback(this.props.index,this.props.index+1)} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">🡻</button>
            <button onClick={()=>this.props.deleteCallback(this.props.index)} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">🗑️</button>
        </React.Fragment>
    }
}