import React from "react";
import "./CreatePanel.css"
import ComponentTypeTagPicker from "./ComponentTypeTagPicker";
import TemplativeAccessTools from "../TemplativeAccessTools";
import ComponentTypeList from "./ComponentTypeList";
import { trackEvent } from "@aptabase/electron/renderer";
var axios = require('axios');

export default class CreatePanel extends React.Component {   
    state = {
        selectedComponentType: undefined,
        componentName: "",
        isToggledToComponents: true,
        components: [],
        tagFilters: new Set(),
        isProcessing: false
    }
    componentDidMount = async () => {
        trackEvent("view_createPanel")
        var components = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json")
        this.setState({components: components})
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.templativeRootDirectoryPath === this.props.templativeRootDirectoryPath) {
            return
        }
        var components = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json")
        this.setState({components: components})
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
        trackEvent("component_create")
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
        var componentTypes = this.state.isToggledToComponents ? this.props.componentTypesCustomInfo : this.props.componentTypesStockInfo
        var componentTypeOptions = Object.assign({}, componentTypes)
        var isCreateButtonDisabled = this.state.componentName === "" || this.state.selectedComponentType === undefined
        return <div className='mainBody'>
            <div className="main-col">
                <div className="create-row">
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
                <div className="tag-choices">
                    <div className="tag-choices-label">
                        <p >Filter by Tags</p>
                    </div>
                    <div className="form-check form-switch custom-or-stock">
                        <input className="form-check-input stock-toggle" type="checkbox" role="switch" checked={this.state.isToggledToComponents} onClick={this.toggleCustomOrStock}/>
                        <label className="form-check-label" for="flexSwitchCheckDefault">{this.state.isToggledToComponents ? "Custom" : "Stock"} Components</label>
                    </div>
                    <ComponentTypeTagPicker 
                        componentTypeOptions={componentTypeOptions} 
                        selectedTags={this.state.tagFilters}
                        toggleTagFilterCallback={this.toggleTagFilter}/>
                    
                </div>
                <div className="create-component-by-type-choices">
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