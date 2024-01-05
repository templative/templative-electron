import React from "react";
import {socket} from "../../socket"
import "./LoggedMessages.css"

export default class LoggedMessages extends React.Component {  
    state = {
        messages: []
    }

    componentDidMount() {
        socket.connect();
        console.log("connect")
        socket.on('printStatement', (message) => this.addMessage(message));
    }
    componentWillUnmount() {
        console.log("disconnect")
        socket.off("printStatement");
        socket.disconnect()
    }

    addMessage(message) {
        var newMessages = this.state.messages
        newMessages.push(message)
        this.setState({messages: newMessages})
    }

    render() {
        console.log("render")
        var messageDivs = this.state.messages.map((message, index)=> {
            return <p key={index} className="outputMessage">{message}</p>
        })
        return <div className='row messageRow'>
            <div className="messageArea">
                {messageDivs}
            </div>
        </div>
    }
}