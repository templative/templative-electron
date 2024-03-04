import React from "react";
import "./UploadPanel.css"

export default class UploadControls extends React.Component {   
    render() {
        var buttonMessage = "Select an Output Directory"
        if (this.props.isCreating) {
            buttonMessage = "Uploading to TheGameCrafter..."
        }
        else if (this.props.selectedOutputDirectory !== undefined) {
            buttonMessage = "Upload to TheGameCrafter"
        }
        var canUpload = this.props.apiKey !== "" && this.props.username !== "" && this.props.password !== "" && !this.props.isCreating && this.props.selectedOutputDirectory !== undefined
        
        return <div className="gamecrafter-upload-controls">
            <p className="tgc-password-warning">Templative will never store your password and never will send it to our servers. This app communicates directly with TheGameCrafter.</p>
            <div className="input-group input-group-sm" data-bs-theme="dark">
                <span className="input-group-text" id="basic-addon3">TGC ApiKey</span>
                <input type="password" className="form-control" value={this.props.apiKey} onChange={(e)=> this.props.updateApiKeyCallback(e.target.value)} placeholder=""/>
            </div>
            <div className="input-group input-group-sm" data-bs-theme="dark">
                <span className="input-group-text" id="basic-addon3">TGC Username</span>
                <input className="form-control" value={this.props.username} onChange={(e)=> this.props.updateUsernameCallback(e.target.value)} placeholder=""/>
            </div>
            <div className="input-group input-group-sm" data-bs-theme="dark">
                <span className="input-group-text" id="basic-addon3">TGC Password</span>
                <input type="password" className="form-control" value={this.props.password} onChange={(e)=> this.props.updatePasswordCallback(e.target.value)} placeholder=""/>
            </div>
            <div className="input-group input-group-sm" data-bs-theme="dark">
                <span className="input-group-text">Cadence</span>
                <select value={this.props.isAsync} onChange={(e)=>{this.props.updateIsAsyncCallback(e.target.value)}} className="form-select" id="inputGroupSelect01">
                    <option value={true}>All at Once</option>
                    <option value={false}>Sequentially</option>
                </select>
                <span className="input-group-text">Publish?</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleIsPublishCallback()}} checked={this.props.isPublish} aria-label="Checkbox for following text input"/>
                </div>
                
                <span className="input-group-text">Proofed?</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleIsProofedCallback()}} checked={this.props.isProofed} aria-label="Checkbox for following text input"/>
                </div>
                <span className="input-group-text">Include Stock?</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{ this.props.toggleIsIncludingStockCallback()}} checked={this.props.isIncludingStock} aria-label="Checkbox for following text input"/>
                </div>
            </div>
            <div className="input-group input-group-sm" data-bs-theme="dark">
                
                
            </div>
            <button disabled={!canUpload} type="button" className="btn btn-outline-secondary create-playground-button" onClick={async () => await this.props.uploadCallback()}>{buttonMessage}</button>
        </div>
    }
}