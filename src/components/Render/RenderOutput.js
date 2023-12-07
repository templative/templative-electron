import React from "react";
import "./RenderPanel.css"

export default class RenderOutput extends React.Component {  
    render() {
        var messageDivs = this.props.messages.map((message, index)=> {
            return <p key={index} className="outputMessage">{message}</p>
        })
        return <div className='row messageRow'>
            <div className="messageArea">
                {messageDivs}
            </div>
        </div>
    }
}