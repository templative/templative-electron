import React from "react";
import "./CreatePanel.css"

export default class ComponentType extends React.Component {      
    render() {
        return <button type="button" 
            className={`btn btn-dark component-type-card ${this.props.selectedComponentType === this.props.name && "selected-component-type"}`} 
            onClick={()=>this.props.selectTypeCallback(this.props.name)}
        >
            {this.props.existingQuantity !== 0 && `${this.props.existingQuantity}x `}{this.props.componentInfo["DisplayName"]}
        </button>
    }
}