import React from "react";
import ComponentItemEditable from "./ComponentItemEditable"
import "./ComponentViewer.css"
import TemplativeAccessTools from "../../../TemplativeAccessTools";
const fs = window.require("fs")
const path = window.require("path")

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
        components: [],
        hasLoaded: false,
        floatingName: undefined,
        floatingNameIndex: undefined
    }

    saveDocument() {
        if(!this.state.hasLoaded) {
            return
        }
        var newFileContents = JSON.stringify(this.state.components, null, 4)

        var componentComposeFilepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json")
        fs.writeFileSync(componentComposeFilepath, newFileContents, 'utf-8')
    }
    componentDidMount() {
        var components = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "component-compose.json")
        this.setState({components: components, hasLoaded: true})
    }
    componentWillUnmount(){
        this.saveDocument()
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

    render() {
        var componentItems = []
        this.state.components.forEach((component, index) => {
            var isFloatingName = this.state.floatingNameIndex === index
            componentItems.push(<ComponentItemEditable 
                key={component.name} 
                component={component} 
                deleteComponentCallback={()=> this.deleteComponent(index)}
                isFloatingName={isFloatingName}
                floatingName={this.state.floatingName}
                updateFloatingNameCallback={(value) => this.updateFloatingName(index, value)}
                releaseFloatingNameCallback={() => this.releaseFloatingName()}
                updateComponentFieldCallback={(field, value)=> {this.updateComponentField(index, field, value)}}/>)
        });

        return <div className="row componentViewer">
            <div className="col">
                <div className="row">
                    <h1>Components</h1>
                </div>
                <div className="row">
                    <div className="col">
                        {componentItems}
                    </div>
                </div>
            </div>
        </div> 
    }
}