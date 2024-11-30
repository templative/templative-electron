import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');

export default class EditableViewerRaw extends React.Component {   
    state = {
        content: undefined,
        hasLoaded: false,
        filepath: undefined,
        lastKnownFileContents: undefined
    }

    saveAsync = async (filepath, content) => {
        if (filepath === undefined || content === undefined) {
            return
        }
        await this.props.saveFileAsyncCallback(filepath, content)
        console.log(`💾 Saved ${filepath}`);
        this.setState({ lastKnownFileContents: content })
    }

    getFilePath = (props) => {
        console.error("getFilepath not defined!")
        return "" // Define this
    }

    autosave = async () => {
        await this.checkForExternalChanges()

        if (this.state.content === this.state.lastKnownFileContents) {
            return;
        }
        await this.saveAsync(this.state.filepath, this.state.content)
    }

    loadFileContent = async (filepath) => {
        return await TemplativeAccessTools.readFileContentsAsync(filepath)
    }

    startAutoSave = async () => {
        if (this.saveIntervalId !== undefined) {
            await clearIntervalAsync(this.saveIntervalId)
            this.saveIntervalId = undefined
        }
        this.saveIntervalId = setIntervalAsync(this.autosave, 10*1000)
    }

    loadContentAndStartAutoSave = async () => {
        const filepath = this.getFilePath(this.props)
        const content = await this.loadFileContent(filepath)
        
        this.setState({ 
            content: content, 
            hasLoaded: true, 
            filepath: filepath,
            lastKnownFileContents: content
        }, async () => {
            await this.startAutoSave()
        });
    };

    checkForExternalChanges = async () => {
        if (!this.state.filepath) return;
        
        try {
            const currentFileContent = await this.loadFileContent(this.state.filepath)
            
            if (currentFileContent !== this.state.lastKnownFileContents) {
                this.setState({ 
                    lastKnownFileContents: currentFileContent
                })
                
                if (this.state.content === this.state.lastKnownFileContents) {
                    this.setState({
                        content: currentFileContent
                    })
                }
            }
        } catch (error) {
            console.error("Error checking for external changes:", error)
        }
    }

    startExternalChangeCheck = () => {
        if (this.externalCheckIntervalId !== undefined) {
            clearInterval(this.externalCheckIntervalId)
        }
        this.externalCheckIntervalId = setInterval(this.checkForExternalChanges, 5000)
    }

    async componentDidMount() {
        await this.loadContentAndStartAutoSave()
        this.startExternalChangeCheck()
    }

    async componentDidUpdate(prevProps) {
        const filePathsUnchanged = this.getFilePath(prevProps) === this.getFilePath(this.props);
        if (filePathsUnchanged) {
            return;
        }
        const previousFilepath = this.getFilePath(prevProps)
        const previousContent = this.state.content
    
        if (this.saveIntervalId !== undefined) {
            await clearIntervalAsync(this.saveIntervalId);
            this.saveIntervalId = undefined;
        }
        this.setState({ hasLoaded: false, content: undefined, filepath: undefined }, async () => {
            await this.saveAsync(previousFilepath, previousContent);
            await this.loadContentAndStartAutoSave()
        });
    };
    
    async componentWillUnmount() {
        if (this.saveIntervalId !== undefined) {
            await clearIntervalAsync(this.saveIntervalId)
            this.saveIntervalId = undefined
        }
        if (this.externalCheckIntervalId !== undefined) {
            clearInterval(this.externalCheckIntervalId)
            this.externalCheckIntervalId = undefined
        }
        await this.autosave()
    }
}