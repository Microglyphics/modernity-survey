// src/main.jsx
import React from 'react';
// Import the correct ReactDOM module
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Make sure we have the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Create root and render
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);