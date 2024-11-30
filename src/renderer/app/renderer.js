import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';

let root = null;

const render = () => {
    console.log("rendering")
    if (!root) {
        root = createRoot(document.getElementById('root'));
    }
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
};

render();