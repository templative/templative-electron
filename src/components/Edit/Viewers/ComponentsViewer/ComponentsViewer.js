import React from "react";
import ComponentItemEditable from "./ComponentItemEditable"
import TemplativeAccessTools from "../../../TemplativeAccessTools";
import "./ComponentViewer.css"

const path = require("path")
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');

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

export default class ComponentsViewer extends React.Component {   
    state = {
        components: undefined,
        floatingName: undefined,
        floatingNameIndex: undefined
    }

    saveDocumentAsync = async (filepath, components) => {
        var newFileContents = JSON.stringify(components, null, 4)
        await this.props.saveFileAsyncCallback(filepath, newFileContents)
    }
    autosave = async () => {
        var filepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json")
        await this.saveDocumentAsync(filepath, this.state.components)
    }
    componentDidMount = async () => { 
        this.setState({components: await TemplativeAccessTools.readFileContentsAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json")})
        this.saveIntervalId = setIntervalAsync(this.autosave, 10*1000)
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.templativeRootDirectoryPath === this.props.templativeRootDirectoryPath) {
            return
        }
        var filepath = path.join(prevProps.templativeRootDirectoryPath, "component-compose.json")
        await this.saveDocumentAsync(filepath, this.state.components)

        this.setState({
            components: await TemplativeAccessTools.readFileContentsAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json")
        })
    }
    componentWillUnmount = async () => {
        if (this.saveIntervalId !== undefined) {
            await clearIntervalAsync(this.saveIntervalId)
            this.saveIntervalId = undefined
        }
        await this.autosave()
    }

    updateComponentField(index, field, value) {
        var newComponents = this.state.components
        newComponents[index][field] = value
        this.setState({
            components: newComponents
        })
    }
    updateFloatingName(index, value) {
        this.setState({floatingName: value, floatingNameIndex: index})
    }
    releaseFloatingName() {
        if (this.state.floatingName === undefined || this.state.floatingNameIndex === undefined) {
            return
        }
        var newComponents = this.state.components
        newComponents[this.state.floatingNameIndex]["name"] = this.state.floatingName
        this.setState({
            components: newComponents.sort(sortComponents),
            floatingName: undefined,
            floatingNameIndex: undefined
        })
    }
    deleteComponent(index) {
        var newComponents = this.state.components
        newComponents.splice(index,1)
        this.setState({
            components: newComponents.sort(sortComponents),
        })
    }
    duplicateComponent(index) {
        var newComponents = this.state.components
        var newComponent = {}
        for (const [key, value] of Object.entries(this.state.components[index])) {
            newComponent[key] = value
        }
        newComponent["name"] = `${newComponent["name"]}Copy`
        newComponents.push(newComponent)
        this.setState({
            components: newComponents.sort(sortComponents),
        })
    }

    render() {
        var componentItems = []
        if (this.state.components !== undefined) {
            this.state.components.forEach((component, index) => {
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
                        {componentItems}
                    </div>
                </div>
            </div>
        </div> 
    }
}