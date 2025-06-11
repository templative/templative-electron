import React from 'react';
import * as Sentry from "@sentry/electron/renderer";
const templativeApiClient = require('../shared/TemplativeApiClient');

class ErrorBoundary extends React.Component {
    state = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    async logError(error, errorInfo) {
        try {
            // Report error to Sentry
            Sentry.withScope((scope) => {
                scope.setTag('errorBoundary', true);
                scope.setContext('errorInfo', errorInfo);
                Sentry.captureException(error);
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
        // Log the error to Sentry
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