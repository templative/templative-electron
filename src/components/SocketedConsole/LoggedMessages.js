import React from "react";
import socket from "../../socket"
import "./LoggedMessages.css"
import { channels } from "../../shared/constants"
const { ipcRenderer } = require('electron');
const path = require('path');
const { shell } = window.require('electron');

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
    static visitLink = async (link) => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_URL, link)
    }
    static openFilepath = async (filepath) => {
        shell.openPath(filepath)
            .then(() => console.log('File opened'))
            .catch(err => console.error('Error opening file:', err));
    }
    static parseFilePath = (filePath) => {
        const normalizedPath = filePath.replace(/\\/g, '/');
        const parts = normalizedPath.split('/');
        const fileNameWithExtension = parts[parts.length - 1];
    
        return fileNameWithExtension;
    }

    static replaceUrlsWithLinks = (text) => {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var filePathRegex = /\b(\S+\.(?:txt|pdf|png|jpg))\b/g;
        return text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return <span onClick={async () => LoggedMessages.visitLink(part)} className="console-url" key={index} href={part}>{part}</span>;
            } else {
                return part.split(filePathRegex).map((subPart, subIndex) => {
                    if (subPart.match(filePathRegex)) {
                        return <span onClick={async () => LoggedMessages.openFilepath(subPart)} className="console-filepath" key={index + subIndex}>{LoggedMessages.parseFilePath(subPart)}</span>;
                    } else {
                        return subPart;
                    }
                });
            }
        });
    }

    addMessage(message) {
        var newMessages = this.state.messages
        const hyperlinkedMessage = LoggedMessages.replaceUrlsWithLinks(message)
        const className = `outputMessage ${message.startsWith("!!!") && "output-warning"}`
        const newElement = <p key={this.state.messages.length} className={className}>
            {this.state.messages.length}.   {hyperlinkedMessage}
        </p>
        newMessages.push(newElement)
        this.setState({messages: newMessages})
    }

    render() {
        const messagesCopy = [...this.state.messages];
        const reversedElements = messagesCopy.reverse();
        return <div className="console-messages">
            {reversedElements}
        </div>
    }
}
