import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');

export default class EditableViewerRaw extends React.Component {   
    state = {
        content: undefined,
        hasLoaded: false,
        filepath: undefined
    }
    updateContent = (value) => {
        this.setState({content: value, hasLoaded: true}, async () => await this.autosave())
    }
    saveAsync = async (filepath, fileContents) => {
        if (filepath === undefined || fileContents === undefined) {
            console.log("Skipping saving due to not being loaded yet.")
            return
        }
        // console.log(`Saving ${filepath}`)//\n${fileContents}`)
        await this.props.saveFileAsyncCallback(filepath, fileContents)
    }
    getFilePath = (props) => {
        console.error("getFilepath not defined!")
        return "" // Define this
    }
    autosave = async () => {
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
        // console.log("Starting autosave.")
        this.saveIntervalId = setIntervalAsync(this.autosave, 10*1000)
    }
    loadContentAndStartAutoSave = async () => {
        const filepath = this.getFilePath(this.props)
        const content = await this.loadFileContent(filepath)
        this.setState({ content: content, hasLoaded: true, filepath: filepath }, async () => await this.startAutoSave());
    };
    
    componentDidMount = async () => {
        await this.loadContentAndStartAutoSave()
    }
    componentDidUpdate = async (prevProps) => {
        const filePathsUnchanged = this.getFilePath(prevProps) === this.getFilePath(this.props);
        if (filePathsUnchanged) {
            return;
        }
        const previousFilepath = this.getFilePath(prevProps)
        const previousContent = this.state.content
    
        // console.log(`EditableViewerRaw Filepaths changed from ${this.getFilePath(prevProps)} to ${this.getFilePath(this.props)}`);
        if (this.saveIntervalId !== undefined) {
            await clearIntervalAsync(this.saveIntervalId);
            this.saveIntervalId = undefined;
        }
        this.setState({ hasLoaded: false, content: undefined, filepath: undefined }, async () => {
            await this.saveAsync(previousFilepath, previousContent);
            await this.loadContentAndStartAutoSave()
        });
    };
    
    componentWillUnmount = async () => {
        if (this.saveIntervalId === undefined) {
            return
        }
        // console.log("Autosave on close")
        await clearIntervalAsync(this.saveIntervalId)
        this.saveIntervalId = undefined
        await this.autosave()
    }
}