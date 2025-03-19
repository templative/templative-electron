import React from "react";
import "./CreatePanel.css"
import "./TypeSelection/ComponentType.css"

import TemplativeAccessTools from "../TemplativeAccessTools";
import ComponentTypeList from "./TypeSelection/ComponentTypeList";
import ChosenComponent from "./ChosenComponent";
import SearchComponentsBox from "./SearchComponentsBox";
import { trackEvent } from "@aptabase/electron/renderer";
import { RenderingWorkspaceContext } from '../Render/RenderingWorkspaceProvider';
const { ipcRenderer } = window.require('electron');
const { channels } = require('../../../../shared/constants');

var path = require('path');

const customMajorCategories = [
    "packaging","stickers", "deck", "die", "premium", "board","token","mat","document", "blank", "screen", "dial"
]

const stockMajorCategories = [
    "dice", "premium", "packaging", 'sleeve', 'baggies', "cube", "tube", "blank", "building","meeple","TB", "minifig", "figurine", "animal",  "vehicle",  "casino", "money", "utility", "vial","symbol", "bodypart", "resource"
]

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
        
        if (!originalType.startsWith("STOCK_")) {
            props.changeTabsToEditAFileCallback(
                "UNIFIED_COMPONENT", 
                path.join(props.templativeRootDirectoryPath, `component-compose.json#${context.componentName}`)
            );
        }
    };

    const componentTypes = context.isToggledToComponents ? props.componentTypesCustomInfo : props.componentTypesStockInfo;
    const componentTypeOptions = Object.assign({}, componentTypes);
    const isCreateButtonDisabled = isProcessing || context.componentName === "" || context.selectedComponentType === undefined;
    
    return (
        <div className='mainBody'>
            <SearchComponentsBox 
                isToggledToComponents={context.isToggledToComponents}
                toggleCustomOrStock={context.toggleCustomOrStock}
                componentTypeSearch={context.componentTypeSearch}
                setComponentTypeSearch={context.setComponentTypeSearch}
            />
            <ComponentTypeList 
                majorCategories={context.isToggledToComponents ? customMajorCategories : stockMajorCategories}
                selectedTags={[]}  
                selectTypeCallback={context.selectComponent}
                search={context.componentTypeSearch}
                selectedComponentType={context.selectedComponentType}  
                componentTypeOptions={componentTypeOptions}
                isStock={!context.isToggledToComponents}
                isShowingTemplates={false}
            />  
            <ChosenComponent 
                isProcessing={isProcessing}
                createComponent={createComponent}
                componentTypeOptions={componentTypeOptions}
                isToggledToComponents={context.isToggledToComponents}
            /> 
        </div>
    );
};

export default CreatePanel;