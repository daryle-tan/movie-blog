import { useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import BlogPage from "./pages/BlogPage"
import Logout from "./pages/Logout"
import Blog from "./components/Blog"
import GoogleCallbackHandler from "./components/GoogleCallbackHandler"

function App() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [userToken, setUserToken] = useState(localStorage.getItem("authToken"))
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken"),
  )
  const [responseMsg, setResponseMsg] = useState("")

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token)
    setUserToken(token)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setUserToken(null)
    setIsLoggedIn(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/blog" />
            ) : (
              <Login
                handleInputChange={handleInputChange}
                formData={formData}
                handleLogin={handleLogin}
                userToken={userToken}
                responseMsg={responseMsg}
                setResponseMsg={setResponseMsg}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              handleInputChange={handleInputChange}
              formData={formData}
              handleLogin={handleLogin}
              userToken={userToken}
              responseMsg={responseMsg}
              setResponseMsg={setResponseMsg}
            />
          }
        />
        <Route
          path="/blog"
          element={
            isLoggedIn ? (
              <BlogPage
                userToken={userToken}
                logout={handleLogout}
                isLoggedIn={isLoggedIn}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/create-blog"
          element={
            isLoggedIn ? (
              <Blog
                userToken={userToken}
                logout={handleLogout}
                isLoggedIn={isLoggedIn}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/blog/edit/:id"
          element={
            isLoggedIn ? (
              <Blog
                userToken={userToken}
                logout={handleLogout}
                isLoggedIn={isLoggedIn}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/callback"
          element={
            <GoogleCallbackHandler
              handleLogin={handleLogin}
              setResponseMsg={setResponseMsg}
            />
          }
        />
        <Route
          path="/logout"
          element={<Logout handleLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  )
}

export default App
