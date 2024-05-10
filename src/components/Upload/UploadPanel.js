import React from "react";
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import "./UploadPanel.css"
import { channels } from "../../shared/constants";
import UploadControls from "./UploadControls";
import { LoggedMessages } from "../SocketedConsole/LoggedMessages"
import socket from "../../socket"
import {getLastUsedGameCrafterUsername, writeLastUseGameCrafterUsername, getLastUsedGameCrafterApiKey, writeLastUseGameCrafterApiKey} from "../../settings/SettingsManager"
import TemplativeAccessTools from "../TemplativeAccessTools";
import { trackEvent } from "@aptabase/electron/renderer";
import AdPanel from "./AdPanel";
import TemplativeClient from "../../TemplativeClient"
import TemplativePurchaseButton from "../TemplativePurchaseButton";
const path = require('path');

const { ipcRenderer } = require('electron');

export default class UploadPanel extends React.Component {   
    state={
        selectedOutputDirectory: undefined,
        selectedPackageDirectory: undefined,
        isCreating: false,
        playgroundDirectory: "",
        apiKey: "",
        username: "",
        password: "",
        isAsync: true,
        isPublish: false,
        isProofed: true,
        isIncludingStock: true,
        doesUserOwnTemplative: false,
    }
    checkIfOwnsTemplative = async () => {
        var ownsTemplative = await TemplativeClient.doesUserOwnTemplative(this.props.email, this.props.token)
        this.setState({ doesUserOwnTemplative: ownsTemplative})
    }
    componentDidMount = async () => {
        await this.checkIfOwnsTemplative()
        trackEvent("view_uploadPanel")
        ipcRenderer.on(channels.GIVE_PLAYGROUND_FOLDER, (event, playgroundFolder) => {
            this.setState({playgroundDirectory: playgroundFolder})
        });
        this.setState({
            apiKey: getLastUsedGameCrafterApiKey(),
            username: getLastUsedGameCrafterUsername(),
        })
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_PLAYGROUND_FOLDER);
    }
    updateApiKey = (apiKey) => {
        writeLastUseGameCrafterApiKey(apiKey);
        this.setState({apiKey: apiKey})
    }
    updateUsername = (username) => {
        writeLastUseGameCrafterUsername(username);
        this.setState({username: username})
    }
    updatePassword = (password) => {
        this.setState({password: password})
    }
    updateIsAsync = (isAsync) => {
        this.setState({isAsync: isAsync})
    }
    toggleIsPublish = () => {
        this.setState({isPublish: !this.state.isPublish})
    }
    toggleIsProofed = () => {
        this.setState({isProofed: !this.state.isProofed})
    }
    toggleIsIncludingStock = () => {
        this.setState({isIncludingStock: !this.state.isIncludingStock})
    }
    selectDirectoryAsync = async (directory) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(this.props.templativeRootDirectoryPath, gameCompose["outputDirectory"], directory)
        this.setState({selectedOutputDirectory:outputDirectory})
    }
    selectPackageDirectory = (directory) => {
        this.setState({selectedPackageDirectory:directory})
    }
    upload = async () => {
        trackEvent("upload")
        var data = { 
            gameDirectoryRootPath: `${this.props.templativeRootDirectoryPath}`,
            outputDirectorypath: `${this.state.selectedOutputDirectory}`,
            playgroundPackagesDirectorypath: this.state.playgroundDirectory,
            username: this.state.username,
            password: this.state.password,
            apiKey: this.state.apiKey,
            isPublish: this.state.isPublish,
            isIncludingStock: this.state.isIncludingStock,
            isAsync: this.state.isAsync,
            isProofed: this.state.isProofed ? 1:0
        }
        console.log(data)
        try {
            this.setState({isCreating: true})
            socket.emit('upload', data, () => {
                this.setState({isCreating: false})
            });
        }
        catch(e) {
            console.log(e)
        }
    }
    render() {
        return <div className='mainBody'>
            <div className="row">

                
                <div className="col-4 upload-column">
                    <RenderOutputOptions selectedDirectory={this.state.selectedOutputDirectory} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} selectDirectoryAsyncCallback={this.selectDirectoryAsync}/>
                    
                    {this.state.doesUserOwnTemplative ? 
                        <UploadControls 
                            isCreating={this.state.isCreating}
                            selectedOutputDirectory={this.state.selectedOutputDirectory}
                            apiKey={this.state.apiKey}
                            username={this.state.username}
                            password={this.state.password}
                            isAsync={this.state.isAsync}
                            isPublish={this.state.isPublish}
                            isProofed={this.state.isProofed}
                            isIncludingStock={this.state.isIncludingStock}
                            uploadCallback={this.upload}
                            updateApiKeyCallback={this.updateApiKey}
                            updateUsernameCallback={this.updateUsername}
                            updatePasswordCallback={this.updatePassword}
                            updateIsAsyncCallback={this.updateIsAsync}
                            toggleIsPublishCallback={this.toggleIsPublish}
                            toggleIsProofedCallback={this.toggleIsProofed}
                            toggleIsIncludingStockCallback={this.toggleIsIncludingStock}
                        />
                        :
                        <TemplativePurchaseButton action="Uploading to the GameCrafter"/>
                    }
                    
                    <AdPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/>
                </div>
                <div className="col logging-col">
                    <LoggedMessages />
                </div>
            </div>
        </div>
    }
}