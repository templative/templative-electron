import React from "react";
import "./UploadPanel.css"
const { ipcRenderer } = require('electron');
import { channels } from "../../../../../shared/constants"
import AdPanel from "./AdPanel";
const path = require('path');

export default class UploadControls extends React.Component {   
    state = {
        gameCrafterUrl: undefined,
    }

    logout = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_TGC_LOGOUT);
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
            {this.props.gameJsonFile &&
                <AdPanel 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    game={this.props.gameJsonFile}
                    gameCrafterUrl={this.props.gameCrafterUrl}
                    isPublish={this.props.isPublish}
                    isIncludingStock={this.props.isIncludingStock}
                    editGameJsonCallback={this.editGameJson}
                    selectedOutputDirectory={this.props.selectedOutputDirectory}
                    uploadComponents={this.props.uploadComponents}
                    openFolder={this.props.openFolder}
                />
            }
            <div className="vertical-input-group">
                <div 
                    className="input-group input-group-sm" 
                    data-bs-theme="dark"
                >
                    <span className="input-group-text soft-label" title="Select the designer who will own this the game">Designer</span>
                    <select 
                        className="form-select no-left-border"
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
                        className="btn btn-outline-primary tgc-logout-button" 
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
                    <span className="input-group-text upload-publish-checkbox  clickable-checkbox-label" title="If checked, the name of the game will used, instead of the output folder, and the game's store page will be marked Published.." onClick={()=>{ this.props.toggleIsPublishCallback()}}>Mark as Published?</span>
                    <div className="input-group-text no-left-border">
                        <input 
                            className="form-check-input mt-0" 
                            type="checkbox" 
                            disabled={this.props.isCreating}
                            value=""
                            title="If checked, the name of the game will used, instead of the output folder, and the game's store page will be marked Published.."
                            onChange={()=>{ this.props.toggleIsPublishCallback()}} 
                            checked={this.props.isPublish} 
                            aria-label="Checkbox for following text input"
                        />
                    </div>
                    <span className="input-group-text clickable-checkbox-label" title="Whether or not the the images are automatically considered Proofed. If not, then you will need to proof every single image manually once on TheGameCrafter." onClick={()=>{ this.props.toggleIsProofedCallback()}}>Proofed?</span>
                    <div className="input-group-text no-left-border">
                        <input 
                            className="form-check-input mt-0" 
                            type="checkbox" 
                            value="" 
                            title="Whether or not the the images are automatically considered Proofed. If not, then you will need to proof every single image manually once on TheGameCrafter."
                            disabled={this.props.isCreating}
                            onChange={()=>{ this.props.toggleIsProofedCallback()}} 
                            checked={this.props.isProofed} 
                            aria-label="Checkbox for following text input"
                        />
                    </div>
                    <span className="input-group-text clickable-checkbox-label" title="Whether to upload stock components with your game. Saying 'no' is useful if you already own all the stock components and you just need the custom components." onClick={()=>{ this.props.toggleIsIncludingStockCallback()}} >Include Stock?</span>
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
                        className="btn btn-outline-primary upload-tgc-button" 
                        onClick={async () => await this.props.uploadCallback()}
                    >{buttonMessage}</button>
                </div>
            </div>
        </React.Fragment>
    }
}