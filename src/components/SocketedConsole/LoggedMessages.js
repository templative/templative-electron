import React from "react";
import socket from "../../socket"
import "./LoggedMessages.css"

export class LoggedMessages extends React.Component {  
    state = {
        messages: []
    }

    componentDidMount() {
        socket.connect();
        socket.on('printStatement', (message) => this.addMessage(message));
    }
    componentWillUnmount() {
        socket.off("printStatement");
        socket.disconnect()
    }

    addMessage(message) {
        var newMessages = this.state.messages
        newMessages.push(message)
        this.setState({messages: newMessages})
    }

    render() {
        var messageDivs = this.state.messages.map((message, index)=> {
            return <p key={index} className={`outputMessage ${message.startsWith("!!!") && "output-warning"}`}>{index+1}.   {message}</p>
        })
        return <div className="console-messages">
            {messageDivs.reverse()}
        </div>
    }
}
