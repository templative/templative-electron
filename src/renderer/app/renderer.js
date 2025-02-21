import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

import * as Sentry from "@sentry/electron";

Sentry.init({
  dsn: "https://ea447f3e89982daf599068c5b6bf933c@o4508842181459968.ingest.us.sentry.io/4508859562328064",
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