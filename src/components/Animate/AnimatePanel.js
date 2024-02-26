import React from "react";
import "./AnimatePanel.css"
import { trackEvent } from "@aptabase/electron/renderer";

export default class AnimatePanel extends React.Component {   
    componentDidMount() {
        trackEvent("view_animatePanel")
    }
    render() {
        return <div className='mainBody row '>
            <div className="col">
                <h1>Animate</h1>
            </div>     
        </div>
    }
}