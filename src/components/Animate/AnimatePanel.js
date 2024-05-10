import React from "react";
import "./AnimatePanel.css"
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativeClient from "../../TemplativeClient"

export default class AnimatePanel extends React.Component {   
    state = {
        doesUserOwnTemplative: false,
    }
    checkIfOwnsTemplative = async () => {
        var ownsTemplative = await TemplativeClient.doesUserOwnTemplative(this.props.email, this.props.token)
        this.setState({ doesUserOwnTemplative: ownsTemplative})
    }
    componentDidMount = async () => {
        await this.checkIfOwnsTemplative()
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