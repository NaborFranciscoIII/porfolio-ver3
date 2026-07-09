import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import '@/styles/index.css'
import { AppProvider } from '@/context/PortfolioContext' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Wrap the App with the Provider */}
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)