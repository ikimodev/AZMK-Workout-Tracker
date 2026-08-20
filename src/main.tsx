import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { trackUserSession } from './services/analyticsService'

// Immediate Telemetry Sync on Page Entry
try {
  trackUserSession();
} catch (e) {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
