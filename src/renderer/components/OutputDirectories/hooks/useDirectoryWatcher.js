import { useState, useEffect } from 'react';
const fsOld = require('fs');

export function useDirectoryWatcher({ 
    templativeRootDirectoryPath, 
    selectedDirectory, 
    onDirectoryChange,
    onSelectedDirectoryChange,
    onNewDirectory 
}) {
    const [outputFolderWatcher, setOutputFolderWatcher] = useState(null);
    const [isWatching, setIsWatching] = useState(false);

    const stopWatchingBasepath = () => {
        if (outputFolderWatcher) {
            outputFolderWatcher.close();
            setOutputFolderWatcher(null);
            setIsWatching(false);
        }
    };

    const watchBasepathAsync = async () => {
        stopWatchingBasepath();
        
        if (!templativeRootDirectoryPath) return;

        try {
            const watcher = fsOld.watch(
                templativeRootDirectoryPath, 
                { recursive: true }, 
                async (event, filename) => {
                    if (event === 'rename') {
                        const currentDirs = await onDirectoryChange?.();
                        
                        if (currentDirs?.length > 0) {
                            const newestDir = currentDirs[currentDirs.length - 1];
                            await onNewDirectory?.(newestDir);
                        }
                    }

                    // Handle selected directory changes
                    if (selectedDirectory && filename?.includes(selectedDirectory.name)) {
                        await onSelectedDirectoryChange?.(selectedDirectory);
                    }
                }
            );
            
            setOutputFolderWatcher(watcher);
        } catch (error) {
            console.error('Error setting up directory watcher:', error);
        }
    };

    useEffect(() => {
        watchBasepathAsync();
        return () => stopWatchingBasepath();
    }, [templativeRootDirectoryPath]);

    return {
        stopWatchingBasepath,
        isWatching
    };
}