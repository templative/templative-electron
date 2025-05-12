import React from "react";
import "./GameCrafterLogin.css"
const { ipcRenderer } = require('electron');
import { channels } from "../../../../../shared/constants"
import tgcLogo from "./theGameCrafterLogo.png"

export default class GameCrafterLoginControls extends React.Component {   
    login = async () => {
        const apiKey = "2BE78AA0-48C4-11EA-8F73-9878C15BC0AE"
        const postbackUri = "templative://oauth/callback"

        const permissions = [
            "edit_my_games",
            "edit_my_files", 
            "edit_my_designers"
        ]
        
        const params = new URLSearchParams({
            api_key_id: apiKey,
            postback_uri: postbackUri,
        });
        
        // Add each permission to the params
        permissions.forEach(p => params.append('permission', p));
        
        const url = `https://www.thegamecrafter.com/sso?${params.toString()}`;
        console.log("TGC URL", url);
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_URL, url);
    }
    render() {
        return <div className="game-crafter-login-controls">
            <img src={tgcLogo} alt="TheGameCrafter Logo" className="tgc-logo" />
            <button  
                type="button" 
                className="btn login-tgc-button" 
                onClick={async () => await this.login()}
            >Login to TheGameCrafter ↗</button>
        </div>
    }
}