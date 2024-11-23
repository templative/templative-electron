import React from "react";
import "./GitStatusViewer.css";
const { exec } = require('child_process');
const path = require("path");

import artdataIcon from "../Icons/artDataIcon.svg"
import pieceIcon from "../Icons/pieceIcon.svg"
import componentIcon from "../Icons/componentIcon.svg"
import componentComposeIcon from "../Icons/componentComposeIcon.svg"
import rulesIcon from "../Icons/rulesIcon.svg"
import artIcon from "../Icons/artIcon.svg"
import gameIcon from "../Icons/gameIcon.svg"
import studioIcon from "../Icons/studioIcon.svg"

export default class GitStatusViewer extends React.Component {
    state = {
        modifiedFiles: [],
        stagedFiles: [],
        commitMessage: "",
        branchStatus: { ahead: 0, behind: 0 },
        watcherInterval: null,
        currentBranch: "",
        mergeConflicts: [],
        isRebasing: false,
        rebaseError: null,
        isLoading: false,
        error: null
    }

    componentDidMount = async () => {
        await this.checkGitStatus();
        // Start the watcher
        const watcherInterval = setInterval(this.checkGitStatus, 2000); // Check every 2 seconds
        this.setState({ watcherInterval });
    }

    componentDidUpdate = async (prevProps) => {
        if (prevProps.templativeRootDirectoryPath !== this.props.templativeRootDirectoryPath) {
            await this.checkGitStatus();
        }
    }

    componentWillUnmount = () => {
        // Clean up the watcher when component unmounts
        if (this.state.watcherInterval) {
            clearInterval(this.state.watcherInterval);
        }
    }

    // Add utility method for async exec
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

    getPullStrategy = async () => {
        try {
            const rebaseConfig = await this.execAsync('git config --get pull.rebase');
            const ffConfig = await this.execAsync('git config --get pull.ff');

            if (rebaseConfig.trim() === 'true') return '--rebase';
            if (rebaseConfig.trim() === 'false') return '--no-rebase';
            if (ffConfig.trim() === 'only') return '--ff-only';
            return '';
        } catch (error) {
            return '';
        }
    }

    checkGitStatus = async () => {
        if (this.state.isLoading) return;

        try {
            this.setState({ isLoading: true, error: null });

            // Perform git operations in parallel where possible
            await this.execAsync('git fetch');
            const [status, currentBranch] = await Promise.all([
                this.execAsync('git status --porcelain'),
                this.execAsync('git rev-parse --abbrev-ref HEAD')
            ]);

            // Process status results
            const { stagedFiles, modifiedFiles, mergeConflicts } = this.processGitStatus(status);

            // Get branch status
            let branchStatus = { ahead: 0, behind: 0 };
            try {
                const branchInfo = await this.execAsync('git rev-list --left-right --count HEAD...@{u}');
                const [ahead, behind] = branchInfo.trim().split(/\s+/);
                branchStatus = { ahead: parseInt(ahead) || 0, behind: parseInt(behind) || 0 };
            } catch (error) {
                // Handle case with no upstream
                const aheadCount = await this.execAsync('git rev-list HEAD @{u}... --count 2>/dev/null || git rev-list HEAD --count');
                branchStatus = { ahead: parseInt(aheadCount) || 0, behind: 0 };
            }

            const isRebasing = require('fs').existsSync(
                path.join(this.props.templativeRootDirectoryPath, '.git', 'rebase-merge')
            ) || require('fs').existsSync(
                path.join(this.props.templativeRootDirectoryPath, '.git', 'rebase-apply')
            );

            this.setState({
                stagedFiles,
                modifiedFiles,
                branchStatus,
                currentBranch: currentBranch.trim(),
                mergeConflicts,
                isRebasing,
                isLoading: false
            });
        } catch (error) {
            console.error('Git status check failed:', error);
            this.setState({ 
                isLoading: false,
                error: error.message 
            });
        }
    }

    getIconForFile = (filepath) => {
        const relativePath = filepath.replace(this.props.templativeRootDirectoryPath, '').replace(/^[/\\]/, '');
        if (relativePath.startsWith('artdata')) {
            return artdataIcon;
        }
        if (relativePath.startsWith('art')) {
            return artIcon;
        }
        
        if (relativePath.startsWith('gamedata/piece')) {
            return pieceIcon;
        }
        if (relativePath.startsWith('gamedata/component')) {
            return componentIcon;
        }
        if (relativePath === 'component-compose.json') {
            return componentComposeIcon;
        }
        if (relativePath === 'rules.pdf') {
            return rulesIcon;
        }
        if (relativePath === 'studio.json') {
            return studioIcon;
        }
        if (relativePath === 'game.json') {
            return gameIcon;
        }
        
        return null;
    }

