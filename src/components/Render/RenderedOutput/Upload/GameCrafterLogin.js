import React from "react";
import "./GameCrafterLogin.css"
const { ipcRenderer } = require('electron');
import { channels } from "../../../../shared/constants"
import tgcLogo from "./theGameCrafterLogo.png"

export default class GameCrafterLoginControls extends React.Component {   
    login = async () => {
        const apiKey = "2BE78AA0-48C4-11EA-8F73-9878C15BC0AE"
        const postbackUri = "templative://"

        const permissions = [
            "edit_my_games",
            "edit_my_files", 
            "edit_my_designers"
        ]
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_URL, `https://www.thegamecrafter.com/sso?api_key_id=${apiKey}&postback_uri=${postbackUri}&${permissions.map(p => `permission=${p}`).join('&')}`);
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