import React from "react";
import "./UploadPanel.css"
const { ipcRenderer } = require('electron');
import { channels } from "../../../../shared/constants"
import AdPanel from "./AdPanel";
const fs = require('fs');
const path = require('path');

export default class UploadControls extends React.Component {   
    state = {
        gameCrafterUrl: undefined,
        gameData: null
    }
    componentDidUpdate(prevProps) {
        if (this.watcher && prevProps.selectedOutputDirectory !== this.props.selectedOutputDirectory) {
            this.watcher.close();
            this.watcher = null;
        }

        if (this.props.selectedOutputDirectory && !this.watcher) {
            const gameJsonPath = path.join(this.props.selectedOutputDirectory, 'game.json');
            
            this.updateGameUrlFromFile(gameJsonPath);
            
            this.watcher = fs.watch(gameJsonPath, (eventType, filename) => {
                if (filename) {
                    this.updateGameUrlFromFile(gameJsonPath);
                }
            });
        }
    }

    updateGameUrlFromFile = (gameJsonPath) => {
        try {
            const gameData = JSON.parse(fs.readFileSync(gameJsonPath, 'utf8'));
            if (gameData.gameCrafterUrl !== this.state.gameCrafterUrl || 
                JSON.stringify(gameData) !== JSON.stringify(this.state.gameData)) {
                this.setState({ 
                    gameCrafterUrl: gameData.gameCrafterUrl,
                    gameData: gameData 
                });
            }
        } catch (error) {
            console.error('Error reading game.json:', error);
        }
    }

    componentWillUnmount() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
    }

    logout = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_TGC_LOGOUT);
    }

    componentDidMount() {
        if (this.props.selectedOutputDirectory) {
            const gameJsonPath = path.join(this.props.selectedOutputDirectory, 'game.json');
            this.updateGameUrlFromFile(gameJsonPath);
        }
    }

    editGameJson = () => {
        this.props.changeTabsToEditAFileCallback("GAME_GAMEDATA", path.join(this.props.templativeRootDirectoryPath, "game.json"))
    }

    render() {
        var buttonMessage = "Select an Output Directory"
        if (this.props.isCreating) {
            buttonMessage = "Uploading to TheGameCrafter..."
        }
        else if (this.props.selectedOutputDirectory !== undefined) {
            buttonMessage = "Upload to TheGameCrafter"
        }
        var canUpload = !this.props.isCreating && this.props.selectedOutputDirectory !== undefined && this.props.designerId !== undefined
        
        return <React.Fragment>
            
            {this.state.gameData &&
                <AdPanel 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    game={this.state.gameData}
                    gameCrafterUrl={this.state.gameCrafterUrl}
                    isPublish={this.props.isPublish}
                    isIncludingStock={this.props.isIncludingStock}
                    editGameJsonCallback={this.editGameJson}
                    selectedOutputDirectory={this.props.selectedOutputDirectory}
                />
            }
            <div className="vertical-input-group">
                <div 
                    className="input-group input-group-sm" 
                    data-bs-theme="dark"
                >
                    <span className="input-group-text" title="Select the designer who will own this the game">Designer</span>
                    <select 
                        className="form-select"
                        value={this.props.designerId}
                        onChange={(e) => this.props.updateDesignerIdCallback(e.target.value)}
                        disabled={this.props.isCreating}
                    >
                        <option value="">Select a designer...</option>
                        {this.props.designers.map(designer => (
                            <option key={designer.id} value={designer.id}>
                                {designer.name}
                            </option>
                        ))}
                    </select>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary tgc-logout-button" 
                        onClick={this.logout}
                        disabled={this.props.isCreating}
                    >
                        Logout
                    </button>
                </div>
                <div 
                    className="input-group input-group-sm upload-checkbox-controls" 
                    data-bs-theme="dark"
                >
                    <span className="input-group-text upload-publish-checkbox" title="Whether or not you want to automatically publish the game on TheGameCrafter.">Publish?</span>
                    <div className="input-group-text no-left-border">
                        <input 
                            className="form-check-input mt-0" 
                            type="checkbox" 
                            disabled={this.props.isCreating}
                            value=""
                            title="Whether or not you want to automatically publish the game on TheGameCrafter."
                            onChange={()=>{ this.props.toggleIsPublishCallback()}} 
                            checked={this.props.isPublish} 
                            aria-label="Checkbox for following text input"
                        />
                    </div>
                    <span className="input-group-text" title="Whether or not the the images are automatically considered Proofed. If no, then you will need to proof every single image manually once on TheGameCrafter.">Proofed?</span>
                    <div className="input-group-text no-left-border">
                        <input 
                            className="form-check-input mt-0" 
                            type="checkbox" 
                            value="" 
                            title="Whether or not the the images are automatically considered Proofed. If no, then you will need to proof every single image manually once on TheGameCrafter."
                            disabled={this.props.isCreating}
                            onChange={()=>{ this.props.toggleIsProofedCallback()}} 
                            checked={this.props.isProofed} 
                            aria-label="Checkbox for following text input"
                        />
                    </div>
                    <span className="input-group-text" title="Whether to upload stock components with your game. Saying 'no' is useful if you already own all the stock components and you just need the custom components.">Include Stock?</span>
                    <div className="input-group-text no-left-border">
                        <input 
                            className="form-check-input mt-0" 
                            type="checkbox" 
                            value="" 
                            title="Whether to upload stock components with your game. Saying 'no' is useful if you already own all the stock components and you just need the custom components."
                            disabled={this.props.isCreating}
                            onChange={()=>{ this.props.toggleIsIncludingStockCallback()}} 
                            checked={this.props.isIncludingStock} 
                            aria-label="Checkbox for following text input"
                        />
                    </div>
                </div>
                <div 
                    className="input-group input-group-sm" 
                    data-bs-theme="dark"
                >
                    <button 
                        disabled={!canUpload} 
                        type="button" 
                        className="btn btn-outline-secondary upload-tgc-button" 
                        onClick={async () => await this.props.uploadCallback()}
                    >{buttonMessage}</button>
                </div>
            </div>
        </React.Fragment>
    }
}