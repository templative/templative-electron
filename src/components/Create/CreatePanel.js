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
import { RenderingWorkspaceContext } from '../Render/RenderingWorkspaceProvider';
var axios = require('axios');
const addSpaces = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
        .replace(/(\d)([a-zA-Z])/g, '$1 $2')
        .replace("D 4", "D4")
        .replace("D 6", "D6")
        .replace("D 8", "D8")
        .replace("D 12", "D12")
        .replace("D 20", "D20")
}

const majorCategories = [
    "deck", "die", "board","token","mat","packaging","box", "document",
    "animal", "blank", "building", "minifig", "vehicle"
]

export default class CreatePanel extends React.Component {   
    static contextType = RenderingWorkspaceContext;

    state = {
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
        if (this.context.selectedComponentType === type) {
            type = undefined
        }
        this.context.setSelectedComponentType(type);
    }

    updateComponentName = (name) => {
        this.context.setComponentName(name);
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
            componentName: this.context.componentName,
            componentType: this.context.selectedComponentType,
            directoryPath: this.props.templativeRootDirectoryPath,
            componentAIDescription: this.context.componentAIDescription
        }
        await axios.post(`http://127.0.0.1:8080/component`, data)
        this.setState({isProcessing: false})
        this.context.setComponentName("");
        this.context.setSelectedComponentType(undefined);
        this.context.setComponentAIDescription("")
    }

    toggleCustomOrStock = () => {
        this.context.setIsToggledToComponents(!this.context.isToggledToComponents);
        this.context.setSelectedComponentType(undefined);
    }

    render() {
        var componentTypes = this.context.isToggledToComponents ? this.props.componentTypesCustomInfo : this.props.componentTypesStockInfo
        var componentTypeOptions = Object.assign({}, componentTypes)
        var isCreateButtonDisabled = this.context.componentName === "" || this.context.selectedComponentType === undefined
        return <div className='mainBody'>
            <div className="create-component-name-row">
                <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">

                    <div className="form-check form-switch custom-or-stock">
                        <input className="form-check-input stock-toggle" type="checkbox" role="switch" checked={this.context.isToggledToComponents} onChange={() => {}} onClick={this.toggleCustomOrStock}/>
                        <label className="form-check-label">{this.context.isToggledToComponents ? "Custom" : "Stock"} Components</label>
                    </div>

                    <span className="input-group-text">Component Name</span>
                    <input type="text" className="form-control" 
                        onChange={(event)=>this.updateComponentName(event.target.value)} 
                        placeholder="The name of the component" 
                        value={this.context.componentName}
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
                <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                    <span className="input-group-text">Description</span>
                    <textarea className="form-control" 
                        rows="3"
                        onChange={(event)=>this.context.setComponentAIDescription(event.target.value)} 
                        placeholder="e.g. This a deck of foreign envoys. There is an envoy for Russia, Italy, France, Britain, and Sweden. Each card has a name and rules text. The background of the card matches the color of the country. Each card has an overlay that is a famous diplomat from that country..." 
                        value={this.context.componentAIDescription}
                        disabled
                    />
                </div>
                { !isCreateButtonDisabled && 
                    <p className="creation-explanation">A {addSpaces(this.context.selectedComponentType)} named {this.context.componentName}...</p>
                }
                
            </div>
            
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
                        selectedComponentType={this.context.selectedComponentType}  
                        componentTypeOptions={componentTypeOptions}/>
                </div>
            </div>     
        </div>
    }
}