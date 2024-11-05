import React from "react";
import {componentTypeHasAllFilteredTags, matchesSearch} from "../../TagFilter"
import ComponentTypeFolder from "./ComponentTypeFolder";
import ComponentType from "./ComponentType";

export default class ComponentTypeList extends React.Component {   
    state={search: ""}
    updateSearch = async (search) => {
        this.setState({search: search})
    }
    render() {
        var componentDivs = Object.keys(this.props.componentTypeOptions)
            .filter((key) => {
                return componentTypeHasAllFilteredTags(this.props.selectedTags, this.props.componentTypeOptions[key]["Tags"], this.props.majorCategories)
            })
            .filter((key) => {
                return matchesSearch(this.state.search, key)
            })
            .sort()
            .map((key) => {
                var existingQuantity = 0
                return <ComponentType key={`${key}${this.state.search}`} 
                    name={key} componentInfo={this.props.componentTypeOptions[key]}
                    selectTypeCallback={this.props.selectTypeCallback}
                    selectedComponentType={this.props.selectedComponentType} 
                    existingQuantity={existingQuantity}
                    search={this.state.search}    
                />
            })
        
        var folders = this.props.majorCategories.map(category => 
            <ComponentTypeFolder key={category} search={this.state.search} selectTypeCallback={this.props.selectTypeCallback} category={category} selectedTags={this.props.selectedTags} componentTypeOptions={this.props.componentTypeOptions} selectedComponentType={this.props.selectedComponentType}/>
        )
        return <div className="component-type-list">
            <div className="input-group input-group-sm search-components-box" data-bs-theme="dark">
                <input type="text" className="form-control" placeholder="Search Components" 
                    value={this.state.search} 
                    onChange={(e)=> this.updateSearch(e.target.value)}
                />
            </div>
            {folders}
            {/* {folders.length !== 0 && <p>Other {folders.length}</p>}  */}
            {componentDivs}
            
        </div>
    }
}