import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { PeriodProvider } from './context/PeriodContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PeriodProvider>
          <App />
        </PeriodProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
