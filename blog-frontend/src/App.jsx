import "./App.css"
import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import BlogPage from "./pages/BlogPage"
import Logout from "./pages/Logout"

function App() {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [userToken, setUserToken] = useState(null)

  const handleToken = (token) => {
    setFormData({ username: "", password: "" })
    setUserToken(token)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/blog" element={<BlogPage userToken={userToken} />} />
        <Route
          path="/signup"
          element={
            <Signup handleInputChange={handleInputChange} formData={formData} />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              handleInputChange={handleInputChange}
              formData={formData}
              handleToken={handleToken}
            />
          }
        />
        <Route
          path="/logout"
          element={<Logout userToken={userToken} setUserToken={setUserToken} />}
        />
      </Routes>
    </Router>
  )
}

export default App
