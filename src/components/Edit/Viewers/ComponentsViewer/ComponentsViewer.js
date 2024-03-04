import React from "react";
import ComponentItemEditable from "./ComponentItemEditable"
import "./ComponentViewer.css"
import { Link } from "react-router-dom";
import EditableViewerJson from "../EditableViewerJson";

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

    render() {
        var componentItems = []
        if (this.state.hasLoaded && this.state.content !== undefined) {
            this.state.content.forEach((component, index) => {
                var isFloatingName = this.state.floatingNameIndex === index
                componentItems.push(<ComponentItemEditable 
                    key={component.name} 
                    component={component} 
                    deleteComponentCallback={()=> this.deleteComponent(index)}
                    duplicateComponentCallback={() => this.duplicateComponent(index)}
                    isFloatingName={isFloatingName}
                    floatingName={this.state.floatingName}
                    updateFloatingNameCallback={(value) => this.updateFloatingName(index, value)}
                    releaseFloatingNameCallback={() => this.releaseFloatingName()}
                    updateComponentFieldCallback={(field, value)=> {this.updateComponentField(index, field, value)}}/>)
            });
        }

        return <div className="row componentViewer">
            <div className="col">
                <div className="row">
                    <div className="col editable-components">
                        <Link to="/create">
                            <button className="btn btn-primary add-components-button">Add Components</button>
                        </Link>
                        {componentItems}
                    </div>
                </div>
            </div>
        </div> 
    }
}