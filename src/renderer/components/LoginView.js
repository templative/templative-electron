import React from "react";
import "./LoginView.css"
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { ipcRenderer } = require('electron');
const { channels } = require('../../shared/constants');
import Logo from "./logo.svg?react"

export default class LoginView extends React.Component {   
    
    // Ok, so my electron react app requests that my flask server begin the oauth process. The flask app uses my client id to create a login page for google that when successful sends an code to my oauth callback endpoint. The callback uses the code to get the id_token, which it uses to pull the users email. We check that the email exists and that the password checks out. If it does, then we generate a temporary login token for that user, and pass the token and email to my electron app using `templative://authorize?token={tempToken}&email={email}`. Our app's deep links intercept this, save the token and email to a safe session store, and consider us logged in.
    googleLogin = async () => {
        try {
            await ipcRenderer.invoke(channels.TO_SERVER_GOOGLE_LOGIN);
        } catch (error) {
            console.error('LoginView: Google login failed:', error);
        }
    };

    render() {
        var isLoginValid = emailPattern.test(this.props.email) && strongPasswordPattern.test(this.props.password)
        const emailIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
        const passwordIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
        </svg>
        return <div className="start-view" data-bs-theme="dark">
            <div className="welcome-modal">
                <div className="d-grid gap-2">
                    <Logo className="login-logo"/>
                    <p>Login</p>
                    <p className="login-input-label">Email</p>
                    <div className="input-group input-group-sm" data-bs-theme="dark">
                        <span className="input-group-text soft-label" id="basic-addon3">{emailIcon}</span>
                        <input type="email" className="form-control no-left-border" placeholder="john-smith@mail.com" 
                            value={this.props.email} 
                            onChange={(e)=> this.props.updateEmailCallback(e.target.value)}
                        />
                    </div>
                    <p className="login-input-label">Password</p>
                    <div className="input-group input-group-sm" data-bs-theme="dark">
                        <span className="input-group-text soft-label no-left-border" id="basic-addon3">{passwordIcon}</span>
                        <input type="password" className="form-control no-left-border" placeholder=""
                            value={this.props.password} 
                            onChange={(e)=> this.props.updatePasswordCallback(e.target.value)} 
                        />
                    </div>
                    <p className="login-status">
                        {this.props.loginStatus}
                    </p>
                    <button 
                        className="btn btn-primary" 
                        disabled={!isLoginValid} 
                        onClick={this.props.attemptLoginCallback}
                    >
                        Login
                    </button>

                    <p className="or-text">or</p>
                    <button onClick={this.googleLogin} className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google google-login-icon" viewBox="0 0 16 16">
                            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
                        </svg>
                        Login with Google
                    </button>

                    <p className="need-templative-account">
                        Need a Templative account? <span className="register-now" onClick={this.props.clickRegisterCallback}>Register now</span>.
                    </p>
                </div>
            </div>
        </div>        
    }
}