import React from "react";
import "./CreatePanel.css"
import ComponentType from "./ComponentType";
import {componentTypeHasAllFilteredTags} from "./TagFilter"

const sortComponentTypes = (componentTypeQuantities, a, b) => {
    var aHasExisting = componentTypeQuantities[a] !== undefined
    var bHasExisting = componentTypeQuantities[b] !== undefined

    if (aHasExisting && !bHasExisting) {
        return -1;
    }
    if (bHasExisting && !aHasExisting) {
        return 1
    }
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

export default class ComponentTypeList extends React.Component {   
    render() {
        var componentDivs = Object.keys(this.props.componentTypeOptions)
            .filter((key) => {
                return componentTypeHasAllFilteredTags(this.props.selectedTags, this.props.componentTypeOptions[key]["Tags"])
            }).map((key) => {
                var existingQuantity = componentTypeQuantities[key] !== undefined ? componentTypeQuantities[key] : 0
                return <ComponentType key={key} 
                    name={key} componentInfo={this.props.componentTypeOptions[key]}
                    selectTypeCallback={() => this.selectComponent(key)}
                    selectedComponentType={this.props.selectedComponentType} 
                    existingQuantity={existingQuantity}/>
            })

        return <div className="component-type-list">
            {componentDivs}
        </div>
    }
}