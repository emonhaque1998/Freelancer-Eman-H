
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Entry point for the Eman Haque Professional Developer Platform & CMS.
 * This file mounts the main App component into the #root element defined in index.html.
 */
const container = document.getElementById('root');

if (!container) {
  throw new Error("Root container not found. Check index.html for <div id='root'></div>");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
