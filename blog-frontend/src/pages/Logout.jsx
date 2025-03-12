import React from "react"
import { useNavigate, Navigate } from "react-router-dom"

export default function Logout({ handleLogout }) {
  const navigate = useNavigate()

  const handleNoClick = () => {
    navigate(-1)
  }

  const handleYesClick = () => {
    handleLogout()
    navigate("/")
  }

  return (
    <>
      <div>Are you sure you want to logout?</div>
      <button type="button" onClick={handleYesClick}>
        Yes
      </button>{" "}
      <button type="button" onClick={handleNoClick}>
        No
      </button>
    </>
  )
}
