import React from "react";
import ArtItem from "./ArtItem";

export default class ArtList extends React.Component {   
    render() {
        var divs = [];
        for(var i = 0; i < this.props.filenames.length; i++) {
            divs.push(
                <ArtItem filename={this.props.filenames[i]}/>    
            )
        }
        return <div className="artList">
            {divs}
        </div> 
    }
}