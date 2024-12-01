import React from "react";
import GitStatusViewer from "./GitStatusViewer";
import GithubLogin from "./GithubLogin";
import { ipcRenderer } from 'electron';
import { channels } from '../../../../../../shared/constants';

const path = require("path")
const fs = require("fs/promises")
const { exec } = require('child_process');

export default class GitRow extends React.Component {   
    state = {
        hasGit: false,
        githubToken: false
    }

    componentDidMount = async () => {
        await this.#checkHasGitAndGitProject()
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.templativeRootDirectoryPath === this.props.templativeRootDirectoryPath) {
            return
        }
        await this.#checkHasGitAndGitProject()
    }

    execAsync = (command) => {
        return new Promise((resolve, reject) => {
            exec(command, {
                cwd: this.props.templativeRootDirectoryPath
            }, (error, stdout, stderr) => {
                if (error) reject(error);
                else resolve(stdout.toString());
            });
        });
    }
    
    #isGitInstalled = async () => {
        try {
            await this.execAsync('git --version');
            console.log("Git is installed")
            return true;
        } catch (error) {
            console.log(`Git is not installed: ${error}`)
            return false;
        }
    };
    
    #isGitProjectHere = async () => {
        const gitPath = path.join(this.props.templativeRootDirectoryPath, '.git');
        try {
            await fs.access(gitPath, fs.constants.F_OK);
            console.log("Git directory found")
            return true;
        } catch {
            console.log("No .git directory found")
            return false;
        }
    }
    
    #isGithubRepo = async () => {
        try {
            const remoteUrl = await this.execAsync('git remote get-url origin');
            return remoteUrl.toLowerCase().includes('github.com');
        } catch (error) {
            console.error('Failed to check GitHub status:', error);
        }
    }
    #getGithubAuth = async () => {
        return await ipcRenderer.invoke(channels.TO_SERVER_IS_LOGGED_INTO_GITHUB)
    }

    #checkHasGitAndGitProject = async () => {
        try {
            const githubToken = await this.#getGithubAuth()
            const hasGit = 
                await this.#isGitProjectHere() && 
                await this.#isGitInstalled() &&
                await this.#isGithubRepo() &&
                githubToken !== undefined;
            
            this.setState({ hasGit, githubToken });
        } catch (error) {
            console.error('Check has Git failed:', error);
            this.setState({ 
                hasGit: false
            });
        }
    }
    setGithubAuthToken = (token) => {
        this.setState({ 
            githubToken: token 
        });
    }

    clearGithubAuthToken = () => {
        this.setState({ githubToken: null });
    }

    render() {
        if (this.state.hasGit && !this.state.githubToken) {
            return <GithubLogin 
                onAuthSuccessCallback={this.setGithubAuthToken} 
            />
        }
        
        if (this.state.hasGit && this.state.githubToken) {
            return <GitStatusViewer 
                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                githubToken={this.state.githubToken}
                clearGithubAuthTokenCallback={this.clearGithubAuthToken}
            />
        }
    }
}