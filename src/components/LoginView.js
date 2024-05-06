import React from "react";
import "./LoginView.css"
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default class LoginView extends React.Component {   
    render() {
        var isLoginValid = emailPattern.test(this.props.email) && strongPasswordPattern.test(this.props.password)
        return <div className="start-view" data-bs-theme="dark">
            <div className="welcome-modal">
                <div className="d-grid gap-2">
                    <p>Login</p>
                    <div className="input-group input-group-sm" data-bs-theme="dark">
                        <span className="input-group-text" id="basic-addon3">Email Address</span>
                        <input type="email" className="form-control" placeholder="john-smith@mail.com" 
                            value={this.props.email} 
                            onChange={(e)=> this.props.updateEmailCallback(e.target.value)}
                        />
                    </div>
                    <div className="input-group input-group-sm" data-bs-theme="dark">
                        <span className="input-group-text" id="basic-addon3">Password</span>
                        <input type="password" className="form-control" placeholder=""
                            value={this.props.password} 
                            onChange={(e)=> this.props.updatePasswordCallback(e.target.value)} 
                        />
                    </div>
                    <p className="login-status">
                        {this.props.loginStatus}
                    </p>
                    <button 
                        className="btn btn-outline-warning" 
                        disabled={!isLoginValid} 
                        onClick={this.props.attemptLoginCallback}
                    >
                        Login
                    </button>
                    <p className="need-templative-account">
                        Need a Templative account? <span className="register-now" onClick={this.props.clickRegisterCallback}>Register now</span>.
                    </p>
                </div>
            </div>
        </div>        
    }
}