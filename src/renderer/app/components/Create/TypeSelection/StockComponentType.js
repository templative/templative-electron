import React, { useState, Suspense, lazy } from "react";
import { addSpaces, extractBaseNameAndColor } from './ComponentUtils';
import './StockComponentType.css';

// Lazy load the simpler viewer instead
const ModelViewer = lazy(() => import('./ModelViewer'));

const StockComponentType = ({ componentInfo, selectedComponentType, name, selectTypeCallback, existingQuantity, colorVariations = [] }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    
    // Extract base name without color if component has a color
    let displayName = componentInfo["DisplayName"];
    if (componentInfo["Color"]) {
        const { baseName } = extractBaseNameAndColor(name, componentInfo["DisplayName"]);
        displayName = baseName;
    }
    // console.log(componentInfo["DisplayName"])
    
    const has3DModel = componentInfo["3DModel"] && 
                       componentInfo["3DModel"].ObjUrl && 
                       componentInfo["3DModel"].TextureUrl;
    
    const handleMouseEnter = () => {
        setIsHovering(true);
        if (has3DModel && !modelLoaded) {
            // Preload 3D model resources
            const objImg = new Image();
            objImg.src = componentInfo["3DModel"].ObjUrl;
            
            const textureImg = new Image();
            textureImg.src = componentInfo["3DModel"].TextureUrl;
            
            if (componentInfo["3DModel"].NormalMapUrl) {
                const normalImg = new Image();
                normalImg.src = componentInfo["3DModel"].NormalMapUrl;
            }
            
            setModelLoaded(true);
        }
    };
    
    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    // Check if this is a color variation group
    const hasColorVariations = colorVariations.length > 0;

    return (
        <div className="component-type-wrapper">
            <button 
                type="button" 
                className={`btn btn-outline-primary component-type-card ${selectedComponentType === name && "selected-component-type"}`} 
                onClick={() => selectTypeCallback(name)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="component-type-content">
                    <div className="component-type-info">
                        <p className="component-type-name">{existingQuantity !== 0 && `${existingQuantity}x `}{displayName}</p>
                        
                        {(componentInfo["SimulatorCreationTask"] || componentInfo["Color"]) && (
                            <p className="component-type-dimensions">
                                {componentInfo["SimulatorCreationTask"]}
                                {componentInfo["SimulatorCreationTask"] && componentInfo["Color"] && " - "}
                                {componentInfo["Color"]}
                                {hasColorVariations && ` (${colorVariations.length} Color Variations)`}
                            </p>
                        )}
                        
                        {/* If there are color variations but no SimulatorCreationTask or Color, show variations separately */}
                        {hasColorVariations && !componentInfo["SimulatorCreationTask"] && !componentInfo["Color"] && (
                            <p className="component-type-dimensions">
                                {`${colorVariations.length} Color Variations`}
                            </p>
                        )}
                        
                        {componentInfo["PreviewUri"] && (
                            <div className="stock-component-preview">
                                {has3DModel ? (
                                    <div className="model-container">
                                        <Suspense fallback={<div className="loading-model">Loading 3D model...</div>}>
                                            <ModelViewer 
                                                objUrl={componentInfo["3DModel"].ObjUrl}
                                                textureUrl={componentInfo["3DModel"].TextureUrl}
                                                normalMapUrl={componentInfo["3DModel"].NormalMapUrl}
                                            />
                                        </Suspense>
                                    </div>
                                ) : (
                                    <div className="preview-container">
                                        <img 
                                            src={componentInfo["PreviewUri"]} 
                                            alt={displayName}
                                            className="preview-image"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </button>
        </div>
    );
};

export default StockComponentType; 