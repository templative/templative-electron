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
var path = require('path');
const addSpaces = (str) => {
    return str
        // First specifically handle D4, D6, D8, D10, D12, D20
        .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
        // Then handle measurement units, keeping them with their numbers
        .replace(/(\d+)(mm|cm)/g, '$1$2')
        // Add space between lowercase and uppercase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Add space between letters and numbers (except for measurement units)
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        // Fix dice notation
        .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
        .trim()
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
        await axios.post(`http://127.0.0.1:8085/component`, data)
        this.setState({isProcessing: false})
        var originalType = this.context.selectedComponentType
        this.context.setComponentName("");
        this.context.setSelectedComponentType(undefined);
        this.context.setComponentAIDescription("");
        if (!originalType.startsWith("STOCK_")) {
            this.props.changeTabsToEditAFileCallback("UNIFIED_COMPONENT", path.join(this.props.templativeRootDirectoryPath, `component-compose.json#${this.context.componentName}`))
        }
    }
    render() {
        var componentTypes = this.context.isToggledToComponents ? this.props.componentTypesCustomInfo : this.props.componentTypesStockInfo
        var componentTypeOptions = Object.assign({}, componentTypes)
        var isCreateButtonDisabled = this.state.isProcessing || this.context.componentName === "" || this.context.selectedComponentType === undefined
        return <div className='mainBody'>
            <div className="create-component-name-row">
                <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                    <span className="input-group-text soft-label">Composition Name</span>
                    <input type="text" className="form-control no-left-border" 
                        onChange={(event)=>this.context.setComponentName(event.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))} 
                        placeholder="nameOfTheComposition" 
                        value={this.context.componentName}
                    />

                    <button 
                        disabled={isCreateButtonDisabled}
                        className="btn btn-outline-secondary create-component-button" type="button" id="button-addon1"
                        onClick={()=>this.createComponent()}
                    >
                        { this.state.isProcessing && <span className="spinner-border spinner-border-sm creating-spinner"></span>}
                        Create
                    </button>
                </div>
                {/* <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                    <span className="input-group-text soft-label">Description</span>
                    <textarea className="form-control component-ai-description-textarea  no-left-border" 
                        rows="3"
                        disabled
                        onChange={(event)=>this.context.setComponentAIDescription(event.target.value)} 
                        placeholder="e.g. This a deck of foreign envoys. There is an envoy for Russia, Italy, France, Britain, and Sweden. Each card has a name and rules text. The background of the card matches the color of the country. Each card has an overlay that is a famous diplomat from that country..." 
                        value={this.context.componentAIDescription}
                    />
                </div> */}

                {this.state.isProcessing ? (
                    <p className="creation-instructions">Creating your component...</p>    
                ) : (
                    !isCreateButtonDisabled ? (
                        <p className="creation-explanation">A {addSpaces(this.context.selectedComponentType)} named {this.context.componentName}...</p>
                    ) : (
                        <p className="creation-instructions">Pick a type and give it a name.</p>
                    )
                )}
                
            </div>
            
            <div className="row component-type-picking-row g-0">
                {/* <div className={`col-3 tag-picker-container ${ this.state.isPickerVisible ? "expanded" : "collapsed"}`}>
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
                </div> */}
                <div className="col">
                    <div className="input-group input-group-sm search-components-box" data-bs-theme="dark">
                        <div className="form-check form-switch custom-or-stock">
                            <input 
                                className="form-check-input stock-toggle" 
                                type="checkbox" 
                                role="switch" 
                                checked={this.context.isToggledToComponents} 
                                onChange={() => {}} 
                                onClick={this.context.toggleCustomOrStock}
                            />
                            <label className="form-check-label">{this.context.isToggledToComponents ? "Custom" : "Stock"} Components</label>
                        </div>
                        <input type="text" className="form-control" placeholder={this.context.isToggledToComponents ? "Search Custom Component Types" : "Search Stock Components"} 
                            value={this.context.componentTypeSearch} 
                            onChange={(e)=> this.context.setComponentTypeSearch(e.target.value)}
                        />
                    </div>
                    <ComponentTypeList 
                        majorCategories={majorCategories}
                        selectedTags={this.state.tagFilters}  
                        selectTypeCallback={this.context.selectComponent}
                        search={this.context.componentTypeSearch}
                        selectedComponentType={this.context.selectedComponentType}  
                        componentTypeOptions={componentTypeOptions}/>
                </div>
            </div>     
        </div>
    }
}