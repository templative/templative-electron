import React from "react";
import "./AnimatePanel.css"
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativeClient from "../../TemplativeClient"

export default class AnimatePanel extends React.Component {   
    componentDidMount = async () => {
        trackEvent("view_animatePanel")
    }
    render() {
        return <div className='mainBody '>
            <div className="col">
                <h1>Animate</h1>
            </div>     
        </div>
    }
}