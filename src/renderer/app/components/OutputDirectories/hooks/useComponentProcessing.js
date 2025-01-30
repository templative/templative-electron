import { useState } from 'react';
const path = require('path');
const fs = require('fs/promises');

export function useComponentProcessing({ doesFileExist }) {
    const [groupedComponents, setGroupedComponents] = useState({});
    const [typeQuantities, setTypeQuantities] = useState({});
    const [renderProgress, setRenderProgress] = useState({ total: 1, done: 1 });
    const [uploadComponents, setUploadComponents] = useState([]);

    const getComponentInformation = async (directoryPath) => {
        try {
            const directories = await fs.readdir(directoryPath, { withFileTypes: true });
            const componentDirs = directories.filter(dirent => dirent.isDirectory());

            const grouped = {};
            const quantities = {};

            for (const dir of componentDirs) {
                const componentDir = path.join(directoryPath, dir.name);
                const files = await fs.readdir(componentDir);
                
                // Filter for PNG files (both temp and final versions)
                const pngFiles = files.filter(file => 
                    file.toLowerCase().endsWith('.png') || 
                    file.toLowerCase().endsWith('_temp.png')
                );

                const componentJsonPath = path.join(componentDir, 'component.json');
                if (!await doesFileExist(componentJsonPath)) {
                    console.warn('No component.json found in:', componentDir);
                    continue;
                }

                try {
                    const componentData = await fs.readFile(componentJsonPath, 'utf8');
                    const component = JSON.parse(componentData);

                    if (!grouped[component.name]) {
                        grouped[component.name] = {
                            type: component.type,
                            directories: [],
                            imageFiles: {}
                        };
                    }

                    // Initialize array for this directory's images
                    grouped[component.name].imageFiles[dir.name] = pngFiles.map(file => ({
                        name: file,
                        path: componentDir,
                        isTemp: file.toLowerCase().endsWith('_temp.png'),
                        quantity: getQuantityForFile(file, component)
                    }));

                    grouped[component.name].directories.push(dir.name);
                    quantities[component.type] = (quantities[component.type] || 0) + 1;

                } catch (error) {
                    console.error(`Error processing component in ${dir.name}:`, error);
                }
            }

            console.log('Grouped components:', grouped); // Debug log
            setGroupedComponents(grouped);
            setTypeQuantities(quantities);

        } catch (error) {
            console.error('Error in getComponentInformation:', error);
            setGroupedComponents({});
            setTypeQuantities({});
        }
    };

    // Helper function to get quantity from component.json
    const getQuantityForFile = (filename, component) => {
        if (component.frontInstructions) {
            const frontInstructions = Array.isArray(component.frontInstructions) 
                ? component.frontInstructions 
                : [component.frontInstructions];
            
            for (const instruction of frontInstructions) {
                if (instruction.filepath && path.basename(instruction.filepath) === filename) {
                    return instruction.quantity || 1;
                }
            }
        }
        return 1; // Default quantity if not specified
    };

    const getUploadComponents = async (directory) => {
        // ... existing getUploadComponents logic ...
    };

    const clearComponentData = () => {
        setGroupedComponents({});
        setTypeQuantities({});
        setRenderProgress({ total: 1, done: 1 });
        setUploadComponents([]);
    };

    return {
        groupedComponents,
        typeQuantities,
        renderProgress,
        uploadComponents,
        getComponentInformation,
        getUploadComponents,
        clearComponentData
    };
}