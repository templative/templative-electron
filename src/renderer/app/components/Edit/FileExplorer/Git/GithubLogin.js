import React from "react";
import "./GithubLogin.css";
import githubLogo from "./githubLogo.png";
import { channels } from '../../../../../../shared/constants';

const { shell, ipcRenderer } = require('electron');

export default class GitHubLoginControls extends React.Component {
    state = {
        userCode: null,
        deviceCode: null,
        verificationUri: null,
        showPopup: false,
        error: null
    }

    componentDidMount = async () => {
        await this.setupGithubLogin();
        
        // Listen for auth results
        ipcRenderer.on(channels.GIVE_GITHUB_AUTH_SUCCESS, (_, token) => {
            this.setState({  
                showPopup: false 
            });
            this.props.onAuthSuccessCallback(token);
        });

        ipcRenderer.on(channels.GIVE_GITHUB_AUTH_ERROR, (_, error) => {
            this.setState({ 
                error: error 
            });
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_GITHUB_AUTH_SUCCESS);
        ipcRenderer.removeAllListeners(channels.GIVE_GITHUB_AUTH_ERROR);
    }

    loginGithub = async () => {
        if (!this.state.userCode) {
            await this.setupGithubLogin();
        }
        this.setState({ showPopup: true, error: null });
        
        // Start polling in main process
        ipcRenderer.invoke(channels.TO_SERVER_GITHUB_AUTH, this.state.deviceCode);
    }

    openVerificationUri = () => {
        shell.openExternal(this.state.verificationUri);
    }

    setupGithubLogin = async () => {
        // https://github.com/organizations/templative/settings/applications/2796196
        const deviceCodeResponse = await fetch('https://github.com/login/device/code', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: "Ov23liv6aAD44ZpLEdPY",
                scope: 'repo user'
            })
        });

        const { device_code, user_code, verification_uri } = await deviceCodeResponse.json();
        
        this.setState({ userCode: user_code, deviceCode: device_code, verificationUri: verification_uri });        
    }

    copyCode = () => {
        navigator.clipboard.writeText(this.state.userCode);
    }

    cancelLogin = () => {
        this.setState({ 
            showPopup: false,
            error: null 
        });
    }

    render() {
        return (
            <div className="github-login-controls">
                <img src={githubLogo} alt="GitHub Logo" className="github-logo" />
                <button  
                    type="button" 
                    className="btn login-github-button" 
                    onClick={async () => await this.loginGithub()}
                >
                    Setup GitHub Connection ↗
                </button>

                {this.state.showPopup && (
                    <div className="verification-popup">
                        <div className="popup-content">
                            <button 
                                className="popup-close-button" 
                                onClick={this.cancelLogin}
                            >
                                ×
                            </button>
                            <h3>Enter this code on GitHub</h3>
                            <div className="code-display">{this.state.userCode}</div>
                            <div className="popup-buttons">
                                <button onClick={this.copyCode} className="popup-button">
                                    Copy Code
                                </button>
                                <button onClick={this.openVerificationUri} className="popup-button">
                                    Open GitHub
                                </button>
                            </div>
                            {this.state.error && (
                                <div className="error-message">{this.state.error}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}