import React from "react";
import "./Artdata.css"
const path = window.require("path");

export default class ArtdataList extends React.Component {   
    render() {
        var divs = [];
        for(var i = 0; i < this.props.filenames.length; i++) {
            divs.push(
                <div className="artdataItemWrapper">
                <p className="artdataItem" key={this.props.filenames[i]}>{path.parse(this.props.filenames[i]).name}</p>
            </div>)
        }
        return <div className="artdata">
            {divs}
        </div> 
    }
}