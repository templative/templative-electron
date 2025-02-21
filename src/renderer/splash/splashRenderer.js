import { createRoot } from 'react-dom/client';
import React from 'react';
import SplashApp from './SplashApp';
import './splash.css';

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
            <SplashApp />
        </React.StrictMode>
    );
};

render(); 