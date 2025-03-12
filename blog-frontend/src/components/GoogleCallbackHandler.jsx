import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function GoogleCallbackHandler({ handleLogin, setResponseMsg }) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")
    const username = params.get("username")
    const email = params.get("email")

    if (token) {
      handleLogin(token) // Store token and update login state
      setResponseMsg(`Welcome, ${username || "user"}! Login successful.`)
      console.log("Token received from URL:", token)
      navigate("/blog") // Use React Router for SPA navigation
    } else {
      console.error("No token found in URL parameters")
      setResponseMsg("Google login failed: No token received.")
      navigate("/") // Redirect to login on failure
    }
  }, [location, handleLogin, setResponseMsg, navigate])

  return <div>Loading...</div>
}
