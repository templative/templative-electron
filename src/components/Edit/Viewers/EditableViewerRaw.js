import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');

export default class EditableViewerRaw extends React.Component {   
    state = {
        content: undefined,
        hasLoaded: false
    }
    updateContent = (value) => {
        this.setState({content: value},this.autosave)
    }
    saveAsync = async (filepath, fileContents) => {
        if (!this.state.hasLoaded || fileContents === undefined) {
            // console.log("Skipping saving due to not being loaded yet.")
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
        // console.log("Autosave")
        await this.saveAsync(this.getFilePath(this.props), this.state.content)
    }
    loadFileContent = async () => {
        const filepath = this.getFilePath(this.props)
        // console.log(`Loading ${filepath}`)
        const content = await TemplativeAccessTools.readFileContentsAsync(filepath)
        // console.log(`Loaded ${filepath}\n${content}`)
        return content
    }
    startAutoSave = async () => {
        if (this.saveIntervalId !== undefined) {
            // console.warn("Needed to clear autosave before starting it!")
            await clearIntervalAsync(this.saveIntervalId)
            this.saveIntervalId = undefined
        }
        // console.log("Starting autosave.")
        this.saveIntervalId = setIntervalAsync(this.autosave, 10*1000)
    }
    componentDidMount = async () => {
        var content = await this.loadFileContent()
        this.setState({content: content, hasLoaded: true}, async () => {
            // console.log(content)
            await this.startAutoSave()
        })
    }
    async componentDidUpdate (prevProps, prevState) {
        const areFilepathsUnchanged = this.getFilePath(prevProps) === this.getFilePath(this.props)
        if (areFilepathsUnchanged) {
            return
        }
        // console.log(`Filepaths changed ${this.getFilePath(prevProps)} ${this.getFilePath(this.props)}`)
        var previousFilepath = this.getFilePath(prevProps)
        // console.log("Saving due to templative project changing.")
        await this.saveAsync(previousFilepath, this.state.content)
        
        // console.log("Loading file content due to templative project changing.")
        this.setState({content: await this.loadFileContent() }, async () => {
            await this.startAutoSave()
        })
    }
    componentWillUnmount = async () => {
        if (this.saveIntervalId !== undefined) {
            await clearIntervalAsync(this.saveIntervalId)
            this.saveIntervalId = undefined
        }
        // console.log("Autosave on close")
        await this.autosave()
    }
}