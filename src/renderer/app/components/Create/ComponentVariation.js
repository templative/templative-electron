import React, { useContext } from "react";
import { COMPONENT_INFO } from "../../../../shared/componentInfo";
import { STOCK_COMPONENT_INFO } from "../../../../shared/stockComponentInfo";
import "./ComponentVariation.css";
import { RenderingWorkspaceContext } from '../Render/RenderingWorkspaceProvider';
import { loadPreviewImage } from "./utils/ImageLoader";

const ComponentVariation = ({ 
    isToggledToComponents, 
    majorCategory, 
    baseComponent, 
    size, 
    color, 
    componentKey,
    isSelected
}) => {
  const context = useContext(RenderingWorkspaceContext);

  const componentTypeInformation = isToggledToComponents ? COMPONENT_INFO : STOCK_COMPONENT_INFO;
  
  // Look up the component info using the provided key
  const componentInfo = componentTypeInformation[componentKey];
  
  if (!componentInfo) {
    return null;
  }
  const source = loadPreviewImage(componentInfo.PreviewUri)
  const label = [
    size !== 'Sizeless' ? size : isToggledToComponents ? 'Standard' : '',
    color !== 'Colorless' ? color : ''
  ].filter(Boolean).join(' ') || ''
  return (
    <button 
      className={`component-variation-button ${isSelected ? 'selected' : ''}`} 
      onClick={() => context.selectComponent(majorCategory, baseComponent, size, color, componentKey)}
    >
      <div className="component-variation-preview">
        {componentInfo.PreviewUri && (
          <img 
            src={source} 
            alt={`${baseComponent} ${size} ${color}`} 
            className="component-variation-image"
          />
        )}
        <div className="component-variation-label">
          {label}
        </div>
      </div>
    </button>
  );
};

export default ComponentVariation;
