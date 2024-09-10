import React from "react";
import socket from "../../socket"
import "./LoggedMessages.css"
import { channels } from "../../shared/constants"
const { ipcRenderer } = require('electron');
const path = require('path');
const { shell } = window.require('electron');

export class LoggedMessages extends React.Component {  
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

    render() {
        var messageElements = this.props.messages === undefined ? [] : this.props.messages.map((message, index) => {
            const className = `outputMessage ${message.startsWith("!!!") && "output-warning"} ${index % 2 === 0 && "odd-output-child"}`
            var contents = message.replace("!!!", "")
            var hyperlinkedMessage = LoggedMessages.replaceUrlsWithLinks(contents)
            return <p key={index} className={className}>{hyperlinkedMessage}</p>
        }).reverse();
        return <div className="console-messages">
            {messageElements}
        </div>
    }
}
