import Form from "../components/Form"
import { useState } from "react"
// import { login } from "../api/authApi"
import { Navigate } from "react-router-dom"

export default function Login({ handleInputChange, formData, handleToken }) {
  const [responseMsg, setResponseMsg] = useState("")
  const [shouldRedirect, setShouldRedirect] = useState(false)

  //   const handleSubmit = async (e) => {
  //     e.preventDefault()
  //     // const context = { username: formData.username, password: formData.password }
  //     const token = await login(context)
  //     if (!token) {
  //       setResponseMsg("Error logging in")
  //     } else {
  //       handleToken(token)
  //       setShouldRedirect(true)
  //     }
  //   }

  if (shouldRedirect) {
    return <Navigate to="/blog" />
  } else {
    return (
      <Form
        formType={"Login"}
        handleInputChange={handleInputChange}
        formData={formData}
        handleToken={handleToken}
        // handleSubmit={handleSubmit}
        responseMsg={responseMsg}
      />
    )
  }
}
