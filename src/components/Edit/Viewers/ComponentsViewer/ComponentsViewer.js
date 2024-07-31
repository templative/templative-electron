import React from "react";
import ComponentItemEditable from "./ComponentItems/ComponentItemEditable"
import "./ComponentViewer.css"
import EditableViewerJson from "../EditableViewerJson";
import ComponentItemEditableStock from "./ComponentItems/ComponentItemEditableStock";
import ComponentFilters from "./ComponentFilters/ComponentFilters";
import NoComponentsSVG from "./noComponents.svg"

const path = require("path")

const sortComponents = (a, b) => {
    var aCode = `${a.type}${a.name}`
    var bCode = `${b.type}${b.name}`
    if (aCode < bCode) {
        return -1;
      }
      if (aCode > bCode) {
        return 1;
      }
      return 0;
}

export default class ComponentsViewer extends EditableViewerJson {   
    state = {
        floatingName: undefined,
        floatingNameIndex: undefined,
        filteredComponentType: undefined,
    }

    getFilePath = (props) => {
        return path.join(props.templativeRootDirectoryPath, "component-compose.json")
    }

    updateComponentField(index, field, value) {
        var newComponents = this.state.content
        newComponents[index][field] = value
        this.setState({
            content: newComponents
        },this.autosave)
    }
    updateFloatingName(index, value) {
        this.setState({floatingName: value, floatingNameIndex: index})
    }
    releaseFloatingName() {
        if (this.state.floatingName === undefined || this.state.floatingNameIndex === undefined) {
            return
        }
        var newComponents = this.state.content
        newComponents[this.state.floatingNameIndex]["name"] = this.state.floatingName
        this.setState({
            content: newComponents.sort(sortComponents),
            floatingName: undefined,
            floatingNameIndex: undefined
        },this.autosave)
    }
    deleteComponent = (index) => {
        console.log(index)
        var newComponents = this.state.content
        newComponents.splice(index,1)
        this.setState({
            content: newComponents.sort(sortComponents),
        },this.autosave)
    }
    duplicateComponent = (index) => {
        var newComponents = this.state.content
        var newComponent = {}
        for (const [key, value] of Object.entries(this.state.content[index])) {
            newComponent[key] = value
        }
        newComponent["name"] = `${newComponent["name"]}Copy`
        newComponents.push(newComponent)
        this.setState({
            content: newComponents.sort(sortComponents),
        },this.autosave)
    }

    loadComponent = (component, index) => {
        var isFloatingName = this.state.floatingNameIndex === index
        var isStock = component.type.split("_").shift() === "STOCK"
        if (isStock) {
            return <ComponentItemEditableStock 
                updateViewedFileUsingExplorerAsyncCallback ={this.props.updateViewedFileUsingExplorerAsyncCallback }
                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                key={component.name} 
                component={component} 
                componentTypesCustomInfo={this.props.componentTypesCustomInfo}
                componentTypesStockInfo={this.props.componentTypesStockInfo}
                deleteComponentCallback={()=> this.deleteComponent(index)}
                duplicateComponentCallback={() => this.duplicateComponent(index)}
                isFloatingName={isFloatingName}
                floatingName={this.state.floatingName}
                updateFloatingNameCallback={(value) => this.updateFloatingName(index, value)}
                releaseFloatingNameCallback={() => this.releaseFloatingName()}
                updateComponentFieldCallback={(field, value)=> {this.updateComponentField(index, field, value)}}
            />
        }
        
        return <ComponentItemEditable 
            updateViewedFileUsingExplorerAsyncCallback ={this.props.updateViewedFileUsingExplorerAsyncCallback }
            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
            key={component.name} 
            componentTypesCustomInfo={this.props.componentTypesCustomInfo}
            componentTypesStockInfo={this.props.componentTypesStockInfo}
            componentName={component.name}
            componentType={component.type}
            componentGamedataFilename={component.componentGamedataFilename}
            piecesGamedataFilename={component.piecesGamedataFilename}
            artdataFrontFilename={component.artdataFrontFilename}
            artdataDieFaceFilename={component.artdataDieFaceFilename}
            artdataBackFilename={component.artdataBackFilename}
            isDebugInfo={component.isDebugInfo}
            disabled={component.disabled}
            quantity={component.quantity}
            deleteComponentCallback={()=> this.deleteComponent(index)}
            duplicateComponentCallback={() => this.duplicateComponent(index)}
            isFloatingName={isFloatingName}
            floatingName={this.state.floatingName}
            updateFloatingNameCallback={(value) => this.updateFloatingName(index, value)}
            releaseFloatingNameCallback={() => this.releaseFloatingName()}
            updateComponentFieldCallback={(field, value)=> {this.updateComponentField(index, field, value)}}
        />
    }

    filterByComponentType = (componentType) => {
        this.setState({filteredComponentType: componentType})
    }

    removedFilteredComponentType = () => {
        this.setState({filteredComponentType: undefined})
    }

    loadComponentItems = () => {
        if (!this.state.hasLoaded || this.state.content === undefined) {
            return []
        }
        var componentItems = []
        this.state.content.forEach((component, index) => {
            if (this.state.filteredComponentType !== undefined && this.state.filteredComponentType !== component.type) {
                return
            }
            componentItems.push(this.loadComponent(component, index))
        });
        return componentItems
    }

    render() {
        var componentItems = this.loadComponentItems()
        var components = !this.state.hasLoaded || this.state.content === undefined ? [] : this.state.content
        return <div className="row componentViewer no-gutters">
            <div className="col no-gutters">
                <div className="row component-filters-row">
                    <div className="col no-gutters">
                        <ComponentFilters 
                            components={components}
                            componentTypeFilter={this.state.filteredComponentType}
                            filterByComponentTypeCallback={this.filterByComponentType}
                            removedFilteredComponentTypeCallback={this.removedFilteredComponentType}
                        />
                    </div>
                </div>
                <div className="row component-items-row">
                    <div className="col no-gutters">
                        { componentItems.length === 0 &&
                            <img className="no-components-svg" src={NoComponentsSVG} alt="Suggestion to create a component with the create components tab"/>
                        }
                        {componentItems}
                    </div>
                </div>
            </div>
        </div> 
    }
}