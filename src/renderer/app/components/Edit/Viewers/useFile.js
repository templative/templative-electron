import { useState, useEffect } from 'react';
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');

export const useFile = ({ 
    filepath, 
    loadFileContent, 
    saveFileAsync, 
    autoSaveInterval = 10000,
    externalCheckInterval = 5000 
}) => {
    const [content, setContent] = useState(undefined);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [lastKnownFileContents, setLastKnownFileContents] = useState(undefined);

    const autosave = async () => {
        await checkForExternalChanges();

        if (content === lastKnownFileContents) {
            return;
        }
        await saveFileAsync(filepath, content);
        setLastKnownFileContents(content);
    };

    const checkForExternalChanges = async () => {
        if (!filepath) return;
        
        try {
            const currentFileContent = await loadFileContent(filepath);
            
            if (currentFileContent !== lastKnownFileContents) {
                setLastKnownFileContents(currentFileContent);
                
                if (content === lastKnownFileContents) {
                    setContent(currentFileContent);
                }
            }
        } catch (error) {
            console.error("Error checking for external changes:", error);
        }
    };

    useEffect(() => {
        let saveIntervalId;
        let externalCheckIntervalId;

        const loadContentAndStartAutoSave = async () => {
            const loadedContent = await loadFileContent(filepath);
            setContent(loadedContent);
            setHasLoaded(true);
            setLastKnownFileContents(loadedContent);
            
            if (saveIntervalId) {
                await clearIntervalAsync(saveIntervalId);
            }
            saveIntervalId = setIntervalAsync(autosave, autoSaveInterval);
        };

        loadContentAndStartAutoSave();
        externalCheckIntervalId = setInterval(checkForExternalChanges, externalCheckInterval);

        return async () => {
            if (saveIntervalId) {
                await clearIntervalAsync(saveIntervalId);
            }
            if (externalCheckIntervalId) {
                clearInterval(externalCheckIntervalId);
            }
            await autosave();
        };
    }, [filepath]);

    return {
        content,
        setContent,
        hasLoaded,
        autosave
    };
};