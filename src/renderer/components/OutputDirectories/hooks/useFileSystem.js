import { useState } from 'react';
const fs = require('fs/promises');
const path = require('path');

export function useFileSystem() {
    const doesFileExist = async (filepath) => {
        try {
            await fs.access(filepath);
            return true;
        } catch {
            return false;
        }
    };

    const parseTimeStamp = (timestamp) => {
        if (timestamp === undefined) return undefined;
        
        const timestampComponents = timestamp.split("_");
        const timeOfDayComponents = timestampComponents[1].split("-");
        const dateTime = new Date(
            `${timestampComponents[0]}T${timeOfDayComponents[0]}:${timeOfDayComponents[1]}:${timeOfDayComponents[2]}`
        );
        return dateTime.toLocaleDateString('en-us', { 
            year: "numeric", 
            month: "short", 
            day: "numeric", 
            hour: '2-digit', 
            minute: '2-digit'
        }); 
    };

    const deleteDirectory = async (dirPath) => {
        try {
            await fs.rm(dirPath, { recursive: true, force: true });
            return true;
        } catch (error) {
            console.error('Error deleting directory:', error);
            return false;
        }
    };

    const readJsonFile = async (filepath) => {
        try {
            const content = await fs.readFile(filepath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error(`Error reading JSON file ${filepath}:`, error);
            return null;
        }
    };

    return {
        doesFileExist,
        parseTimeStamp,
        deleteDirectory,
        readJsonFile
    };
} 