import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import Chatbot from "./components/pages/Chatbot";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  )
}

export default App
