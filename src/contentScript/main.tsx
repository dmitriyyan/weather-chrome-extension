import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const root = document.createElement("div");
root.id = 'weather-content-script-root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
