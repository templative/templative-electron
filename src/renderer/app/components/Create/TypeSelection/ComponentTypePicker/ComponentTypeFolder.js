import React from "react";
import {componentTypeHasAllFilteredTags, matchesSearch} from "../../TagFilter"
import ComponentType from "./ComponentType";

export default class ComponentTypeFolder extends React.Component { 
    state = {
        isExtended: true
    }  
   
    toggleExtended = () => {
        this.setState({isExtended: !this.state.isExtended})
    }
    render = () => {            
        var folder = <div className="component-type-folder">
            <div className="component-type-header" onClick={this.toggleExtended}>
                <p className="rendered-component-title">{this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)}</p>
                <div className="component-output-extension-chevron">
                    {this.state.isExtended ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                        </svg>
                    }
                </div>
            </div>
            {this.state.isExtended && 
                <div className="component-output-content">
                    {
                        this.props.filteredComponentTypes.map(key =>
                            <ComponentType key={key} 
                                name={key} componentInfo={this.props.componentTypeOptions[key]}
                                selectTypeCallback={this.props.selectTypeCallback}
                                selectedComponentType={this.props.selectedComponentType} 
                                existingQuantity={0}
                                search={this.props.search}    
                            />
                        )
                    }
                </div>
            }
        </div>
        return folder
            
    }
}