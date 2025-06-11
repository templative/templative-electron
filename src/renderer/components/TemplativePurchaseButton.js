import React from "react";
import "./TemplativePurchaseButton.css"
import { channels } from '../../shared/constants';
const { ipcRenderer } = require('electron');

export default class TemplativePurchaseButton extends React.Component {   
    state = {
        isHovering: false,
        isHoveringX: false,
    }

    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    goToTemplativeWebsite = async () => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_URL, "https://www.templative.net/pricing")
    }
    render() {
        return <button 
            type="button" 
            className="btn btn-outline-primary templative-purchase-button"
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-lock templative-purchase-lock" viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet">
                {this.state.isHovering ?
                    <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2M3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/>
                :
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>    
                }
                
            </svg>
            <span className="templative-purchase-text" onClick={this.goToTemplativeWebsite}>Buy Templative to Unlock {this.props.action}</span>
    </button>
    }
}