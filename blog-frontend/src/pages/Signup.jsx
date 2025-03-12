import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import Form from "../components/Form"

export default function Signup({ handleInputChange, formData, handleLogin }) {
  const [responseMsg, setResponseMsg] = useState("")
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    fetch("/api/user/get-csrf-token/", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCsrfToken(data.csrfToken)
        console.log("CSRF Token fetched:", data.csrfToken) // Debug
      })
      .catch((error) => console.error("CSRF fetch error:", error))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!csrfToken) {
      setResponseMsg("CSRF token not available. Please try again.")
      return
    }
    try {
      const response = await fetch("/api/user/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Send CSRF token
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include", // Keep this for session cookies
      })
      const data = await response.json()
      if (response.ok) {
        handleLogin(data.token)
        setResponseMsg("Registration successful!")
        setTimeout(() => setShouldRedirect(true), 1000)
      } else {
        setResponseMsg("Error registering: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      setResponseMsg("Network error: " + error.message)
    }
  }

  if (shouldRedirect) {
    return <Navigate to="/blog" />
  }

  return (
    <Form
      formType="Signup"
      handleInputChange={handleInputChange}
      formData={formData}
      handleSubmit={handleSubmit}
      responseMsg={responseMsg}
    />
  )
}
