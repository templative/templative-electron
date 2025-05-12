import React, { useContext, useMemo } from "react";
import { COMPONENT_INFO } from "../../../../shared/componentInfo";
import { STOCK_COMPONENT_INFO } from "../../../../shared/stockComponentInfo";
import "./ComponentVariation.css";
import { RenderingWorkspaceContext } from '../../Render/RenderingWorkspaceProvider';

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
  if (componentInfo.IsDisabled) {
    return null;
  }
  
  const previewImagePath = useMemo(() => {
    if (componentInfo.PreviewUri) {
      // Make sure we're returning a proper string
      return `https://templative-component-preview-images.s3.us-west-2.amazonaws.com/${componentInfo.PreviewUri}`;
    }
    return null;
  }, [componentInfo.PreviewUri]);
  
  const label = [
    size !== 'Sizeless' ? size : isToggledToComponents ? 'Standard' : '',
    color !== 'Colorless' ? color : ''
  ].filter(Boolean).join(' ') || '';
  
  return (
    <button 
      className={`component-variation-button ${isSelected ? 'selected' : ''}`} 
      onClick={() => context.selectComponent(majorCategory, baseComponent, size, color, componentKey)}
    >
      <div className="component-variation-preview">
        {previewImagePath && (
          <img 
            src={previewImagePath} 
            alt={`${baseComponent} ${size} ${color}`} 
            className="component-variation-image"
            onError={(e) => {
              console.error(`Failed to load image: ${previewImagePath}`);
              e.target.style.display = 'none';
            }}
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
