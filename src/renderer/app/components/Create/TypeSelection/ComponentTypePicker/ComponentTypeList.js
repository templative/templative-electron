import React from "react";
import {componentTypeHasAllFilteredTags, matchesSearch} from "../../TagFilter"
import ComponentTypeFolder from "./ComponentTypeFolder";
import ComponentType from "./ComponentType";
import noFileIcon from "../../../Edit/noFileIcon.svg";

export default class ComponentTypeList extends React.Component {   
    
    render() {
        var componentDivs = Object.keys(this.props.componentTypeOptions)
            .filter((key) => {
                return componentTypeHasAllFilteredTags(this.props.selectedTags, this.props.componentTypeOptions[key]["Tags"], this.props.majorCategories)
            })
            .filter((key) => {
                return matchesSearch(this.props.search, key)
            })
            .sort()
            .map((key) => {
                var existingQuantity = 0
                return <ComponentType key={`${key}${this.props.search}`} 
                    name={key} componentInfo={this.props.componentTypeOptions[key]}
                    selectTypeCallback={this.props.selectTypeCallback}
                    selectedComponentType={this.props.selectedComponentType} 
                    existingQuantity={existingQuantity}
                    search={this.props.search}    
                />
            })
        
        var categoryToFilteredTypes = {}
        this.props.majorCategories.forEach(category => {
            var filteredComponentTypes = Object.keys(this.props.componentTypeOptions)
                .filter((key) => {                
                    var isMatchingTags = componentTypeHasAllFilteredTags(this.props.selectedTags, this.props.componentTypeOptions[key]["Tags"])
                    var isMatchingCategory = componentTypeHasAllFilteredTags([category], this.props.componentTypeOptions[key]["Tags"])
                    var isMatchingSearch = matchesSearch(this.props.search, key)
                    return isMatchingTags && isMatchingCategory && isMatchingSearch
                })
                .sort()
            if (filteredComponentTypes.length > 0) {
                categoryToFilteredTypes[category] = filteredComponentTypes
            }
        })

        var folders = Object.entries(categoryToFilteredTypes).map(([category, filteredComponentTypes]) => {
            return <ComponentTypeFolder 
                key={category} 
                search={this.props.search} 
                selectTypeCallback={this.props.selectTypeCallback} 
                category={category} 
                selectedTags={this.props.selectedTags} 
                componentTypeOptions={this.props.componentTypeOptions} 
                selectedComponentType={this.props.selectedComponentType} 
                filteredComponentTypes={filteredComponentTypes}
            />
        })
        var isSearchTooNarrow = 
            folders.length === 0 && 
            componentDivs.length === 0 && 
            Object.keys(this.props.componentTypeOptions).length > 0 && 
            this.props.search.trim() !== ""

        return <div className="component-type-list">
            {
                isSearchTooNarrow && <p className="no-results-message">Your search returned no results.</p>
            }
            {folders}
            {/* {folders.length !== 0 && <p>Other {folders.length}</p>}  */}
            {componentDivs}
            {(folders.length !== 0 || componentDivs.length !== 0) && 
                <div className="end-of-component-types-icon-container">
                    <img src={noFileIcon} className="end-of-component-types-icon"/>
                </div>
            }
        </div>
    }
}