    getDisplayName = (filepath) => {
        const filename = filepath.split(/[/\\]/).pop();
        const icon = this.getIconForFile(filepath);
        // If we have an icon, remove the extension
        return icon ? filename.replace(/\.[^/.]+$/, '') : filename;
    }

    commitChanges = async () => {
        try {
            await this.execAsync(`git commit -m "${this.state.commitMessage}"`);
            this.setState({ commitMessage: '' });
            await this.checkGitStatus();
        } catch (error) {
            this.setState({ error: 'Git commit failed: ' + error.message });
        }
    }

    handleCommitMessageChange = (event) => {
        this.setState({ commitMessage: event.target.value });
    }

    revertFile = async (filePath) => {
        try {
            await this.execAsync(`git restore --worktree "${filePath}"`);
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git revert failed:', error);
        }
    }

    unstageFile = async (filePath) => {
        try {
            await this.execAsync(`git restore --staged "${filePath}"`);
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git unstage failed:', error);
        }
    }

    stageFile = async (filePath) => {
        try {
            await this.execAsync(`git add "${filePath}"`);
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git stage failed:', error);
        }
    }

    unstageAllFiles = async () => {
        try {
            await this.execAsync('git restore --staged .');
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git unstage all failed:', error);
        }
    }

    stageAllFiles = async () => {
        try {
            await this.execAsync('git add .');
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git stage all failed:', error);
        }
    }

    revertAllFiles = async () => {
        try {
            await this.execAsync('git restore --worktree .');
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git revert all failed:', error);
        }
    }

    pushChanges = async () => {
        try {
            await this.execAsync('git push');
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git push failed:', error);
        }
    }

    pullChanges = async () => {
        try {
            const pullStrategy = await this.getPullStrategy();
            await this.execAsync(`git pull ${pullStrategy}`);
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git pull failed:', error);
        }
    }

    resolveUsingOurs = async (filePath) => {
        try {
            await this.execAsync(`git checkout --ours "${filePath}" && git add "${filePath}"`);
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git resolve ours failed:', error);
        }
    }

    resolveUsingTheirs = async (filePath) => {
        try {
            await this.execAsync(`git checkout --theirs "${filePath}" && git add "${filePath}"`);
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git resolve theirs failed:', error);
        }
    }

    continueRebase = async () => {
        try {
            if (this.state.mergeConflicts.length > 0) {
                this.setState({ 
                    rebaseError: 'Please resolve all conflicts before continuing the rebase'
                });
                return;
            }

            if (this.state.stagedFiles.length > 0) {
                await this.execAsync('git commit --no-edit');
            }

            await this.execAsync('git rebase --continue');
            this.setState({ rebaseError: null });
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git rebase continue failed:', error);
            this.setState({ 
                rebaseError: 'Failed to continue rebase. Make sure all conflicts are resolved.'
            });
        }
    }

    syncChanges = async () => {
        try {
            await this.checkGitStatus();
        } catch (error) {
            console.error('Git sync failed:', error);
        }
    }

    // Add these helper methods
    canPull = () => {
        // Can't pull if we're rebasing
        if (this.state.isRebasing) return false;
        // Can't pull if we have uncommitted changes
        if (this.state.stagedFiles.length > 0 || this.state.modifiedFiles.length > 0) return false;
        // Can't pull if there's nothing to pull
        if (this.state.branchStatus.behind === 0) return false;
        return true;
    }

    canPush = () => {
        // Can't push if we're rebasing
        if (this.state.isRebasing) return false;
        // Can't push if we have uncommitted changes
        if (this.state.stagedFiles.length > 0 || this.state.modifiedFiles.length > 0) return false;
        // Can't push if we're behind (need to pull first)
        if (this.state.branchStatus.behind > 0) return false;
        // Can't push if there's nothing to push
        if (this.state.branchStatus.ahead === 0) return false;
        return true;
    }

    isCommitDisabled = () => {
        if (this.state.isRebasing) {
            // During rebase, can only commit if there are staged changes
            return this.state.stagedFiles.length === 0;
        }
        // Normal case - need both staged files and a commit message
        return this.state.stagedFiles.length === 0 || !this.state.commitMessage.trim();
    }

