import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UseCustomContext from './useCustomContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <UseCustomContext>
    <React.StrictMode>
      <App />
    </React.StrictMode>
   </UseCustomContext>
)
