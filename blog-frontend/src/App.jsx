import { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import NavbarComponent from "./components/Navbar"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import BlogPage from "./pages/BlogPage"
import Logout from "./pages/Logout"
import Blog from "./components/Blog"
import GoogleCallbackHandler from "./components/GoogleCallbackHandler"
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [userToken, setUserToken] = useState(localStorage.getItem("authToken"))
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken"),
  )
  const [responseMsg, setResponseMsg] = useState("")
  const [theme, setTheme] = useState("light")

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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  useEffect(() => {
    console.log("isLoggedIn changed:", isLoggedIn)
  }, [isLoggedIn])

  return (
    <div data-bs-theme={theme}>
      <Router>
        <NavbarComponent
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          toggleTheme={toggleTheme}
          theme={theme}
        />
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
    </div>
  )
}

export default App
