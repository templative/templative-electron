import React from "react";
import "./CreatePanel.css"
import "./TypeSelection/ComponentType.css"
import "./TypeSelection/ComponentTypeTags.css"
import "./CreatePanel.css"
import ComponentTypeTagPicker from "./TypeSelection/ComponentTypeTagPicker";
import TemplativeAccessTools from "../TemplativeAccessTools";
import ComponentTypeList from "./TypeSelection/ComponentTypePicker/ComponentTypeList";
import { trackEvent } from "@aptabase/electron/renderer";
import DocumentationButton from "../Documentation/DocumentationButton";
var axios = require('axios');
const addSpaces = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
        .replace(/(\d)([a-zA-Z])/g, '$1 $2'); // Add space between numbers and letters
}

const majorCategories = [
    "deck",
    "die",
    "board",
    "token",
    "mat",
    "packaging",
    "document",
]

export default class CreatePanel extends React.Component {   
    state = {
        selectedComponentType: undefined,
        componentName: "",
        isToggledToComponents: true,
        components: [],
        tagFilters: new Set(),
        isProcessing: false,
        isPickerVisible: false,
    }
    togglePickerVisibility = () => {
        this.setState({
          isPickerVisible: !this.state.isPickerVisible,
        });
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
            <div className="create-component-name-row">
                <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
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
                { !isCreateButtonDisabled && 
                    <p className="creation-explanation">A {addSpaces(this.state.selectedComponentType)} named {this.state.componentName}...</p>
                }
            </div>
            {/* <div className="form-check form-switch custom-or-stock">
                <input className="form-check-input stock-toggle" type="checkbox" role="switch" checked={this.state.isToggledToComponents} onClick={this.toggleCustomOrStock}/>
                <label className="form-check-label" for="flexSwitchCheckDefault">{this.state.isToggledToComponents ? "Custom" : "Stock"} Components</label>
            </div> */}
            <div className="row component-type-picking-row g-0">
                <div className={`col-3 tag-picker-container ${ this.state.isPickerVisible ? "expanded" : "collapsed"}`}>
                    <ComponentTypeTagPicker 
                        majorCategories={majorCategories}
                        componentTypeOptions={componentTypeOptions} 
                        selectedTags={this.state.tagFilters}
                        toggleTagFilterCallback={this.toggleTagFilter}/>
                </div>
                <div className="vertical-bar" onClick={this.togglePickerVisibility}>
                    <span>Filter by Tags {this.state.isPickerVisible ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up tags-chevron" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                            </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down tags-chevron" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    }</span>
                </div>
                <div className="col component-type-list-col">
                    <ComponentTypeList 
                        majorCategories={majorCategories}
                        selectedTags={this.state.tagFilters}  
                        selectTypeCallback={this.selectComponent}  
                        selectedComponentType={this.state.selectedComponentType}  
                        componentTypeOptions={componentTypeOptions}/>
                </div>
            </div>     
        </div>
    }
}