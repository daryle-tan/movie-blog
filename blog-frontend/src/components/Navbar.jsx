import { Link } from "react-router-dom"
import { Container, Nav, Navbar, Button } from "react-bootstrap"

function NavbarComponent({ isLoggedIn }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Movie Blog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isLoggedIn && (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/blog">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/create-blog">
                  Create Blog
                </Nav.Link>
                <Nav.Link as={Link} to="/logout">
                  Logout
                </Nav.Link>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarComponent
