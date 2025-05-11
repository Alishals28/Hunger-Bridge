import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure this is for Vite
import App from './App'; // Your main App component
import './index.css'; // Your CSS file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
