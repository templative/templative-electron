import React from "react";
import "./ComponentViewer.css"
import EditableViewerJson from "../EditableViewerJson";
import ComponentItemEditableStock from "./ComponentItems/ComponentItemEditableStock";
import ComponentFilters from "./ComponentFilters/ComponentFilters";
import NoComponentsSVG from "./noComponents.svg"
import ComponentItem from "./ComponentItems/ComponentItem";
import TemplativeAccessTools from "../../../TemplativeAccessTools";

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
    constructor(props) {
        super(props);
        this.state = {
            floatingName: undefined,
            floatingNameIndex: undefined,
            filteredComponentType: undefined,
            filteredNameSubstring: undefined,
            componentThumbnails: {},
            showDeleteConfirm: false,
            componentToDelete: null,
        }
        this.scrollableDivRef = React.createRef();
    }

    getFilePath = (props) => {
        return path.join(props.templativeRootDirectoryPath, "component-compose.json")
    }

    updateComponentField(index, field, value) {
        var newComponents = this.state.content
        newComponents[index][field] = value
        this.setState({
            content: newComponents
        }, async () => this.autosave())
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
        }, async () => this.autosave())
    }
    deleteComponent(index) {
        var newComponents = this.state.content
        newComponents.splice(index,1)
        this.setState({
            content: newComponents.sort(sortComponents),
            showDeleteConfirm: false,
            componentToDelete: null
        }, async () => this.autosave())
    }
    duplicateComponent = (index) => {
        var newComponents = this.state.content
        var newComponent = {}
        for (const [key, value] of Object.entries(this.state.content[index])) {
            newComponent[key] = value
        }
        newComponent["name"] = `${newComponent["name"]}Copy`
        newComponents.push(newComponent)
        this.setState({
            content: newComponents.sort(sortComponents),
        }, async () => this.autosave())
    }

    loadComponent = (component, index, thumbnailSource) => {
        var isFloatingName = this.state.floatingNameIndex === index
        var isStock = component.type.split("_").shift() === "STOCK"
        if (isStock) {
            return <ComponentItemEditableStock 
                updateViewedFileUsingExplorerAsyncCallback ={this.props.updateViewedFileUsingExplorerAsyncCallback }
                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                key={component.name} 
                component={component} 
                componentTypesCustomInfo={this.props.componentTypesCustomInfo}
                componentTypesStockInfo={this.props.componentTypesStockInfo}
                deleteComponentCallback={() => this.handleDelete(index)}
                duplicateComponentCallback={() => this.duplicateComponent(index)}
                isFloatingName={isFloatingName}
                floatingName={this.state.floatingName}
                updateFloatingNameCallback={(value) => this.updateFloatingName(index, value)}
                releaseFloatingNameCallback={() => this.releaseFloatingName()}
                updateComponentFieldCallback={(field, value)=> {this.updateComponentField(index, field, value)}}
                thumbnailSource={thumbnailSource}
            />
        }
        
        return <ComponentItem
            updateViewedFileUsingExplorerAsyncCallback ={this.props.updateViewedFileUsingExplorerAsyncCallback }
            updateViewedFileToUnifiedAsyncCallback={this.props.updateViewedFileToUnifiedAsyncCallback}
            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
            key={component.name} 
            componentTypesCustomInfo={this.props.componentTypesCustomInfo}
            componentTypesStockInfo={this.props.componentTypesStockInfo}
            componentName={component.name}
            componentType={component.type}
            componentGamedataFilename={component.componentGamedataFilename}
            piecesGamedataFilename={component.piecesGamedataFilename}
            artdataFrontFilename={component.artdataFrontFilename}
            artdataDieFaceFilename={component.artdataDieFaceFilename}
            artdataBackFilename={component.artdataBackFilename}
            isDebugInfo={component.isDebugInfo}
            disabled={component.disabled}
            quantity={component.quantity}
            deleteComponentCallback={() => this.handleDelete(index)}
            duplicateComponentCallback={() => this.duplicateComponent(index)}
            isFloatingName={isFloatingName}
            floatingName={this.state.floatingName}
            updateFloatingNameCallback={(value) => this.updateFloatingName(index, value)}
            releaseFloatingNameCallback={() => this.releaseFloatingName()}
            updateComponentFieldCallback={(field, value)=> {this.updateComponentField(index, field, value)}}
            thumbnailSource={thumbnailSource}
            updateRouteCallback={this.props.updateRouteCallback}
        />
    }

    filterByComponentType = (componentType) => {
        this.setState({filteredComponentType: componentType})
    }

    removedFilteredComponentType = () => {
        this.setState({filteredComponentType: undefined})
    }
    getCommonPrefixes(names) {
        // This will store the valid prefixes and their occurrences
        let prefixCounts = {};

        // Iterate through the names and compare each name with every other name
        for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
                let prefix = this.getPrefix(names[i], names[j]);
                if (prefix.length <= 2) {
                    continue
                }
                // If the prefix already exists, increment its count
                if (prefixCounts[prefix]) {
                    prefixCounts[prefix]++;
                    continue
                } 
                let isSubPrefix = false;

                // Check if this prefix is already part of a longer or shorter prefix
                for (let existingPrefix in prefixCounts) {
                    if (existingPrefix.startsWith(prefix) || prefix.startsWith(existingPrefix)) {
                        isSubPrefix = true;
                        // If the current prefix is shorter, replace the longer one
                        if (prefix.length < existingPrefix.length) {
                            delete prefixCounts[existingPrefix];
                            prefixCounts[prefix] = 2;
                        }
                        break;
                    }
                }

                if (!isSubPrefix) {
                    prefixCounts[prefix] = 2;  // Initialize with 2 since it's found in two names
                }
                
            }
        }

        // Filter out prefixes that occur less than twice
        return Object.keys(prefixCounts).filter(prefix => prefixCounts[prefix] >= 2);
    }
    
    // Helper function to get prefix between two strings
    getPrefix(str1, str2) {
        let minLength = Math.min(str1.length, str2.length);
        let prefix = "";
    
        var lastCase = undefined
        for (let i = 0; i < minLength; i++) {
            let char1 = str1[i];
            let char2 = str2[i];
    
            var isTheSameChar = char1 !== char2
            if (isTheSameChar) {
                break;
            }
            var isSpace = /[\s]/.test(char1)
            var isSpecialCharacter = /[\W]/.test(char1)
            var isChangeInCaseFromLastCharacter = lastCase !== undefined && this.isUpperCase(char1) !== lastCase
            if (isSpace || isSpecialCharacter || isChangeInCaseFromLastCharacter) {
                break;
            }
            if (!isSpecialCharacter) {
                lastCase = this.isUpperCase(char1)
            }
            prefix += char1;
        }
        return prefix;
    }
    isUpperCase(char) {
        return char === char.toUpperCase();
    }
    loadComponentHeaders = () => {
        if (!this.state.hasLoaded || this.state.content === undefined) {
            return []
        }
        
        let componentHeaders = [];
        this.state.content.forEach((component) => {
            if (this.state.filteredComponentType === undefined || this.state.filteredComponentType === component.type) {
                componentHeaders.push(component.name);
            }
        });
        return this.getCommonPrefixes(componentHeaders);
    }
    setFilteredNameSubstring = (filteredNameSubstring) => {
        if (filteredNameSubstring !== undefined && this.state.filteredNameSubstring === filteredNameSubstring) {
            this.setState({filteredNameSubstring: undefined})
            return
        }
        this.setState({filteredNameSubstring})
    }
    loadComponentItems = () => {
        if (!this.state.hasLoaded || this.state.content === undefined) {
            return []
        }
        let enabledComponents = [];
        let disabledComponents = [];

        this.state.content.forEach((component, index) => {
            if (this.state.filteredComponentType !== undefined && this.state.filteredComponentType !== component.type) {
                return;
            }
            if (this.state.filteredNameSubstring !== undefined && !component.name.startsWith(this.state.filteredNameSubstring)) {
                return;
            }
            let isStock = component.type.split("_").shift() === "STOCK";
            let isDisabled = component.disabled;

            const thumbnailSource = this.state.componentThumbnails[component.name];
            
            if (isDisabled) {
                disabledComponents.push(this.loadComponent(component, index, thumbnailSource));
            } else {
                enabledComponents.push(this.loadComponent(component, index, thumbnailSource));
            }
        });

        return [...enabledComponents, ...disabledComponents];
    }
    async componentDidMount() {
        if (this.scrollableDivRef.current) {
          this.scrollableDivRef.current.addEventListener('scroll', this.handleScroll);
          this.scrollableDivRef.current.scrollTop = this.props.componentComposeScollPosition || 0;
        }
        await super.componentDidMount()
        await this.loadAllThumbnails();
    }
    async componentDidUpdate (prevProps, prevState) {
        if (this.scrollableDivRef.current) {
            this.scrollableDivRef.current.scrollTop = this.props.componentComposeScollPosition || 0;
        }
        await super.componentDidUpdate(prevProps, prevState)
    }
    
    async componentWillUnmount() {
        if (this.scrollableDivRef.current) {
            this.scrollableDivRef.current.removeEventListener('scroll', this.handleScroll);
        }
        await super.componentWillUnmount()
    }
    handleScroll = () => {
        if (this.scrollableDivRef.current) {
            const scrollTop = this.scrollableDivRef.current.scrollTop;
            this.props.updateComponentComposeScrollPositionCallback(scrollTop)
        }
    };

    loadAllThumbnails = async () => {
        if (!this.state.content) return;
        
        const componentNames = this.state.content.map(component => component.name);
        const thumbnails = await TemplativeAccessTools.getAllComponentThumbnails(
            this.props.templativeRootDirectoryPath,
            componentNames
        );
        console.log(thumbnails)
        this.setState({ componentThumbnails: thumbnails });
    }

    handleDelete = (index) => {
        this.setState({ 
            showDeleteConfirm: true,
            componentToDelete: index
        });
    }

    confirmDelete = () => {
        this.deleteComponent(this.state.componentToDelete);
    }

    cancelDelete = () => {
        this.setState({ 
            showDeleteConfirm: false,
            componentToDelete: null
        });
    }

    render() {
        var componentItems = this.loadComponentItems()
        var componentHeaders = this.loadComponentHeaders()
        
        var components = !this.state.hasLoaded || this.state.content === undefined ? [] : this.state.content
        var hasFilteredAwaySelectedHeader = componentHeaders.length === 0 && this.state.filteredNameSubstring !== undefined
        return <div className="row componentViewer no-gutters">
            {(componentHeaders.length > 0 || hasFilteredAwaySelectedHeader) && 
                <div className="col-0 col-xl-2">
                    <div className="component-headers">
                        <p className="component-headers-header">Component Categories</p>
                        {componentHeaders.map(header => <p key={header} className={`component-header ${header === this.state.filteredNameSubstring && "selected-component-header"}`} onClick={() => this.setFilteredNameSubstring(header)}>{header}</p>)}
                        {componentHeaders.length === 0 &&
                            <p className="component-header selected-component-header" onClick={() => this.setFilteredNameSubstring(this.state.filteredNameSubstring)}>{this.state.filteredNameSubstring}</p>
                        }
                    </div>
                </div>
            }
            <div className="col no-gutters">
                <div className={`row component-filters-row ${this.state.showDeleteConfirm ? 'pe-none' : ''}`}>
                    <div className="col no-gutters">
                        <ComponentFilters 
                            components={components}
                            filteredNameSubstring={this.state.filteredNameSubstring}
                            componentTypeFilter={this.state.filteredComponentType}
                            filterByComponentTypeCallback={this.filterByComponentType}
                            removedFilteredComponentTypeCallback={this.removedFilteredComponentType}
                        />
                    </div>
                </div>
                <div className={`row component-items-row ${this.state.showDeleteConfirm ? 'pe-none' : ''}`}>
                    <div className="col no-gutters" ref={this.scrollableDivRef}>
                        { componentItems.length === 0 &&
                            <img className="no-components-svg" src={NoComponentsSVG} alt="Suggestion to create a component with the create components tab"/>
                        }
                        {componentItems}
                    </div>
                </div>
            </div>

            {this.state.showDeleteConfirm && (
                <>
                    <div className="modal-backdrop show"></div>
                    <div className="modal show d-block delete-modal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delete {this.state.content[this.state.componentToDelete].name}?</h5>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete the <span className="component-name-to-delete">{this.state.content[this.state.componentToDelete].name}</span>?</p>
                                    <p className="deletion-disclaimer">This does not delete the art files, the artdata files, nor the gamedata files that this component currently uses.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.cancelDelete}>Cancel</button>
                                    <button type="button" className="btn btn-danger" onClick={this.confirmDelete}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div> 
    }
}