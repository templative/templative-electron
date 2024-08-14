import React from "react";

export default class ComponentType extends React.Component {      
    addSpaces = (str) => {
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
            .replace(/(\d)([a-zA-Z])/g, '$1 $2'); // Add space between numbers and letters
    }
    render() {
        return <button type="button" 
            className={`btn btn-dark component-type-card ${this.props.selectedComponentType === this.props.name && "selected-component-type"}`} 
            onClick={()=>this.props.selectTypeCallback(this.props.name)}
        >
            {this.props.existingQuantity !== 0 && `${this.props.existingQuantity}x `}{this.addSpaces(this.props.componentInfo["DisplayName"])}
        </button>
    }
}