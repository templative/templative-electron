import React from "react";
import "./CreatePanel.css"
import ComponentType from "./ComponentType";
var axios  = window.require('axios');

const ComponentInfo = require("./componentInfo.json")
const StockComponentInfo = require("./stockComponentInfo.json")

const sortComponentTypes = (componentTypeQuantities, a, b) => {
    var aHasExisting = componentTypeQuantities[a] !== undefined
    var bHasExisting = componentTypeQuantities[b] !== undefined

    if (aHasExisting && !bHasExisting) {
        return -1;
    }
    if (bHasExisting && !aHasExisting) {
        return 1
    }
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

export default class CreatePanel extends React.Component {   
    state = {
        selectedComponentType: undefined,
        componentName: "",
        isProcessing: false
    }
    selectComponent(type) {
        if (this.state.selectedComponentType === type) {
            type = undefined
        }
        this.setState({ selectedComponentType: type })
    }
    updateComponentName(name) {
        this.setState({componentName: name})
    }
    async createComponent() {
        this.setState({isProcessing: true})
        var data = { 
            componentName: this.state.componentName,
            componentType: this.state.selectedComponentType,
            directoryPath: this.props.templativeProject.templativeRootDirectoryPath
        }
        await axios.post(`http://127.0.0.1:8080/component`, data)
        this.setState({isProcessing: false})
    }

    render() {
        var componentTypeQuantities = []
        this.props.templativeProject.componentCompose.forEach(element => {
            var currentValue = componentTypeQuantities[element.type] !== undefined ? componentTypeQuantities[element.type] : 0
            componentTypeQuantities[element.type] = 1 + currentValue
        });
        var components = Object.assign({}, StockComponentInfo, ComponentInfo)
        var componentTypeKeys = Object.keys(components).sort((a,b) => sortComponentTypes(componentTypeQuantities, a,b))
        var componentDivs = componentTypeKeys.map((key) => {
            var existingQuantity = componentTypeQuantities[key] !== undefined ? componentTypeQuantities[key] : 0
            return <ComponentType key={key} name={key} 
                selectTypeCallback={() => this.selectComponent(key)}
                selectedComponentType={this.state.selectedComponentType} 
                existingQuantity={existingQuantity}/>
        })

        var isCreateButtonDisabled = this.state.componentName === "" || this.state.selectedComponentType === undefined
        return <div className='mainBody row'>
            <div className="col main-col">
                <div className="row create-row">
                    <div className="input-group input-group-sm mb-3 create-component-input-group"  data-bs-theme="dark">
                        <span className="input-group-text">Component Name</span>
                        <input type="text" className="form-control" 
                            onChange={(event)=>this.updateComponentName(event.target.value)} 
                            aria-label="What key to replace..." 
                            value={this.state.componentName}
                        />
                        <button 
                            disabled={isCreateButtonDisabled}
                            className="btn btn-outline-secondary create-component-button" type="button" id="button-addon1"
                            onClick={()=>this.createComponent()}
                        >
                            { this.state.isProcessing && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                            Create
                        </button>
                    </div>
                </div>
                <div className="row create-component-by-type-choices">
                    <div className="component-type-list">
                        {componentDivs}
                    </div>
                </div>
            </div>     
        </div>
    }
}