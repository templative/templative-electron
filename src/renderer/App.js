import React from "react";
import { trackEvent } from "@aptabase/electron/renderer";

import socket from "./utility/socket";
import { channels } from '../shared/constants';

import LoginView from "./components/LoginView";
import StartView from "./components/StartView";
import EditProjectView from "./components/EditProjectView";
import BootstrapSizeIndicator from "./utility/SizeIndicator";
import CreateProjectView from "./components/CreateProjectView";
import './Theme.css';
import './App.css';
import './Inputs.css';
import Toast from './components/Toast/Toast';
import NoLicenseView from "./components/NoLicenseView";

const { ipcRenderer } = require('electron');

class App extends React.Component {
    state = {
        templativeRootDirectoryPath: undefined,
        ownsTemplative: false,
        loggedIn: false,
        email: "",
        password: "",
        token: undefined,
        loginStatus: undefined,
        templativeMessages: [],
        currentView: "start",
        toast: {
            message: '',
            type: 'info',
            visible: false
        }
    }    
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_TEMPLATIVE_ROOT_FOLDER);
        ipcRenderer.removeAllListeners(channels.GIVE_CLOSE_PROJECT);
        ipcRenderer.removeAllListeners(channels.GIVE_LOGOUT);
        ipcRenderer.removeAllListeners(channels.GIVE_LOGGED_IN);
        ipcRenderer.removeAllListeners(channels.GIVE_NOT_LOGGED_IN);
        ipcRenderer.removeAllListeners(channels.GIVE_UNABLE_TO_LOG_IN);
        ipcRenderer.removeAllListeners(channels.GIVE_INVALID_LOGIN_CREDENTIALS);
        ipcRenderer.removeAllListeners(channels.GIVE_OPEN_CREATE_PROJECT_VIEW);
        ipcRenderer.removeAllListeners(channels.GIVE_TOAST_MESSAGE);
    }
    async openTemplativeDirectoryPicker() {
        trackEvent("project_change")
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG)
    }
    async openCreateTemplativeProjectDirectoryPicker() {
        trackEvent("project_create")
        this.setState({ currentView: "createProject" });
    }
    updatePassword = (password) => {
        this.setState({password: password, loginStatus: undefined})
    }
    updateEmail = (email) => {
        this.setState({email: email, loginStatus: undefined})
    }
    attemptToLoadLastTemplativeProject = async () => {
        var lastProjectDirectory = await ipcRenderer.invoke(channels.TO_SERVER_GET_CURRENT_PROJECT);
        if (!lastProjectDirectory) {
            this.setState({templativeRootDirectoryPath: undefined, currentView: "start"});
            return;
        }
        this.setState({templativeRootDirectoryPath: lastProjectDirectory, currentView: "editProject"});
    }
    checkTemplativeOwnership = async () => {
        try {
            const ownershipResult = await ipcRenderer.invoke(channels.TO_SERVER_CHECK_TEMPLATIVE_OWNERSHIP);
            
            if (ownershipResult.hasProduct) {
                this.setState({ ownsTemplative: true });
                await this.attemptToLoadLastTemplativeProject();
            } else {
                this.setState({ ownsTemplative: false, currentView: "noLicense" });
            }
        } catch (error) {
            console.error('Error checking Templative ownership:', error);
            // If there's an error checking ownership, assume they don't own it
            this.setState({ ownsTemplative: false, currentView: "noLicense" });
        }
    }
    componentDidMount = async () => {
        ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            this.setState({
                templativeRootDirectoryPath: templativeRootDirectoryPath,
                currentView: "editProject"
            });
        });
        ipcRenderer.on(channels.GIVE_TOAST_MESSAGE, (event, message, type) => {
            this.showToast(message, type);
        })
        ipcRenderer.on(channels.GIVE_CLOSE_PROJECT, (_) => {
            this.setState({
                templativeRootDirectoryPath: undefined,
                currentView: "start"
            })
        })
        ipcRenderer.on(channels.GIVE_LOGOUT, (_) => {
            this.setState({loggedIn: false, email: "", password: "", status: "", currentView: "login"})
        })
        ipcRenderer.on(channels.GIVE_LOGGED_IN, (_, token, email, ownership) => {
            this.setState({
                loggedIn: true, 
                token: token, 
                email: email, 
                password: "", 
                status: "",
                ownsTemplative: ownership ? ownership.hasProduct : false
            }, async () => {
                // If user owns Templative, load the last project, otherwise show start view
                if (ownership && ownership.hasProduct) {
                    await this.attemptToLoadLastTemplativeProject();
                } else {
                    this.setState({ currentView: "noLicense" });
                }
            });
        })
        ipcRenderer.on(channels.GIVE_NOT_LOGGED_IN, (_) => {
            this.setState({loggedIn: false, currentView: "login"})
        })
        ipcRenderer.on(channels.GIVE_UNABLE_TO_LOG_IN, (_) => {
            trackEvent("user_login_error", { reason: "server_error" })
            this.setState({loggedIn: false, loginStatus: "We were unable to log you in. Please try again later."})
        })
        ipcRenderer.on(channels.GIVE_INVALID_LOGIN_CREDENTIALS, (_) => {
            trackEvent("user_login_error", { reason: "invalid_credentials" })
            this.setState({loggedIn: false, loginStatus: "Invalid login credentials."})
        })
        ipcRenderer.on(channels.GIVE_OPEN_CREATE_PROJECT_VIEW, (_) => {
            this.setState({ currentView: "createProject" })
        })
        
        // socket.connect();
        // socket.on('printStatement', (messages) => {
        //     var newMessages = messages.split('\n').map(message => message.trim()).filter(message => message !== "")
        //     this.setState({templativeMessages:  [...this.state.templativeMessages, ...newMessages]})
        // });

        await this.attemptToLoadLastTemplativeProject();
        await ipcRenderer.invoke(channels.TO_SERVER_IS_LOGGED_IN);
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
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_URL, "https://templative.net/register")
    }
    showToast = (message, type = 'info') => {
        this.setState({
            toast: {
                message,
                type,
                visible: true
            }
        });
    }
    hideToast = () => {
        this.setState({
            toast: {
                message: '',
                type: 'info',
                visible: false
            }
        });
    }
    goBackToStartView = () => {
        this.setState({ currentView: "start" });
    }
    
    handleOwnershipConfirmed = async () => {
        // When ownership is confirmed, update state and load the last project
        this.setState({ ownsTemplative: true });
        await this.attemptToLoadLastTemplativeProject();
    }
    
    handleLogout = async () => {
        // Trigger logout through IPC
        await ipcRenderer.invoke(channels.TO_SERVER_LOGOUT);
    }
    
    render() {
        let element = <></>

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
        else if (this.state.currentView === "noLicense" || !this.state.ownsTemplative) {
            element = <NoLicenseView 
                email={this.state.email}
                goBackToStartView={this.goBackToStartView}
                handleOwnershipConfirmed={this.handleOwnershipConfirmed}
                handleLogout={this.handleLogout}
            />
        }
        else if (this.state.currentView === "createProject") {
            element = <CreateProjectView 
                goBackCallback={this.goBackToStartView}
            />
        }
        else if (this.state.templativeRootDirectoryPath === undefined || this.state.currentView === "start") {
            element = <StartView 
                openCreateTemplativeProjectDirectoryPickerCallback={this.openCreateTemplativeProjectDirectoryPicker.bind(this)}
                openTemplativeDirectoryPickerCallback={() => this.openTemplativeDirectoryPicker()}
            />
        }
        else if (this.state.currentView === "editProject") { 
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
            {this.state.toast.visible && (
                <Toast 
                    message={this.state.toast.message}
                    type={this.state.toast.type}
                    onClose={this.hideToast}
                />
            )}
        </div>
    }
}

export default App;
