import React from "react";
import "./CreatePanel.css"
import ComponentTypeTagPicker from "./ComponentTypeTagPicker";
import TemplativeAccessTools from "../TemplativeAccessTools";
import ComponentTypeList from "./ComponentTypeList";
var axios  = window.require('axios');

export default class CreatePanel extends React.Component {   
    state = {
        selectedComponentType: undefined,
        componentName: "",
        componentTypes: {},
        stockComponentTypes: {},
        isToggledToComponents: true,
        components: [],
        tagFilters: new Set(),
        isProcessing: false
    }
    async componentDidMount() {
        await axios.get(`http://127.0.0.1:8080/component-info`).then((response) => {
            this.setState({componentTypes: response.data})
        })
        await axios.get(`http://127.0.0.1:8080/stock-info`).then((response) => {
            this.setState({stockComponentTypes: response.data})
        })
        this.setState({components: TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "component-compose.json")})
    }
    selectComponent = (type) => {
        if (this.state.selectedComponentType === type) {
            type = undefined
        }
        this.setState({ selectedComponentType: type })
    }
    updateComponentName = (name) => {
        this.setState({componentName: name})
    }
    toggleTagFilter = (tag) => {
        var newTagFilters = this.state.tagFilters
        newTagFilters.has(tag) ? newTagFilters.delete(tag) : newTagFilters.add(tag)
        this.setState({tagFilters: newTagFilters})
    }
    async createComponent() {
        this.setState({isProcessing: true})
        var data = { 
            componentName: this.state.componentName,
            componentType: this.state.selectedComponentType,
            directoryPath: this.props.templativeRootDirectoryPath,
        }
        await axios.post(`http://127.0.0.1:8080/component`, data)
        this.setState({isProcessing: false, componentName: "", selectedComponentType: undefined})
    }
    toggleCustomOrStock = () => {
        this.setState({isToggledToComponents: !this.state.isToggledToComponents})
    }
    render() {
        var componentTypes = this.state.isToggledToComponents ? this.state.componentTypes : this.state.stockComponentTypes
        var componentTypeOptions = Object.assign({}, componentTypes)
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
                <div className="row custom-or-stock-row">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={this.state.isToggledToComponents} onClick={this.toggleCustomOrStock}/>
                        <label class="form-check-label" for="flexSwitchCheckDefault">{this.state.isToggledToComponents ? "Custom" : "Stock"} Components</label>
                    </div>
                </div>
                <div className="row tag-choices">
                    <ComponentTypeTagPicker 
                        componentTypeOptions={componentTypeOptions} 
                        selectedTags={this.state.tagFilters}
                        toggleTagFilterCallback={this.toggleTagFilter}/>
                </div>
                <div className="row create-component-by-type-choices">
                    <ComponentTypeList 
                        selectedTags={this.state.tagFilters}
                        selectTypeCallback={this.selectComponent}
                        selectedComponentType={this.state.selectedComponentType}
                        componentTypeOptions={componentTypeOptions}/>
                </div>
            </div>     
        </div>
    }
}