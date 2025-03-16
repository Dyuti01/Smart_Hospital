import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from './ui/patientProfile/toaster.tsx'
import { AuthProvider } from './utils/AuthContext.tsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <App />
    <Toaster/>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
