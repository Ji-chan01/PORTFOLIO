import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Tell the splash (see index.html) that the first React frame has painted
requestAnimationFrame(() => requestAnimationFrame(() => {
  window.__appReady = true;
  window.dispatchEvent(new Event('app-ready'));
}));
