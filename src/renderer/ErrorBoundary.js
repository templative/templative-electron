import React from 'react';
import axios from 'axios';

class ErrorBoundary extends React.Component {
    state = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    async logError(error, errorInfo) {
        try {
            await axios.post('https://api.templative.net/logging', {
                error: {
                    type: error.name,
                    message: error.message,
                    stacktrace: error.stack
                },
                route: 'react_error_boundary',
                additionalContext: {
                    application_layer: 'react',
                    componentStack: errorInfo?.componentStack,
                    reactVersion: React.version
                }
            });
        } catch (err) {
            console.error('Failed to log error:', err);
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        this.logError(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-fallback">
                    <h2>Something went wrong</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error?.toString()}
                        <br />
                        {this.state.errorInfo?.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;