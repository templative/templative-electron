import React, { useContext } from "react";
import RenderOutputImage from "./RenderedOutputImage";
const path = require('path');
import { OutputDirectoriesContext } from "../../../OutputDirectories/OutputDirectoriesProvider";
const { shell } = require('electron');

export default function ComponentOutputDirectory({ componentDirectory, imageFiles, rotationDegrees=0, componentType }) {
    const componentDirName = path.basename(componentDirectory);
    const subdirectoryName = componentDirName.includes('_') ? 
        componentDirName.split('_').pop() : 
        "";

    const backImage = imageFiles?.find(img => img.name.endsWith('-back.png'));
    const frontImages = imageFiles?.filter(img => !img.name.endsWith('-back.png')) || [];
    const openFolderIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z"/>
    </svg>
    const { selectedDirectory } = useContext(OutputDirectoriesContext);
    const openSubcomponentFolder = () => {
        const outputPath = path.join(selectedDirectory.path, selectedDirectory.name, componentDirectory);
        shell.openPath(outputPath);
    }
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
                <div className="open-subcomponent-folder" onClick={openSubcomponentFolder}>{openFolderIcon}</div>
                <p className="rendered-component-title rendered-subcomponent-subdirectory-title">{subdirectoryName}</p>
            </div>
            <div className="component-output-content">
                {backImage && (
                    <RenderOutputImage 
                        rotationDegrees={rotationDegrees}
                        componentDirectoryName={componentDirName}
                        imagePath={path.join(backImage.path, backImage.name)}
                        name={backImage.name}
                        componentType={componentType}
                    />
                )}
                {frontImages.map((image, index) => {
                    return (
                        <RenderOutputImage 
                            key={`front_${index}`}
                            componentDirectoryName={componentDirName}
                            imagePath={path.join(image.path, image.name)}
                            name={image.name}
                            quantity={image.quantity}
                            rotationDegrees={rotationDegrees}
                            componentType={componentType}
                        />
                    );
                })}
            </div>
        </div>
    );
}