import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Quiz from './pages/Quiz.jsx'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}
