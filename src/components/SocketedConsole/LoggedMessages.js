import React from "react";
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
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_FILEPATH, filepath)
    }
    static parseFilePath = (filePath, templativeRootDirectoryPath) => {
        
        var normalizedPath = filePath.replace(/\\/g, '/');
        var normalizedTemplativePath = templativeRootDirectoryPath.replace(/\\/g, '/');

        if (normalizedPath.toLowerCase().includes(normalizedTemplativePath.toLowerCase())) {
            const index = normalizedPath.toLowerCase().indexOf(normalizedTemplativePath.toLowerCase());
            normalizedPath = normalizedPath.substring(index + normalizedTemplativePath.length + 1);
        }
        return normalizedPath    
    }

    static handleUrlPart = (part, index) => {
        return <span 
            onClick={() => LoggedMessages.visitLink(part)} 
            className="console-url" 
            key={index}
        >
            {part}
        </span>;
    }

    static handleFilePathPart = (subPart, index, templativeRootDirectoryPath) => {
        return <span 
            onClick={() => LoggedMessages.openFilepath(subPart)} 
            className="console-filepath" 
            key={index}
            title={subPart}
        >
            ./{LoggedMessages.parseFilePath(subPart, templativeRootDirectoryPath)}
        </span>;
    }

    static processFilePathSegments = (part, index, templativeRootDirectoryPath) => {
        const filePathRegex = /(?:\b[a-zA-Z]:[\\\/][^:\s"<>|\r\n]+|(?:^|\s)\/[^\s]+)/g;
        let matches = [...part.matchAll(filePathRegex)];
        let lastIndex = 0;
        let parts = [];

        matches.forEach((match) => {
            const matchStartIndex = match[0].startsWith(' ') ? match.index + 1 : match.index;
            if (matchStartIndex > lastIndex) {
                parts.push(part.substring(lastIndex, matchStartIndex));
            }
            const path = match[0].trimStart();
            parts.push(LoggedMessages.handleFilePathPart(path, parts.length, templativeRootDirectoryPath));
            lastIndex = match.index + match[0].length;
        });

        if (lastIndex < part.length) {
            parts.push(part.substring(lastIndex));
        }

        return parts;
    }

    static replaceUrlsWithLinks = (text, templativeRootDirectoryPath) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urlParts = text.split(urlRegex)
        var parts = urlParts.map((part, index) => {
            if (part.match(urlRegex)) {
                return LoggedMessages.handleUrlPart(part, index, templativeRootDirectoryPath);
            }
            return LoggedMessages.processFilePathSegments(part, index, templativeRootDirectoryPath);
        });
        return parts
    }

    static processMessage (message, index, templativeRootDirectoryPath) {
        const isWarning = message.startsWith("!!!")
        const className = `outputMessage ${isWarning && "output-warning"} ${index % 2 === 0 && "odd-output-child"}`
        var contentWithoutWarning = message.replace("!!!", "")

        var spans = LoggedMessages.replaceUrlsWithLinks(contentWithoutWarning, templativeRootDirectoryPath)
        return <p key={index} className={className}>{spans}</p>
    }

    render() {
        
        var messageElements = [  ] //LoggedMessages.processMessage("!!!Producing /Users/oliverbarnum/Documents/git/peace-of-westphalia/output/westphalia_giftVersion_0.0.0_2024-11-26_01-39-59_abilities", 0, this.props.templativeRootDirectoryPath)
        if (this.props.messages !== undefined) {
            messageElements = this.props.messages.map((message, index) => LoggedMessages.processMessage(message, index, this.props.templativeRootDirectoryPath)).reverse();
        }
        return <div className="console-messages">
            {messageElements}
        </div>
    }
}
