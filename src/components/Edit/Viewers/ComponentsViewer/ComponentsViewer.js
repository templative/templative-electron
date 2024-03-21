import React from "react";
import ComponentItemEditable from "./ComponentItemEditable"
import "./ComponentViewer.css"
import { Link } from "react-router-dom";
import EditableViewerJson from "../EditableViewerJson";
import ComponentItemEditableStock from "./ComponentItemEditableStock";

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
        floatingNameIndex: undefined
    }

    getFilePath = (props) => {
        return path.join(props.templativeRootDirectoryPath, "component-compose.json")
    }

    updateComponentField(index, field, value) {
        var newComponents = this.state.content
        newComponents[index][field] = value
        this.setState({
            content: newComponents
        })
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
        })
    }
    deleteComponent(index) {
        var newComponents = this.state.content
        newComponents.splice(index,1)
        this.setState({
            content: newComponents.sort(sortComponents),
        })
    }
    duplicateComponent(index) {
        var newComponents = this.state.content
        var newComponent = {}
        for (const [key, value] of Object.entries(this.state.content[index])) {
            newComponent[key] = value
        }
        newComponent["name"] = `${newComponent["name"]}Copy`
        newComponents.push(newComponent)
        this.setState({
            content: newComponents.sort(sortComponents),
        })
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
            componentName={component.name}
            componentType={component.type}
            componentGamedataFilename={component.componentGamedataFilename}
            piecesGamedataFilename={component.piecesGamedataFilename}
            artdataFrontFilename={component.artdataFrontFilename}
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

    loadComponentItems = () => {
        if (!this.state.hasLoaded || this.state.content === undefined) {
            return []
        }
        return this.state.content.map((component, index) => this.loadComponent(component, index));
    }

    render() {
        var componentItems = this.loadComponentItems()
        return <div className="row componentViewer">
            <div className="col">
                <div className="row">
                    <div className="col editable-components">
                        <Link className="d-flex justify-content-center link-to-components" to="/create">
                            <button className="btn btn-primary add-components-button">Add Components</button>
                        </Link>
                        {componentItems}
                    </div>
                </div>
            </div>
        </div> 
    }
}