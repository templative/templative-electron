import * as Sentry from "@sentry/electron/renderer";
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.css';
import { ipcRenderer } from 'electron';

ipcRenderer.invoke('get-app-is-packaged').then(isPackaged => {
    if (!isPackaged) {
        return
    }
    Sentry.init({ dsn: "https://ea447f3e89982daf599068c5b6bf933c@o4508842181459968.ingest.us.sentry.io/4508859562328064" });
});

let root = null;

const render = () => {
    if (!root) {
        root = createRoot(document.getElementById('root'));
    }
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>
    );
};

render();

// Accept HMR for CSS
if (module.hot) {
    // Accept CSS updates without refreshing the page
    module.hot.accept('bootstrap/dist/css/bootstrap.css', () => {
        console.log('CSS updated without refresh');
    });
    
    // Accept other updates with page refresh
    module.hot.accept();
}