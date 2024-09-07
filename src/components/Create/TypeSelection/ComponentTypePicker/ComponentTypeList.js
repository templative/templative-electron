import React from "react";
import {componentTypeHasAllFilteredTags} from "../../TagFilter"
import ComponentTypeFolder from "./ComponentTypeFolder";
import ComponentType from "./ComponentType";

export default class ComponentTypeList extends React.Component {   
    render() {
        var componentDivs = Object.keys(this.props.componentTypeOptions)
            .filter((key) => {
                return componentTypeHasAllFilteredTags(this.props.selectedTags, this.props.componentTypeOptions[key]["Tags"], this.props.majorCategories)
            })
            .sort()
            .map((key) => {
                var existingQuantity = 0
                return <ComponentType key={key} 
                    name={key} componentInfo={this.props.componentTypeOptions[key]}
                    selectTypeCallback={this.props.selectTypeCallback}
                    selectedComponentType={this.props.selectedComponentType} 
                    existingQuantity={existingQuantity}/>
            })

        var folders = this.props.majorCategories.map(category => 
            <ComponentTypeFolder key={category} selectTypeCallback={this.props.selectTypeCallback} category={category} selectedTags={this.props.selectedTags} componentTypeOptions={this.props.componentTypeOptions} selectedComponentType={this.props.selectedComponentType}/>
        )
        return <div className="component-type-list">
            {folders}
            {/* {folders.length !== 0 && <p>Other {folders.length}</p>}  */}
            {componentDivs}
            
        </div>
    }
}