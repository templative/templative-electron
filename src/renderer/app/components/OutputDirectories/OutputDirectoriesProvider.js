import React, { createContext, useState, useEffect } from 'react';
import { useFileSystem } from './hooks/useFileSystem';
import { useComponentProcessing } from './hooks/useComponentProcessing';
import { useDirectoryWatcher } from './hooks/useDirectoryWatcher';
import TemplativeAccessTools from '../TemplativeAccessTools';
const path = require('path');

export const OutputDirectoriesContext = createContext();

export function OutputDirectoriesProvider({ children, templativeRootDirectoryPath }) {
    const [directories, setDirectories] = useState([]);
    const [directoryMetadata, setDirectoryMetadata] = useState({});
    const [gameJsonFile, setGameJsonFile] = useState(null);
    const [gameCrafterUrl, setGameCrafterUrl] = useState();
    const [selectedDirectory, setSelectedDirectory] = useState(null);

    const { 
        doesFileExist, 
        parseTimeStamp, 
        readJsonFile, 
        deleteDirectory 
    } = useFileSystem();

    const {
        groupedComponents,
        typeQuantities,
        renderProgress,
        uploadComponents,
        getComponentInformation,
        getUploadComponents,
        clearComponentData
    } = useComponentProcessing({ doesFileExist });

    const getGameInformation = async (directory) => {
        const gameJsonFilepath = path.join(directory, "game.json");
        try {
            if (!await doesFileExist(gameJsonFilepath)) return;

            const gameJsonFile = await readJsonFile(gameJsonFilepath);
            if (!gameJsonFile) return;
            
            setGameJsonFile(gameJsonFile);
            setGameCrafterUrl(gameJsonFile.gameCrafterUrl);

            const metadata = {
                gameDisplayName: gameJsonFile.displayName,
                versionName: gameJsonFile.versionName,
                versionNumber: gameJsonFile.version,
                timestamp: parseTimeStamp(gameJsonFile.timestamp),
                componentFilter: gameJsonFile.componentFilter
            };

            setDirectoryMetadata(prevState => ({
                ...prevState,
                [path.basename(directory)]: metadata
            }));
        } catch (error) {
            console.error(`Error reading game.json:`, error);
        }
    };

    const getOutputDirectoryNames = async () => {
        if (!templativeRootDirectoryPath) return;
        
        const dirs = await TemplativeAccessTools.getOutputDirectoriesAsync(templativeRootDirectoryPath);
        setDirectories(dirs);
        
        // Get metadata for each directory
        for (const directory of dirs) {
            const fullPath = path.join(directory.path, directory.name);
            await getGameInformation(fullPath);
        }

        return dirs; // Return directories for the watcher
    };

    const processSelectedDirectory = async (directory) => {
        if (!directory) return;
        const fullPath = path.join(directory.path, directory.name);
        await getGameInformation(fullPath);
        await getComponentInformation(fullPath);
        await getUploadComponents(fullPath);
    };

    const handleNewDirectory = async (directory) => {
        // Select the new directory
        await handleSetSelectedOutputDirectory(directory);
    };

    const handleDeleteOutputDirectory = async (directory, onDeleteCallback) => {
        try {
            const dirPath = path.join(directory.path, directory.name);
            const success = await deleteDirectory(dirPath);
            
            if (success) {
                // If we're deleting the currently selected directory, clear the selection
                if (selectedDirectory?.name === directory.name) {
                    setSelectedDirectory(null);
                    clearComponentData();
                }

                setDirectories(prev => prev.filter(d => d.name !== directory.name));
                setDirectoryMetadata(prev => {
                    const newState = { ...prev };
                    delete newState[directory.name];
                    return newState;
                });

                if (onDeleteCallback) {
                    onDeleteCallback(dirPath);
                }
            }
        } catch (error) {
            console.error('Error in handleDeleteOutputDirectory:', error);
        }
    };

    const handleSetSelectedOutputDirectory = async (directory) => {
        setSelectedDirectory(directory);
        await processSelectedDirectory(directory);
    };

    // Setup directory watcher
    useDirectoryWatcher({
        templativeRootDirectoryPath,
        selectedDirectory,
        onDirectoryChange: getOutputDirectoryNames,
        onSelectedDirectoryChange: processSelectedDirectory,
        onNewDirectory: handleNewDirectory
    });

    // Initial load
    useEffect(() => {
        getOutputDirectoryNames();
    }, [templativeRootDirectoryPath]);

    return (
        <OutputDirectoriesContext.Provider value={{
            directories,
            directoryMetadata,
            deleteOutputDirectory: handleDeleteOutputDirectory,
            typeQuantities,
            renderProgress,
            uploadComponents,
            gameCrafterUrl,
            gameJsonFile,
            groupedComponents,
            selectedDirectory,
            setSelectedOutputDirectory: handleSetSelectedOutputDirectory,
        }}>
            {children}
        </OutputDirectoriesContext.Provider>
    );
} 