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
        
        return <React.Fragment>
            <p className="tgc-password-warning">Use your TheGameCrafter Credentials. Templative will never store your password and never will send it to our servers. This app communicates directly with TheGameCrafter.</p>
            <div className="vertical-input-group">
                <div className="input-group input-group-sm" data-bs-theme="dark">
                    <span className="input-group-text upload-control-column-field" id="basic-addon3">ApiKey</span>
                    <input type="password" className="form-control" value={this.props.apiKey} onChange={(e)=> this.props.updateApiKeyCallback(e.target.value)} placeholder=""/>
                </div>
                <div className="input-group input-group-sm" data-bs-theme="dark">
                    <span className="input-group-text upload-control-column-field"  id="basic-addon3">Username</span>
                    <input className="form-control" value={this.props.username} onChange={(e)=> this.props.updateUsernameCallback(e.target.value)} placeholder=""/>
                </div>
                <div className="input-group input-group-sm" data-bs-theme="dark">
                    <span className="input-group-text upload-control-column-field" id="basic-addon3">Password</span>
                    <input type="password" className="form-control" value={this.props.password} onChange={(e)=> this.props.updatePasswordCallback(e.target.value)} placeholder=""/>
                </div>
                <div className="input-group input-group-sm upload-checkbox-controls" data-bs-theme="dark">
                    <span className="input-group-text upload-publish-checkbox">Publish?</span>
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
                    <button disabled={!canUpload} type="button" className="btn btn-outline-secondary upload-tgc-button" onClick={async () => await this.props.uploadCallback()}>{buttonMessage}</button>
                </div>
            </div>
        </React.Fragment>
    }
}