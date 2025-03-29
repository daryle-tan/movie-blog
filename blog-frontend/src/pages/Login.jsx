import { useState, useEffect } from "react"
import { Link, Navigate } from "react-router-dom"
import {
  Container,
  Form as BootstrapForm,
  Button,
  Alert,
  Row,
  Col,
} from "react-bootstrap"
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
  const [csrfToken, setCsrfToken] = useState("")

  // Fetch CSRF token on mount
  useEffect(() => {
    fetch("/api/user/get-csrf-token/", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCsrfToken(data.csrfToken)
        console.log("CSRF Token fetched:", data.csrfToken)
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
      const response = await fetch("/api/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
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

  if (shouldRedirect) {
    return <Navigate to="/blog" />
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={8} lg={6}>
          <h2 className="text-center mb-4">Login</h2>
          <Form
            formType="Login"
            handleInputChange={handleInputChange}
            formData={formData}
            handleSubmit={handleSubmit}
            responseMsg={responseMsg}
          />
          <div className="text-center my-3">-------- or --------</div>
          <div className="d-grid gap-2">
            <GoogleLogin />
          </div>
          <div className="text-center mt-3">
            Need to Sign-up? Register <Link to="/signup">Here</Link>
          </div>
          {responseMsg && (
            <Alert
              variant={
                responseMsg.includes("successful") ? "success" : "danger"
              }
              className="mt-3"
            >
              {responseMsg}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  )
}
