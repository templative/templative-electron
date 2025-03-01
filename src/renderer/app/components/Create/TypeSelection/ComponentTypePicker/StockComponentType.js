import React, { useState, Suspense, lazy } from "react";
import { addSpaces } from './ComponentType';
import './StockComponentType.css';

// Lazy load the simpler viewer instead
const ModelViewer = lazy(() => import('./ModelViewer'));

const StockComponentType = ({ componentInfo, selectedComponentType, name, selectTypeCallback, existingQuantity }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    
    const displayName = componentInfo["DisplayName"] ? addSpaces(componentInfo["DisplayName"]) : name;
    
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
                        <p><strong>{existingQuantity !== 0 && `${existingQuantity}x `}{displayName}</strong></p>
                        
                        {componentInfo["SimulatorCreationTask"] && (
                            <p>Task: {componentInfo["SimulatorCreationTask"]}</p>
                        )}
                        
                        {componentInfo["Color"] && (
                            <p>Color: {componentInfo["Color"]}</p>
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