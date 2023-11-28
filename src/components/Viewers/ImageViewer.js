import React from "react";
import "./ImageViewer.css"

export default class ImageViewer extends React.Component {   
    render() {
        return <div className="row">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
                </div>
                <img src={this.props.currentFilepath} alt=""/>
            </div>
        </div> 
    }
}