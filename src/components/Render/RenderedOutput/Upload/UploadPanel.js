import React from "react";
import "./UploadPanel.css"
import UploadControls from "./UploadControls";
import { LoggedMessages } from "../../../SocketedConsole/LoggedMessages"
import socket from "../../../../socket"
import {getLastUsedGameCrafterUsername, writeLastUseGameCrafterUsername, getLastUsedGameCrafterApiKey, writeLastUseGameCrafterApiKey} from "../../../../settings/SettingsManager"
import { trackEvent } from "@aptabase/electron/renderer";
import AdPanel from "./AdPanel";
import TemplativePurchaseButton from "../../../TemplativePurchaseButton";

export default class UploadPanel extends React.Component {   
    state={
        isCreating: false,
        apiKey: "",
        username: "",
        password: "",
        isAsync: true,
        isPublish: false,
        isProofed: true,
        isIncludingStock: true,
    }
    componentDidMount = async () => {
        trackEvent("view_uploadPanel")
        
        this.setState({
            apiKey: getLastUsedGameCrafterApiKey(),
            username: getLastUsedGameCrafterUsername(),
        })
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
    upload = async () => {
        trackEvent("upload")
        var data = { 
            gameDirectoryRootPath: this.props.templativeRootDirectoryPath,
            outputDirectorypath: this.props.outputFolderPath,
            username: this.state.username,
            password: this.state.password,
            apiKey: this.state.apiKey,
            isPublish: this.state.isPublish,
            isIncludingStock: this.state.isIncludingStock,
            isAsync: this.state.isAsync,
            isProofed: this.state.isProofed ? 1:0
        }
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
        return <React.Fragment>
            {this.props.doesUserOwnTemplative ? 
                <React.Fragment>
                <div className="logged-messages-container">
                    <LoggedMessages messages={this.props.templativeMessages}/>
                </div>
                <UploadControls 
                    isCreating={this.state.isCreating}
                    selectedOutputDirectory={this.props.outputFolderPath}
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
                
                <AdPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/>
            </React.Fragment>
                :
                <TemplativePurchaseButton action="Uploading to the GameCrafter"/>
            }
            
        </React.Fragment>
    }
}