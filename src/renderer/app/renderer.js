import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

// Add global error handler for uncaught promises
window.addEventListener('unhandledrejection', async (event) => {
    try {
        await axios.post('https://api.templative.net/logging', {
            error: {
                type: 'UnhandledPromiseRejection',
                message: event.reason?.message || 'Unknown promise rejection',
                stacktrace: event.reason?.stack
            },
            route: 'unhandled_promise_rejection',
            additionalContext: {
                application_layer: 'react',
                reactVersion: React.version
            }
        });
    } catch (err) {
        console.error('Failed to log error:', err);
    }
});

// Add global error handler for uncaught errors
window.addEventListener('error', async (event) => {
    try {
        await axios.post('https://api.templative.net/logging', {
            error: {
                type: event.error?.name || 'WindowError',
                message: event.error?.message || event.message,
                stacktrace: event.error?.stack,
            },
            route: 'window_error',
            additionalContext: {
                application_layer: 'react',
                reactVersion: React.version,
                errorLocation: {
                    filename: event.filename,
                    lineNo: event.lineno,
                    colNo: event.colno
                }
            }
        });
    } catch (err) {
        console.error('Failed to log error:', err);
    }
});

// Add interceptor for API calls
axios.interceptors.response.use(
    response => response,
    async error => {
        if (!error.response) {
            // Network error or server down
            try {
                await axios.post('https://api.templative.net/logging', {
                    error: {
                        type: 'NetworkError',
                        message: error.message,
                        stacktrace: error.stack
                    },
                    route: 'api_connection_error',
                    additionalContext: {
                        application_layer: 'react',
                        request: {
                            url: error.config?.url,
                            method: error.config?.method
                        }
                    }
                });
            } catch (err) {
                console.error('Failed to log error:', err);
            }
        }
        return Promise.reject(error);
    }
);

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