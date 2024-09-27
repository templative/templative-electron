import React from "react";

export default class ComponentType extends React.Component {      
    addSpaces = (str) => {
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
            .replace(/(\d)([a-zA-Z])/g, '$1 $2')
            .replace("D 4", "D4")
            .replace("D 6", "D6")
            .replace("D 8", "D8")
            .replace("D 12", "D12")
            .replace("D 20", "D20")
    }
    render() {
        var subtitle = <></>
        if (this.props.componentInfo["DimensionsPixels"] !== undefined) {
            var pixelSize = `${this.props.componentInfo["DimensionsPixels"][0]}x${this.props.componentInfo["DimensionsPixels"][1]}px`
            subtitle =<p className="component-type-dimensions">{pixelSize}</p>
        }
        return <button type="button" 
            className={`btn btn-dark component-type-card ${this.props.selectedComponentType === this.props.name && "selected-component-type"}`} 
            onClick={()=>this.props.selectTypeCallback(this.props.name)}
        >
            <p><strong> {this.props.existingQuantity !== 0 && `${this.props.existingQuantity}x `}{this.addSpaces(this.props.componentInfo["DisplayName"])}</strong></p>
            {subtitle}
        </button>
    }
}