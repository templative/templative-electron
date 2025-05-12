import React from "react";
import "./UploadPanel.css"
import UploadControls from "./UploadControls";
import { trackEvent } from "@aptabase/electron/renderer";
import GameCrafterLoginControls from "./GameCrafterLogin";
const { ipcRenderer } = require('electron');
import { channels } from "../../../../../shared/constants"

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
        trackEvent("view_uploadPanel")
        await this.checkTgcSession()
        
        ipcRenderer.on(channels.GIVE_TGC_LOGIN_STATUS, async (_, data) => {
            var newState = { 
                isLoggedIn: data.isLoggedIn,
                hasGottenFirstSessionPollResponse: true,
                designers: []
            }
            if (data.isLoggedIn) {
                var designersResult = await this.fetchDesigners()
                if (designersResult.success && designersResult.designers) {
                    newState.designers = designersResult.designers
                } else {
                    console.error("Error fetching designers:", designersResult.error || "Unknown error")
                }
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
        ipcRenderer.removeAllListeners(channels.GIVE_TGC_LOGIN_STATUS)
    }

    fetchDesigners = async () => {
        return await ipcRenderer.invoke(channels.TO_SERVER_GET_TGC_DESIGNERS)
    }

    setSession = async (sessionStatus) => {
        var isLoggedIn = sessionStatus.isLoggedIn
        var designers = []
        
        if (isLoggedIn) {
            var designerResult = await this.fetchDesigners()
            if (designerResult.success && designerResult.designers) {
                designers = designerResult.designers
            } else {
                console.error("Error fetching designers:", designerResult.error || "Unknown error")
                // If we can't get designers due to an auth issue, we might not be logged in
                if (designerResult.error && designerResult.error.includes('Not logged into TheGameCrafter')) {
                    isLoggedIn = false
                }
            }
        }
        
        var newState = { 
            isLoggedIn: isLoggedIn, 
            designers: designers,
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
        try {
            const sessionStatus = await ipcRenderer.invoke(channels.TO_SERVER_GET_TGC_SESSION)
            
            if (!sessionStatus.isLoggedIn) {
                this.setState({hasGottenFirstSessionPollResponse: true})
                return
            }
            
            await this.setSession(sessionStatus)
        } catch (error) {
            console.error("Error checking TGC session:", error)
            this.setState({
                hasGottenFirstSessionPollResponse: true,
                isLoggedIn: false
            })
        }
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
            isPublish: this.state.isPublish,
            isIncludingStock: this.state.isIncludingStock,
            isAsync: this.state.isAsync,
            isProofed: this.state.isProofed ? 1:0,
            designerId: this.state.designerId
        }
        
        if (!this.state.designerId) {
            console.error("No designer ID selected");
            return;
        }
        
        try {
            this.setState({isCreating: true})
            const response = await ipcRenderer.invoke(channels.TO_SERVER_UPLOAD_GAME, data)
            this.setState({isCreating: false})
            
            if (response.success) {
                // Update with game URL if available
                if (response.gameUrl) {
                    this.setState({ gameCrafterUrl: response.gameUrl })
                }
            } else {
                console.error("Upload failed:", response.error)
                // If not logged in, update login state and refresh
                if (response.error && response.error.includes('Not logged into TheGameCrafter')) {
                    await this.checkTgcSession();
                }
            }
        }
        catch(e) {
            console.error("Exception during upload:", e)
            this.setState({isCreating: false})
            // Check session on errors to ensure login state is current
            await this.checkTgcSession();
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