import React from "react";
import "./NoLicenseView.css"
// import Logo from "./logo.svg?react"
import { shell } from 'electron';
import wankahImage from './oioioiwankah.jpg';

const { ipcRenderer } = require('electron');
const { channels } = require('../../shared/constants');

export default class NoLicenseView extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            isHoveringCheckLicense: false,
            isCheckingLicense: false
        };
    }
    openPricingPage = async () => {
        const pricingUrl = 'https://templative.net/pricing';
        shell.openExternal(pricingUrl);
    };  
    refreshLicense = async () => {
        this.setState({ isCheckingLicense: true });
        try {
            const ownershipResult = await ipcRenderer.invoke(channels.TO_SERVER_CHECK_TEMPLATIVE_OWNERSHIP);
            
            if (ownershipResult.hasProduct) {
                // If they now own Templative, trigger a re-check in the parent component
                if (this.props.handleOwnershipConfirmed) {
                    this.props.handleOwnershipConfirmed();
                }
            } else {
                // Show a message that they still don't have a license
                console.log("No Templative license found. Please purchase a license first.");
            }
        } catch (error) {
            console.error('Error checking license:', error);
        } finally {
            this.setState({ isCheckingLicense: false });
        }
    };  
    logout = async () => {
        try {
            if (this.props.handleLogout) {
                this.props.handleLogout();
            } else {
                await ipcRenderer.invoke(channels.TO_SERVER_LOGOUT);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    hoverCheckLicense = () => {
        this.setState({ isHoveringCheckLicense: true });
    }
    unhoverCheckLicense = () => {
        this.setState({ isHoveringCheckLicense: false });
    }
    render() {
        const checkLicenseIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise check-license-icon" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
        </svg>

        const personIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>

        return <div className="start-view" data-bs-theme="dark">
            <div className="welcome-modal">
                {/* <Logo className="login-logo"/> */}
                <p className="wankah-text">Oi oi oi wankah! You got a license for that Templative?</p>
                <p className="license-hypnosis">You want to buy a license. You <em>need</em> to buy a license.</p>
                <img src={wankahImage} className="wankah-image" alt="Wankah" />

                <div className="button-container">
                    <button className="btn btn-primary buy-license" onClick={this.openPricingPage}>Buy a License</button>
                </div>
                <div className="button-container">
                    <button 
                        className={`btn btn-outline-primary check-license ${this.state.isHoveringCheckLicense ? 'hovering-check-license' : ''}`} 
                        onMouseEnter={this.hoverCheckLicense} 
                        onMouseLeave={this.unhoverCheckLicense} 
                        onClick={this.refreshLicense}
                        disabled={this.state.isCheckingLicense}
                    >
                        {this.state.isCheckingLicense ? 'Checking...' : 'Check License'} {!this.state.isCheckingLicense && checkLicenseIcon}
                    </button>
                    <button className="btn btn-outline-primary logout" onClick={this.logout}>Logout</button>
                </div>
                <p className="account-email">{personIcon} {this.props.email}</p>

            </div>
        </div>        
    }
}