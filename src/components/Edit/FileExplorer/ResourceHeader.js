import React from "react";
import "./ResourceHeader.css"

export default class ResourceHeader extends React.Component {   
    render() {
        return <div className="resourcesHeaderWrapper">
            <p className="resourcesHeader">{this.props.header}</p>
        </div> 
    }
}