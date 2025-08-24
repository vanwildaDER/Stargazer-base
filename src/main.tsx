import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Security } from '@okta/okta-react'
import App from './App.tsx'
import { oktaAuth } from './config/oktaConfig'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Security 
        oktaAuth={oktaAuth}
        restoreOriginalUri={async (_oktaAuth, originalUri) => {
          window.location.replace(originalUri || '/');
        }}
      >
        <App />
      </Security>
    </BrowserRouter>
  </React.StrictMode>,
)