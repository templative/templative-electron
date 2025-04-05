import React from "react";
import "./CreatePanel.css"
import "./TypeSelection/ComponentType.css"

import TemplativeAccessTools from "../TemplativeAccessTools";
import ComponentTypeList from "./TypeSelection/ComponentTypeList";
import ChosenComponent from "./ChosenComponent/ChosenComponent";
import SearchComponentsBox from "./SearchComponentsBox";
import { trackEvent } from "@aptabase/electron/renderer";
import { RenderingWorkspaceContext } from '../Render/RenderingWorkspaceProvider';
import { COMPONENT_CATEGORIES } from "../../../../shared/componentCategories";

const { ipcRenderer } = window.require('electron');
const { channels } = require('../../../../shared/constants');

var path = require('path');

// Extract major categories from COMPONENT_CATEGORIES structure
const customMajorCategoryOrder = [  "deck", "die", "token", "board",  "mat", "packaging", "document", "stickers","blank", "screen", "dial"];

const stockMajorCategoryOrder = ["dice","cube", "tube", "meeple"];

// Convert to functional component
const CreatePanel = (props) => {
    const context = React.useContext(RenderingWorkspaceContext);
    const [components, setComponents] = React.useState([]);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const loadComponents = async (templativeRootDirectoryPath) => {
        const components = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(
            templativeRootDirectoryPath, 
            "component-compose.json"
        );
        setComponents(components);
    };

    React.useEffect(() => {
        trackEvent("view_createPanel");
        loadComponents(props.templativeRootDirectoryPath);
    }, [props.templativeRootDirectoryPath]);

    const createComponent = async () => {
        trackEvent("component_create");
        setIsProcessing(true);
        
        const data = { 
            componentName: context.componentName,
            componentType: context.selectedComponentType,
            directoryPath: props.templativeRootDirectoryPath,
            componentAIDescription: context.componentAIDescription
        };
        
        await ipcRenderer.invoke(channels.TO_SERVER_CREATE_COMPONENT, data);
        
        // Load the updated component-compose.json
        const filepath = path.join(props.templativeRootDirectoryPath, "component-compose.json");
        const updatedContent = await TemplativeAccessTools.loadFileContentsAsJson(filepath);
        await props.saveComponentComposeAsync(updatedContent);

        setIsProcessing(false);
        
        const originalType = context.selectedComponentType;
        context.setComponentName("");
        context.setSelectedComponentType(undefined);
        context.setComponentAIDescription("");
        
        // Only change views for custom components, not stock components
        if (context.isToggledToComponents) {
            props.changeTabsToEditAFileCallback(
                "UNIFIED_COMPONENT", 
                path.join(props.templativeRootDirectoryPath, `component-compose.json#${context.componentName}`)
            );
        }
    };

    // Get component types based on categories
    const componentTypesCustomInfo = props.componentTypesCustomInfo || {};
    const componentTypesStockInfo = props.componentTypesStockInfo || {};
    const typeInfo = context.isToggledToComponents ? componentTypesCustomInfo : componentTypesStockInfo;
    const componentMajorCategories = context.isToggledToComponents ? COMPONENT_CATEGORIES.CUSTOM : COMPONENT_CATEGORIES.STOCK;
    const currentMajorCategoryOrder = context.isToggledToComponents ? customMajorCategoryOrder : stockMajorCategoryOrder;
    
    return (
        <div className='mainBody'>
            <SearchComponentsBox 
                isToggledToComponents={context.isToggledToComponents}
                toggleCustomOrStock={context.toggleCustomOrStock}
                componentTypeSearch={context.componentTypeSearch}
                setComponentTypeSearch={context.setComponentTypeSearch}
            />
            <ComponentTypeList 
                majorCategoryOrder={currentMajorCategoryOrder}
                componentMajorCategories={componentMajorCategories}
                selectedTags={[]}  
                typeInfo={typeInfo}
                selectTypeCallback={context.selectComponent}
                search={context.componentTypeSearch}
                selectedComponentType={context.selectedComponentType}  
                isStock={!context.isToggledToComponents}
                isShowingTemplates={false}
            />  
            <ChosenComponent 
                isProcessing={isProcessing}
                createComponent={createComponent}
                isToggledToComponents={context.isToggledToComponents}
            /> 
        </div>
    );
};

export default CreatePanel;