import React from "react";
import "./ComponentItem.css"
export default class ComponentItem extends React.Component {   
    render() {
        return <div className="componentWrapper">
            <p className="componentItemTitle">{this.props.component.name}</p>
        </div>        
    }
}