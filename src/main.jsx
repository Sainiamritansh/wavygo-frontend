import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '10px',
            background: '#1A4D2E',
            color: '#fff',
            padding: '12px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
          success: {
            iconTheme: {
              primary: '#4CAF7D',
              secondary: '#fff',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
