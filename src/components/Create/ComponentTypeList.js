import React from "react";
import "./CreatePanel.css"
import ComponentType from "./ComponentType";
import {componentTypeHasAllFilteredTags} from "./TagFilter"

export default class ComponentTypeList extends React.Component {   
    render() {
        var componentDivs = Object.keys(this.props.componentTypeOptions)
            .filter((key) => {
                return this.props.selectedComponentType === key || componentTypeHasAllFilteredTags(this.props.selectedTags, this.props.componentTypeOptions[key]["Tags"])
            }).map((key) => {
                var existingQuantity = 0
                return <ComponentType key={key} 
                    name={key} componentInfo={this.props.componentTypeOptions[key]}
                    selectTypeCallback={this.props.selectTypeCallback}
                    selectedComponentType={this.props.selectedComponentType} 
                    existingQuantity={existingQuantity}/>
            })

        return <div className="component-type-list">
            {componentDivs}
        </div>
    }
}