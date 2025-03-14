import React from "react"
import { useNavigate } from "react-router-dom"
import { Container, Button, Card } from "react-bootstrap"

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
    <Container className="mt-5">
      <Card
        className="text-center"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <Card.Body>
          <Card.Title as="h4" className="mb-4">
            Logout Confirmation
          </Card.Title>
          <Card.Text>Are you sure you want to logout?</Card.Text>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="primary" onClick={handleYesClick}>
              Yes
            </Button>
            <Button variant="outline-secondary" onClick={handleNoClick}>
              No
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}
