import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Test from './Test'
import Show from './pages/Show'
import Seller from './pages/Seller'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/show/:id" element={<Show />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
