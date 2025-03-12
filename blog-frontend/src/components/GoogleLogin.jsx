import React from "react"

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    // Redirect to Django's allauth Google login URL
    window.location.href = "http://127.0.0.1/accounts/google/login/"
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="google-login-btn"
      style={{
        padding: "10px 20px",
        backgroundColor: "#ffffff",
        color: "#757575",
        border: "1px solid #ddd",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontWeight: "bold",
        margin: "10px 0",
      }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        style={{ height: "18px", marginRight: "10px" }}
      />
      Sign in with Google
    </button>
  )
}

export default GoogleLogin
