import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './store'
import { initializeApi } from './services/api'
import './index.css'
import App from './App.jsx'

// Initialize API with Redux store
initializeApi(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