    processGitStatus = (status) => {
        const lines = status.split('\n').filter(line => line.trim());
        const stagedFiles = [];
        const modifiedFiles = [];
        const mergeConflicts = [];

        for (const line of lines) {
            const [status, path] = [line.slice(0, 2), line.slice(3)];
            const indexStatus = status[0];
            const workTreeStatus = status[1];

            if (indexStatus === 'U' || workTreeStatus === 'U' || status === 'AA' || status === 'DD') {
                mergeConflicts.push({ path, type: 'C' });
            } else {
                // Check staged changes (changes in index)
                if (indexStatus !== ' ' && indexStatus !== '?' && indexStatus !== 'U') {
                    stagedFiles.push({ 
                        path, 
                        type: indexStatus === 'A' ? 'A' : 
                              indexStatus === 'M' ? 'M' : 
                              indexStatus === 'D' ? 'D' : 
                              indexStatus === 'R' ? 'R' : 'M'
                    });
                }
                // Check unstaged changes (changes in work tree)
                if (workTreeStatus !== ' ' && workTreeStatus !== '?') {
                    modifiedFiles.push({ 
                        path, 
                        type: workTreeStatus === 'A' ? 'A' : 
                              workTreeStatus === 'M' ? 'M' : 
                              workTreeStatus === 'D' ? 'D' : 
                              workTreeStatus === 'R' ? 'R' : 'M'
                    });
                }
                // Handle untracked files
                if (indexStatus === '?' && workTreeStatus === '?') {
                    modifiedFiles.push({ path, type: 'U' });
                }
            }
        }

        return { stagedFiles, modifiedFiles, mergeConflicts };
    }

