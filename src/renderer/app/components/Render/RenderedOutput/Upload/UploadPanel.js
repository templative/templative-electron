import React from "react";
import "./UploadPanel.css"
import UploadControls from "./UploadControls";
// import { trackEvent } from "@aptabase/electron/renderer";
import GameCrafterLoginControls from "./GameCrafterLogin";
const { ipcRenderer } = require('electron');
import { channels } from "../../../../../../shared/constants"

export default class UploadPanel extends React.Component {   
    state = {
        isCreating: false,
        isLoggedIn: false,
        hasGottenFirstSessionPollResponse: false,
        isAsync: true,
        designerId: undefined,
        isProofed: true,
        isPublish: false,
        isIncludingStock: true,
        designers: []
    }

    updateDesignerId = (designerId) => {
        this.setState({designerId: designerId})
    }

    componentDidMount = async () => {
        // trackEvent("view_uploadPanel")
        await this.checkTgcSession()
        
        ipcRenderer.on(channels.GIVE_TGC_LOGIN_STATUS, async (_, data) => {
            var newState = { 
                isLoggedIn: data.isLoggedIn,
                hasGottenFirstSessionPollResponse: true
            }
            if (data.isLoggedIn) {
                var designersResult = await this.fetchDesigners()
                newState["designers"] = designersResult.designers
            } else {
                newState["designers"] = []
            }
            if (newState.designers.length > 0) {
                if (this.state.designerId === undefined || !newState.designers.find(d => d.id === this.state.designerId)) {
                    newState.designerId = newState.designers[0].id
                }
            }
            this.setState(newState)
            
        })
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.TGC_LOGIN_STATUS_CHANGED)
    }

    fetchDesigners = async () => {
        return await ipcRenderer.invoke(channels.TO_SERVER_GET_TGC_DESIGNERS)
    }

    setSession = async (sessionStatus) => {
        var isLoggedIn = sessionStatus.isLoggedIn
        var designerResult = await this.fetchDesigners()
        if (!designerResult.isLoggedIn) {
            isLoggedIn = false
        }
        var newState = { 
            isLoggedIn: isLoggedIn, 
            designers: designerResult.designers,
            hasGottenFirstSessionPollResponse: true 
        }
        if (newState.designers.length > 0) {
            if (this.state.designerId === undefined || !newState.designers.find(d => d.id === this.state.designerId)) {
                newState.designerId = newState.designers[0].id
            }
        }
        this.setState(newState)
    }

    checkTgcSession = async () => {
        const sessionStatus = await ipcRenderer.invoke(channels.TO_SERVER_GET_TGC_SESSION)
        console.log(sessionStatus)
        if (!sessionStatus.isLoggedIn) {
            this.setState({hasGottenFirstSessionPollResponse: true})
            return
        }
        this.setSession(sessionStatus)
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
        // trackEvent("upload")
        var data = { 
            gameDirectoryRootPath: this.props.templativeRootDirectoryPath,
            outputDirectorypath: this.props.outputFolderPath,
            isPublish: this.state.isPublish,
            isIncludingStock: this.state.isIncludingStock,
            isAsync: this.state.isAsync,
            isProofed: this.state.isProofed ? 1:0,
            designerId: this.state.designerId
        }
        try {
            this.setState({isCreating: true})
            const uploadStatus = await ipcRenderer.invoke(channels.TO_SERVER_UPLOAD_GAME, data)
            this.setState({isCreating: false, isLoggedIn: uploadStatus.isLoggedIn})
        }
        catch(e) {
            console.error(e)
        }
    }

    render() {
        if (!this.state.hasGottenFirstSessionPollResponse) {
            return null
        }

        if (!this.state.isLoggedIn) {
            return <GameCrafterLoginControls />
        }
        
        return <UploadControls 
            isCreating={this.state.isCreating}
            selectedOutputDirectory={this.props.outputFolderPath}
            isAsync={this.state.isAsync}
            isPublish={this.state.isPublish}
            isProofed={this.state.isProofed}
            isIncludingStock={this.state.isIncludingStock}
            uploadCallback={this.upload}
            updateIsAsyncCallback={this.updateIsAsync}
            toggleIsPublishCallback={this.toggleIsPublish}
            toggleIsProofedCallback={this.toggleIsProofed}
            updateDesignerIdCallback={this.updateDesignerId}
            toggleIsIncludingStockCallback={this.toggleIsIncludingStock}
            designerId={this.state.designerId}
            designers={this.state.designers}
            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
            changeTabsToEditAFileCallback={this.props.changeTabsToEditAFileCallback}
            gameJsonFile={this.props.gameJsonFile}
            gameCrafterUrl={this.props.gameCrafterUrl}
            uploadComponents={this.props.uploadComponents}
        />
    }
}