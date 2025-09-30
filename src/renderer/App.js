import React from "react";
import { trackEvent } from "@aptabase/electron/renderer";

import socket from "./utility/socket";
import { channels } from '../shared/constants';

import LoginView from "./components/Login/LoginView";
import StartView from "./components/StartView";
import EditProjectView from "./components/EditProjectView";
import BootstrapSizeIndicator from "./utility/SizeIndicator";
import CreateProjectView from "./components/CreateProjectView";
import './Theme.css';
import './App.css';
import './Inputs.css';
import Toast from './components/Toast/Toast';
import NoLicenseView from "./components/NoLicenseView";
import LoadingView from "./components/LoadingView";

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
        loading: true,
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
            return { hasProject: false, projectPath: undefined };
        }
        return { hasProject: true, projectPath: lastProjectDirectory };
    }
    checkTemplativeOwnership = async () => {
        try {
            const ownershipResult = await ipcRenderer.invoke(channels.TO_SERVER_CHECK_TEMPLATIVE_OWNERSHIP);
            return ownershipResult;
        } catch (error) {
            console.error('Error checking Templative ownership:', error);
            return { hasProduct: false };
        }
    }
    
    initializeAppState = async () => {
        this.setState({ loading: true });
        
        // First check if user is logged in
        await ipcRenderer.invoke(channels.TO_SERVER_IS_LOGGED_IN);
        // The response will be handled by the IPC listeners
        // We don't set loading to false here because the IPC listeners will handle the full flow
    }
    
    componentDidMount = async () => {
        ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            this.setState({
                templativeRootDirectoryPath: templativeRootDirectoryPath,
                currentView: "editProject",
                loading: false
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
            this.setState({
                loggedIn: false, 
                email: "", 
                password: "", 
                status: "", 
                currentView: "login",
                loading: false
            })
        })
        ipcRenderer.on(channels.GIVE_LOGGED_IN, async (_, token, email, ownership) => {
            this.setState({
                loggedIn: true, 
                token: token, 
                email: email, 
                password: "", 
                status: "",
                ownsTemplative: ownership ? ownership.hasProduct : false
            });
            
            // Now that we're logged in, determine the appropriate view
            if (ownership && ownership.hasProduct) {
                // User owns Templative, check for last project
                const projectInfo = await this.attemptToLoadLastTemplativeProject();
                if (projectInfo.hasProject) {
                    this.setState({
                        templativeRootDirectoryPath: projectInfo.projectPath,
                        currentView: "editProject",
                        loading: false
                    });
                } else {
                    this.setState({
                        currentView: "start",
                        loading: false
                    });
                }
            } else {
                // User doesn't own Templative
                this.setState({
                    currentView: "noLicense",
                    loading: false
                });
            }
        })
        ipcRenderer.on(channels.GIVE_NOT_LOGGED_IN, (_) => {
            this.setState({
                loggedIn: false, 
                currentView: "login",
                loading: false
            })
        })
        ipcRenderer.on(channels.GIVE_UNABLE_TO_LOG_IN, (_) => {
            trackEvent("user_login_error", { reason: "server_error" })
            this.setState({
                loggedIn: false, 
                loginStatus: "We were unable to log you in. Please try again later.",
                loading: false
            })
        })
        ipcRenderer.on(channels.GIVE_INVALID_LOGIN_CREDENTIALS, (_) => {
            trackEvent("user_login_error", { reason: "invalid_credentials" })
            this.setState({
                loggedIn: false, 
                loginStatus: "Invalid login credentials.",
                loading: false
            })
        })
        ipcRenderer.on(channels.GIVE_OPEN_CREATE_PROJECT_VIEW, (_) => {
            this.setState({ currentView: "createProject" })
        })
        
        // socket.connect();
        // socket.on('printStatement', (messages) => {
        //     var newMessages = messages.split('\n').map(message => message.trim()).filter(message => message !== "")
        //     this.setState({templativeMessages:  [...this.state.templativeMessages, ...newMessages]})
        // });

        // Initialize the app state
        await this.initializeAppState();
    }
    
    updateRoute = (route) => {
        this.setState({currentRoute: route})
    }
    // Passwordless: step 1 - send email code via server
    sendLoginCode = async (email) => {
        try {
            trackEvent("user_login_code_send", { email });
            const result = await ipcRenderer.invoke(channels.TO_SERVER_SEND_LOGIN_CODE, email);
            // Expect { success: true } or { success: false, error }
            if (!result || result.success === false) {
                this.setState({ loginStatus: (result && result.error) || 'Failed to send login code' });
            }
            return result;
        } catch (err) {
            this.setState({ loginStatus: 'Failed to send login code' });
            return { success: false, error: 'IPC error' };
        }
    }

    // Passwordless: step 2 - verify code and login
    verifyLoginCode = async (email, code) => {
        try {
            trackEvent("user_login_code_verify", { email });
            const result = await ipcRenderer.invoke(channels.TO_SERVER_VERIFY_LOGIN_CODE, email, code);
            // The main process should, on success, emit GIVE_LOGGED_IN which our listener handles.
            if (!result || result.success === false) {
                const errorMsg = (result && result.error) || 'Invalid or expired code';
                this.setState({ loginStatus: errorMsg });
            }
            return result;
        } catch (err) {
            this.setState({ loginStatus: 'Invalid or expired code' });
            return { success: false, error: 'IPC error' };
        }
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
        this.setState({ ownsTemplative: true, loading: true });
        
        const projectInfo = await this.attemptToLoadLastTemplativeProject();
        if (projectInfo.hasProject) {
            this.setState({
                templativeRootDirectoryPath: projectInfo.projectPath,
                currentView: "editProject",
                loading: false
            });
        } else {
            this.setState({
                currentView: "start",
                loading: false
            });
        }
    }
    
    handleLogout = async () => {
        // Trigger logout through IPC
        await ipcRenderer.invoke(channels.TO_SERVER_LOGOUT);
    }
    
    render() {
        // Show loading view while collecting initial information
        if (this.state.loading) {
            return <div className="App">
                <div className="container-fluid">
                    <LoadingView/>
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

        let element = <LoadingView/>

        if (!this.state.loggedIn) {
            element = <LoginView 
                updateEmailCallback={this.updateEmail}
                clickRegisterCallback={this.goToRegisterWebpage}
                email={this.state.email}
                loginStatus={this.state.loginStatus}
                sendLoginCodeCallback={this.sendLoginCode}
                verifyLoginCodeCallback={this.verifyLoginCode}
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
