import React from "react";
import RenderOutputImage from "./RenderedOutputImage";
const path = require('path');

export default function ComponentOutputDirectory({ componentDirectory, imageFiles }) {
    const componentDirName = path.basename(componentDirectory);
    const subdirectoryName = componentDirName.includes('_') ? 
        componentDirName.split('_').pop() : 
        "";

    const backImage = imageFiles?.find(img => img.name.endsWith('-back.png'));
    const frontImages = imageFiles?.filter(img => !img.name.endsWith('-back.png')) || [];

    return (
        <div className="rendered-subcomponent">
            <div className="subcomponent-output-header">
                <div className={`component-progess ${imageFiles?.length > 0 && "component-progress-completed"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-card-image progress-image" viewBox="0 0 16 16">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    {imageFiles?.length || 0} Images
                </div>
                <p className="rendered-component-title">{subdirectoryName}</p>
            </div>
            <div className="component-output-content">
                {backImage && (
                    <RenderOutputImage 
                        componentDirectoryName={componentDirName}
                        imagePath={path.join(backImage.path, backImage.name)}
                        name={backImage.name}
                    />
                )}
                {frontImages.map((image, index) => {
                    console.log(image)
                    return (
                        <RenderOutputImage 
                            key={`front_${index}`}
                            componentDirectoryName={componentDirName}
                            imagePath={path.join(image.path, image.name)}
                            name={image.name}
                            quantity={image.quantity}
                        />
                    );
                })}
            </div>
        </div>
    );
}