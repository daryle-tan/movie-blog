import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import Form from "../components/Form"
import GoogleLogin from "../components/GoogleLogin"

export default function Login({
  handleInputChange,
  formData,
  handleLogin,
  userToken,
}) {
  const [responseMsg, setResponseMsg] = useState("")
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        handleLogin(data.token)
        setResponseMsg("Login successful!")
        setTimeout(() => setShouldRedirect(true), 1000)
      } else {
        setResponseMsg(
          "Error logging in: " + (data.error || "Invalid credentials"),
        )
      }
    } catch (error) {
      setResponseMsg("Network error: " + error.message)
    }
  }

  const handleGoogleLogin = () => {
    console.log("Navigating to /accounts/google/login/")
    window.location.href = "/accounts/google/login/"
  }

  if (shouldRedirect) {
    return <Navigate to="/blog" />
  }

  return (
    <>
      <Form
        formType="Login"
        handleInputChange={handleInputChange}
        formData={formData}
        handleSubmit={handleSubmit}
        responseMsg={responseMsg}
      />
      <div>-------- or --------</div>
      <GoogleLogin />
      <div>
        Need to Sign-up? Register <Link to="/signup">Here</Link>
      </div>
      {responseMsg && <p>{responseMsg}</p>}
    </>
  )
}
