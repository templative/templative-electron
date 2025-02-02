import React from "react";

export default class ComponentType extends React.Component {      
    addSpaces = (str) => {
        return str
            // First specifically handle D4, D6, D8, D10, D12, D20
            .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
            // Then handle measurement units, keeping them with their numbers
            .replace(/(\d+)(mm|cm)/g, '$1$2')
            // Add space between lowercase and uppercase
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            // Add space between letters and numbers (except for measurement units)
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')
            // Clean up any double spaces
            .replace(/\s+/g, ' ')
            // Fix dice notation
            .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
            .trim()
    }
    render() {
        var subtitle = <></>
        if (this.props.componentInfo["DimensionsPixels"] !== undefined) {
            var pixelSize = `${this.props.componentInfo["DimensionsPixels"][0]}x${this.props.componentInfo["DimensionsPixels"][1]}px`
            subtitle =<p className="component-type-dimensions">{pixelSize}</p>
        }
        return <button type="button" 
            className={`btn btn-outline-primary component-type-card ${this.props.selectedComponentType === this.props.name && "selected-component-type"}`} 
            onClick={()=>this.props.selectTypeCallback(this.props.name)}
        >
            <p><strong>{this.props.existingQuantity !== 0 && `${this.props.existingQuantity}x `}{this.addSpaces(this.props.componentInfo["DisplayName"])}</strong></p>
            {subtitle}
        </button>
    }
}