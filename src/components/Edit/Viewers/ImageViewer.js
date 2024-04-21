import React from "react";
import "./ImageViewer.css"

export default class ImageViewer extends React.Component {   
    render() {
        return <div className="row image-viewer">
            <div className="col" align="center">
                <img className="stretchedImage" src={`file://${this.props.filepath}`} alt=""/>
            </div>
        </div> 
    }
}