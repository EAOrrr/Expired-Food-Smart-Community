import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './services/axios.js'

import { BrowserRouter as Router } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
      <App />
      </Router>
    </Provider>
  </React.StrictMode>,
)