    render() {
        const canPull = this.canPull();
        const canPush = this.canPush();
        const isCommitDisabled = this.isCommitDisabled();
        const pullStrategy = this.getPullStrategy();

        return (
            <div className="git-status-viewer">
                <div className="git-header">
                    <div className="git-header-content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffa500" className="bi bi-git" viewBox="0 0 16 16">
                            <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.03 1.03 0 0 0 0-1.457"/>
                        </svg>
                        <span className="branch-name">{this.state.currentBranch}</span>

                        <div className="branch-status">
                            {!this.state.isRebasing && (
                                <>
                                    
                                    <button 
                                        className="btn btn-sm branch-controls behind btn-outline-secondary"
                                        onClick={this.pullChanges}
                                        disabled={!canPull}
                                        title={
                                            !canPull
                                                ? 'Commit or stash changes before pulling'
                                                : this.state.branchStatus.behind === 0
                                                    ? 'Nothing to pull'
                                                    : `Pull ${this.state.branchStatus.behind} commit(s) using ${
                                                        pullStrategy || 'merge'
                                                    }`
                                        }
                                    >
                                        ↓{this.state.branchStatus.behind}
                                    </button>
                                    <button 
                                        className="btn btn-sm branch-controls ahead btn-outline-secondary"
                                        onClick={this.pushChanges}
                                        disabled={!canPush}
                                        title={
                                            this.state.branchStatus.behind > 0
                                                ? 'Pull latest changes before pushing' 
                                            : this.state.branchStatus.ahead === 0
                                                ? 'No commits to push'
                                            : `Push ${this.state.branchStatus.ahead} commit(s)`
                                        }
                                    >
                                        ↑{this.state.branchStatus.ahead}
                                    </button>
                                    <button 
                                        className="btn btn-sm branch-controls btn-outline-secondary"
                                        onClick={this.syncChanges}
                                        title="Sync changes"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat sync-arrows" viewBox="0 0 16 16">
                                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                            <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="git-commit-section">
                    <div className="vertical-input-group">
                        {this.state.rebaseError && (
                            <div className="rebase-error-message">
                                {this.state.rebaseError}
                            </div>
                        )}
                        <div className="input-group input-group-sm" data-bs-theme="dark">
                            <input
                                type="text"
                                value={this.state.commitMessage}
                                onChange={this.handleCommitMessageChange}
                                placeholder={this.state.isRebasing ? "Resolve conflicts to continue rebase" : "Commit message"}
                                className="form-control"
                                disabled={this.state.isRebasing}
                            />
                        </div>
                        <div className="input-group input-group-sm" data-bs-theme="dark">
                            <button 
                                onClick={this.state.isRebasing ? this.continueRebase : this.commitChanges}
                                disabled={isCommitDisabled}
                                className={`btn btn-outline-secondary commit-button ${this.state.isRebasing && this.state.mergeConflicts.length > 0 ? 'has-conflicts' : ''}`}
                                title={this.state.isRebasing && this.state.mergeConflicts.length > 0 
                                    ? "Resolve all conflicts before continuing rebase" 
                                    : this.state.isRebasing 
                                        ? "Continue rebase" 
                                        : "Commit staged changes"
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                </svg> {this.state.isRebasing ? 'Continue Rebase' : 'Commit'}
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.stagedFiles.length > 0 && (
                    <div className="git-section">
                        <div className="git-section-header">
                            <span>Staged Changes</span>
                            <div className="header-actions">
                                <button 
                                    title="Unstage all changes" 
                                    onClick={this.unstageAllFiles}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-minus" viewBox="0 0 16 16">
                                        <path d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/>
                                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {this.state.stagedFiles.map(file => (
                            <div key={file.path} className="git-file staged" title={`${file.type === 'A' ? 'Added' : file.type === 'M' ? 'Modified' : file.type === 'D' ? 'Deleted' : file.type === 'R' ? 'Renamed' : 'Untracked'} ${this.getDisplayName(file.path)}`}>
                                <span>
                                    <span className={`git-status-letter git-status-${file.type}`}>{file.type}</span>
                                    {this.getIconForFile(file.path) && (
                                        <img 
                                            src={this.getIconForFile(file.path)} 
                                            alt="" 
                                            className="file-icon"
                                        />
                                    )}
                                    {this.getDisplayName(file.path)}
                                </span>
                                <div className="git-file-actions">
                                    <button title={`Unstage ${this.getDisplayName(file.path)}`} onClick={() => this.unstageFile(file.path)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-minus" viewBox="0 0 16 16">
                                            <path d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/>
                                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {this.state.modifiedFiles.length > 0 && (
                    <div className="git-section">
                        <div className="git-section-header">
                            <span>Changes</span>
                            <div className="header-actions">
                                
                                <button title="Revert all changes" onClick={this.revertAllFiles} className="revert-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                    </svg>
                                </button>
                                <button title="Stage all changes" onClick={this.stageAllFiles}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-plus" viewBox="0 0 16 16">
                                        <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5z"/>
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {this.state.modifiedFiles.map(file => (
                            <div key={file.path} className="git-file modified" title={`${file.type === 'A' ? 'Added' : file.type === 'M' ? 'Modified' : file.type === 'D' ? 'Deleted' : file.type === 'R' ? 'Renamed' : 'Untracked'} ${this.getDisplayName(file.path)}`}>
                                <span>
                                    <span className={`git-status-letter git-status-${file.type}`}>{file.type}</span>
                                    {this.getIconForFile(file.path) && (
                                        <img 
                                            src={this.getIconForFile(file.path)} 
                                            alt="" 
                                            className="file-icon"
                                        />
                                    )}
                                    {this.getDisplayName(file.path)}
                                </span>
                                <div className="git-file-actions">
                                    
                                    <button 
                                        title={`Revert ${this.getDisplayName(file.path)}`}
                                        onClick={() => this.revertFile(file.path)}
                                        className="revert-button"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                        </svg>
                                    </button>
                                    <button title={`Stage ${this.getDisplayName(file.path)}`} onClick={() => this.stageFile(file.path)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-plus" viewBox="0 0 16 16">
                                            <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5z"/>
                                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {this.state.mergeConflicts.length > 0 && (
                    <div className="git-section">
                        <div className="git-section-header">
                            <span>Merge Conflicts</span>
                        </div>
                        {this.state.mergeConflicts.map(file => (
                            <div key={file.path} className="git-file conflict">
                                <span>
                                    <span className="git-status-letter git-status-C">C</span>
                                    {this.getIconForFile(file.path) && (
                                        <img 
                                            src={this.getIconForFile(file.path)} 
                                            alt="" 
                                            className="file-icon"
                                        />
                                    )}
                                    {this.getDisplayName(file.path)}
                                </span>
                                <div className="git-file-actions">
                                    <button 
                                        title="Use our changes" 
                                        onClick={() => this.resolveUsingOurs(file.path)}
                                        className="resolve-ours"
                                    >
                                        Keep Ours
                                    </button>
                                    <button 
                                        title="Use their changes" 
                                        onClick={() => this.resolveUsingTheirs(file.path)}
                                        className="resolve-theirs"
                                    >
                                        Keep Theirs
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* {this.state.isLoading && <div className="git-loading">Loading...</div>} */}
                {this.state.error && <div className="git-error">{this.state.error}</div>}
            </div>
        );
    }
}