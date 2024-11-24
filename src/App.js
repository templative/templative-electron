import React from "react";
import socket from "./socket";
import { channels } from './shared/constants';
import StartView from "./components/StartView";
import EditProjectView from "./components/EditProjectView";
import './App.css';
import {writeLastOpenedProject, getLastProjectDirectory} from "./settings/SettingsManager"
import { trackEvent } from "@aptabase/electron/renderer";
import LoginView from "./components/LoginView";
import BootstrapSizeIndicator from "./SizeIndicator";

const { ipcRenderer } = require('electron');

class App extends React.Component {
  
    state = {
        templativeRootDirectoryPath: undefined,
        loggedIn: process.env.NODE_ENV === 'development' ? true : false,
        email: process.env.NODE_ENV === 'development' ? "dev@templative.net" : "",
        password: process.env.NODE_ENV === 'development' ? "devpass123" : "",
        token: process.env.NODE_ENV === 'development' ? "dev_tk_" + Math.random().toString(36).substring(2) : undefined,
        loginStatus: undefined,
        templativeMessages: []
    }    
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_TEMPLATIVE_ROOT_FOLDER);
        socket.off("printStatement");
        socket.disconnect()
    }
    async openTemplativeDirectoryPicker() {
        trackEvent("project_change")
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG)
    }
    async openCreateTemplativeProjectDirectoryPicker() {
        trackEvent("project_create")
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG)
    }
    updatePassword = (password) => {
        this.setState({password: password, loginStatus: undefined})
    }
    updateEmail = (email) => {
        this.setState({email: email, loginStatus: undefined})
    }
    attemptToLoadLastTemplativeProject = async () => {
        var lastProjectDirectory = getLastProjectDirectory()
        if (lastProjectDirectory === undefined) {
            return
        }
        await ipcRenderer.invoke(channels.TO_SERVER_GIVE_CURRENT_PROJECT, lastProjectDirectory)
        this.setState({templativeRootDirectoryPath: lastProjectDirectory})
    }
    componentDidMount = async () => {
        ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            writeLastOpenedProject(templativeRootDirectoryPath)
            this.setState({templativeRootDirectoryPath: templativeRootDirectoryPath})
        });
        ipcRenderer.on(channels.GIVE_CLOSE_PROJECT, (_) => {
            this.setState({templativeRootDirectoryPath: undefined})
        })
        ipcRenderer.on(channels.GIVE_LOGOUT, (_) => {
            this.setState({loggedIn: false, email: "", password: "", status: ""})
        })
        ipcRenderer.on(channels.GIVE_LOGGED_IN, (_, token, email) => {
            this.setState({loggedIn: true, token: token, email: email, password: "", status: ""})
        })
        ipcRenderer.on(channels.GIVE_NOT_LOGGED_IN, (_) => {
            this.setState({loggedIn: false})
        })
        ipcRenderer.on(channels.GIVE_UNABLE_TO_LOG_IN, (_) => {
            this.setState({loggedIn: false, loginStatus: "We were unable to log you in. Please try again later."})
        })
        ipcRenderer.on(channels.GIVE_INVALID_LOGIN_CREDENTIALS, (_) => {
            this.setState({loggedIn: false, loginStatus: "Invalid login credentials."})
        })
        socket.connect();
        socket.on('printStatement', (messages) => {
            var newMessages = messages.split('\n').map(message => message.trim()).filter(message => message !== "")
            this.setState({templativeMessages:  [...this.state.templativeMessages, ...newMessages]})
        });
        await this.attemptToLoadLastTemplativeProject()
        if (process.env.NODE_ENV !== 'development') {
            await ipcRenderer.invoke(channels.TO_SERVER_IS_LOGGED_IN)
        }
    }
    updateRoute = (route) => {
        this.setState({currentRoute: route})
    }
    attemptLogin = async () => {    
        await ipcRenderer.invoke(channels.TO_SERVER_LOGIN, this.state.email, this.state.password)
    }
    goToRegisterWebpage = async()=>{
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_URL, "https://www.templative.net/register")
    }
    render() {
        var element = <></>
        if (!this.state.loggedIn) {
            element = <LoginView 
                updateEmailCallback={this.updateEmail} 
                updatePasswordCallback={this.updatePassword} 
                clickRegisterCallback={this.goToRegisterWebpage}
                email={this.state.email} 
                password={this.state.password}
                attemptLoginCallback={this.attemptLogin}
                loginStatus={this.state.loginStatus}
            />
        }
        else if (this.state.templativeRootDirectoryPath === undefined) {
            element = <StartView 
                openCreateTemplativeProjectDirectoryPickerCallback={()=> this.openCreateTemplativeProjectDirectoryPicker()}
                openTemplativeDirectoryPickerCallback={() => this.openTemplativeDirectoryPicker()}
            />
        }
        else  { 
            element = <EditProjectView 
                token={this.state.token}
                email={this.state.email}    
                templativeRootDirectoryPath={this.state.templativeRootDirectoryPath}
                templativeMessages={this.state.templativeMessages}
            />
        }
        return <div className="App">
            {/* <BootstrapSizeIndicator/> */}
            <div className="container-fluid">
                {element}
            </div>
        </div>
    }
}

export default App;
