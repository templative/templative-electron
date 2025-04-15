import React from "react";
import "./LoggedMessages.css"
import { channels } from "../../../shared/constants"
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

    constructor(props) {
        super(props);
        this.state = {
            internalMessages: []
        };
    }
    
    async componentDidMount() {
        // Set up the IPC listener for new log messages
        ipcRenderer.on(channels.GIVE_LOG_MESSAGE, (event, message) => {
            this.setState(prevState => ({
                internalMessages: [...prevState.internalMessages, message]
            }));
        });
        
        // Fetch existing logs from the main process
        try {
            const existingLogs = await ipcRenderer.invoke(channels.TO_SERVER_GET_LOGS);
            if (existingLogs && existingLogs.length > 0) {
                this.setState({
                    internalMessages: existingLogs
                });
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    }
    
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_LOG_MESSAGE);
    }

    render() {
        // Combine props messages with internal messages
        const allMessages = [...(this.props.messages || []), ...this.state.internalMessages];
        
        var messageElements = [];
        if (allMessages.length > 0) {
            messageElements = allMessages.map((message, index) => 
                LoggedMessages.processMessage(message, index, this.props.templativeRootDirectoryPath)
            ).reverse();
        }
        
        return <div className="console-messages">
            {messageElements}
        </div>
    }
}
