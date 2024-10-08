import React from "react";
import "./ComponentViewer.css"
import EditableViewerJson from "../EditableViewerJson";
import ComponentItemEditableStock from "./ComponentItems/ComponentItemEditableStock";
import ComponentFilters from "./ComponentFilters/ComponentFilters";
import NoComponentsSVG from "./noComponents.svg"
import ComponentItem from "./ComponentItems/ComponentItem";

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
    deleteComponent = (index) => {
        console.log(index)
        var newComponents = this.state.content
        newComponents.splice(index,1)
        this.setState({
            content: newComponents.sort(sortComponents),
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

    loadComponent = (component, index) => {
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
                deleteComponentCallback={()=> this.deleteComponent(index)}
                duplicateComponentCallback={() => this.duplicateComponent(index)}
                isFloatingName={isFloatingName}
                floatingName={this.state.floatingName}
                updateFloatingNameCallback={(value) => this.updateFloatingName(index, value)}
                releaseFloatingNameCallback={() => this.releaseFloatingName()}
                updateComponentFieldCallback={(field, value)=> {this.updateComponentField(index, field, value)}}
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
            deleteComponentCallback={()=> this.deleteComponent(index)}
            duplicateComponentCallback={() => this.duplicateComponent(index)}
            isFloatingName={isFloatingName}
            floatingName={this.state.floatingName}
            updateFloatingNameCallback={(value) => this.updateFloatingName(index, value)}
            releaseFloatingNameCallback={() => this.releaseFloatingName()}
            updateComponentFieldCallback={(field, value)=> {this.updateComponentField(index, field, value)}}
        />
    }

    filterByComponentType = (componentType) => {
        this.setState({filteredComponentType: componentType})
    }

    removedFilteredComponentType = () => {
        this.setState({filteredComponentType: undefined})
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
            let isStock = component.type.split("_").shift() === "STOCK";
            let isDisabled = component.disabled;

            if (isDisabled) {
                disabledComponents.push(this.loadComponent(component, index));
            } else {
                enabledComponents.push(this.loadComponent(component, index));
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

    render() {
        var componentItems = this.loadComponentItems()
        var components = !this.state.hasLoaded || this.state.content === undefined ? [] : this.state.content
        return <div className="row componentViewer no-gutters">
            <div className="col no-gutters">
                <div className="row component-filters-row">
                    <div className="col no-gutters">
                        <ComponentFilters 
                            components={components}
                            componentTypeFilter={this.state.filteredComponentType}
                            filterByComponentTypeCallback={this.filterByComponentType}
                            removedFilteredComponentTypeCallback={this.removedFilteredComponentType}
                        />
                    </div>
                </div>
                <div className="row component-items-row">
                    <div className="col no-gutters" ref={this.scrollableDivRef}>
                        { componentItems.length === 0 &&
                            <img className="no-components-svg" src={NoComponentsSVG} alt="Suggestion to create a component with the create components tab"/>
                        }
                        {componentItems}
                    </div>
                </div>
            </div>
        </div> 
    }
}