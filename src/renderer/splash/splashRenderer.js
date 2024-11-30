import { createRoot } from 'react-dom/client';
import React from 'react';
import SplashApp from './SplashApp';
import './splash.css';

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