import React from "react";
import { trackEvent } from "@aptabase/electron/renderer";

import socket from "./utility/socket";
import { channels } from '../../shared/constants';

import LoginView from "./components/LoginView";
import StartView from "./components/StartView";
import EditProjectView from "./components/EditProjectView";
import BootstrapSizeIndicator from "./utility/SizeIndicator";

import './Theme.css';
import './App.css';
import './Inputs.css';

import {writeLastOpenedProject, getLastProjectDirectory} from "./utility/SettingsManager"
const { ipcRenderer } = require('electron');


class App extends React.Component {
    
    state = {
        templativeRootDirectoryPath: undefined,
        loggedIn: false,
        email: "",
        password: "",
        token: undefined,
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
        trackEvent("project_load_last", { directory: lastProjectDirectory })
        await ipcRenderer.invoke(channels.TO_SERVER_GIVE_CURRENT_PROJECT, lastProjectDirectory)
        this.setState({templativeRootDirectoryPath: lastProjectDirectory})
    }
    componentDidMount = async () => {
        ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            trackEvent("project_load_success", { directory: templativeRootDirectoryPath })
            writeLastOpenedProject(templativeRootDirectoryPath)
            this.setState({templativeRootDirectoryPath: templativeRootDirectoryPath})
        });
        ipcRenderer.on(channels.GIVE_CLOSE_PROJECT, (_) => {
            trackEvent("project_close")
            this.setState({templativeRootDirectoryPath: undefined})
        })
        ipcRenderer.on(channels.GIVE_LOGOUT, (_) => {
            trackEvent("user_logout")
            this.setState({loggedIn: false, email: "", password: "", status: ""})
        })
        ipcRenderer.on(channels.GIVE_LOGGED_IN, (_, token, email) => {
            trackEvent("user_login_success", { email })
            this.setState({loggedIn: true, token: token, email: email, password: "", status: ""})
        })
        ipcRenderer.on(channels.GIVE_NOT_LOGGED_IN, (_) => {
            this.setState({loggedIn: false})
        })
        ipcRenderer.on(channels.GIVE_UNABLE_TO_LOG_IN, (_) => {
            trackEvent("user_login_error", { reason: "server_error" })
            this.setState({loggedIn: false, loginStatus: "We were unable to log you in. Please try again later."})
        })
        ipcRenderer.on(channels.GIVE_INVALID_LOGIN_CREDENTIALS, (_) => {
            trackEvent("user_login_error", { reason: "invalid_credentials" })
            this.setState({loggedIn: false, loginStatus: "Invalid login credentials."})
        })
        socket.connect();
        socket.on('printStatement', (messages) => {
            var newMessages = messages.split('\n').map(message => message.trim()).filter(message => message !== "")
            this.setState({templativeMessages:  [...this.state.templativeMessages, ...newMessages]})
        });
        await this.attemptToLoadLastTemplativeProject()
        await ipcRenderer.invoke(channels.TO_SERVER_IS_LOGGED_IN)
    }
    updateRoute = (route) => {
        this.setState({currentRoute: route})
    }
    attemptLogin = async () => {    
        trackEvent("user_login_attempt", { email: this.state.email })
        await ipcRenderer.invoke(channels.TO_SERVER_LOGIN, this.state.email, this.state.password)
    }
    goToRegisterWebpage = async()=>{
        trackEvent("user_register_click")
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_URL, "https://templative-server-84c7a76c7ddd.herokuapp.com/register")
    }
    render() {
        var element = <></>
        if (!this.state.loggedIn) {
            trackEvent("view_loginView")
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
            trackEvent("view_startView")
            element = <StartView 
                openCreateTemplativeProjectDirectoryPickerCallback={()=> this.openCreateTemplativeProjectDirectoryPicker()}
                openTemplativeDirectoryPickerCallback={() => this.openTemplativeDirectoryPicker()}
            />
        }
        else  { 
            trackEvent("view_editProjectView")
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
