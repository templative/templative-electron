import React from 'react';
import './splash.css';
import undulatingEye from './undulatingEye.gif';

const { ipcRenderer } = require('electron');

class SplashApp extends React.Component {
    state = {
        progress: 0,
        status: 'Initializing...'
    }

    componentDidMount() {
        ipcRenderer.on('update-progress', (event, data) => {
            this.setState({
                progress: data.percent,
                status: data.message
            });
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('update-progress');
    }

    render() {
        return (
            <div className="container">
                <img id="loading-gif" width="100" height="100" src={undulatingEye} alt="Loading" />
                <h2>Templative</h2>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${this.state.progress}%` }}></div>
                </div>
                <div className="status">{this.state.status}</div>
            </div>
        );
    }
}

export default SplashApp; 