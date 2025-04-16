import * as Sentry from "@sentry/electron/renderer";
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.css';
import { ipcRenderer } from 'electron';

Sentry.init({ dsn: "https://ea447f3e89982daf599068c5b6bf933c@o4508842181459968.ingest.us.sentry.io/4508859562328064" });

// Store the root in a global variable that persists across HMR updates
// Using window ensures it persists between module evaluations
if (!window.__REACT_ROOT__) {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        console.log('Creating new React root');
        window.__REACT_ROOT__ = createRoot(rootElement);
    } else {
        console.error('Root element not found');
    }
}

// Use the persisted root
const root = window.__REACT_ROOT__;

const render = () => {
    console.log('Rendering with root:', root);
    
    if (root) {
        root.render(
            <React.StrictMode>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </React.StrictMode>
        );
    } else {
        console.error('Cannot render: Root is null');
    }
};

render();

// Accept HMR for CSS and components
if (module.hot) {
    // Accept CSS updates without refreshing the page
    module.hot.accept('bootstrap/dist/css/bootstrap.css', () => {
        console.log('CSS updated without refresh');
    });
    
    // Accept App component updates and re-render without creating a new root
    module.hot.accept('./App', () => {
        console.log('App component updated, re-rendering');
        console.log('Current root:', root);
        render();
    });
    
    // Accept other updates with page refresh
    module.hot.accept();
}