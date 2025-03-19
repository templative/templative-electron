import React, { useContext, useMemo } from "react";
import "./CreatePanel.css";
import { RenderingWorkspaceContext } from '../Render/RenderingWorkspaceProvider';
import "./ChosenComponent.css";
import ColorOptions from './ColorOptions';
import SizeOptions from './SizeOptions';
import ComponentPreview from './ComponentPreview';
import ComponentVariation from './ComponentVariation';
import { COMPONENT_INFO } from "../../../../shared/componentInfo";
import { STOCK_COMPONENT_INFO } from "../../../../shared/stockComponentInfo";
import { COMPONENT_CATEGORIES } from "../../../../shared/componentCategories";

const ChosenComponent = ({ isProcessing, createComponent, isToggledToComponents }) => {
    const context = useContext(RenderingWorkspaceContext);
    const isCreateButtonDisabled = isProcessing || context.componentName === "" || context.selectedComponentType === undefined;

    const hasSelectedComponent = context.selectedComponentType !== undefined;

    if (!hasSelectedComponent) {
        return null;
    }
    const componentTypeInformation = isToggledToComponents ? COMPONENT_INFO : STOCK_COMPONENT_INFO;
    const selectedComponentInfo = context.selectedComponentType ? componentTypeInformation[context.selectedComponentType] : null;

    const componentCustomizability = isToggledToComponents ? "CUSTOM" : "STOCK";
    const sizes = COMPONENT_CATEGORIES[componentCustomizability][context.selectedMajorCategory][context.selectedBaseComponent];
    let variations = Object.entries(sizes).flatMap(([size, colors]) => {
        return Object.entries(colors).map(([color, componentKey]) => (
            <ComponentVariation
                key={`${size}-${color}`}
                isToggledToComponents={isToggledToComponents}
                customizability={componentCustomizability}
                majorCategory={context.selectedMajorCategory}
                baseComponent={context.selectedBaseComponent}
                size={size}
                color={color}
                componentKey={componentKey}
                isSelected={context.selectedComponentType === componentKey}
                onSelect={(key) => context.setSelectedComponentType(key)}
            />
        ));
    });
    // If there's only one variation, don't show the size or color options
    if (variations.length === 1) {
        variations = []
    }
    return (
        <div className="create-component-name-row">
            <div className="chosen-component-preview">
                <ComponentPreview selectedComponentInfo={selectedComponentInfo} />
            </div>
            <div className="chosen-component-settings">
                {variations}
            </div>
            <div className="create-component-output-options">
                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text soft-label">Composition Name</span>
                    <input 
                        type="text" 
                        className="form-control no-left-border" 
                        onChange={(event) => context.setComponentName(event.target.value.replace(/[<>:"/\\|?*]/g, ''))} 
                        placeholder="Player Roles or Emperor Token, etc" 
                        value={context.componentName}
                    />
                </div>
                <button 
                        disabled={isCreateButtonDisabled}
                        className="btn btn-outline-primary create-component-button btn-block" 
                        type="button" 
                        id="button-addon1"
                        onClick={() => createComponent()}
                    >
                        {isProcessing && <span className="spinner-border spinner-border-sm creating-spinner"></span>}
                        Create
                    </button>
            </div>
        </div>
    );
};

export default ChosenComponent;
