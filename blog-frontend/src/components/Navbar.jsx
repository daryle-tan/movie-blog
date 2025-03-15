import { Link } from "react-router-dom"
import { Container, Nav, Navbar, Button } from "react-bootstrap"
import { Sun, Moon } from "react-bootstrap-icons"

function NavbarComponent({ isLoggedIn, toggleTheme, theme }) {
  const navbarStyle = {
    backgroundColor: "rgb(11, 21, 43)",
  }

  const textStyle = {
    color: "rgb(223, 197, 156)",
  }

  return (
    <Navbar expand="lg" style={navbarStyle} sticky="top">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={textStyle} />
        <Navbar.Collapse id="basic-navbar-nav">
          {isLoggedIn && (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/blog" style={textStyle}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/create-blog" style={textStyle}>
                  Create Blog
                </Nav.Link>
              </Nav>
              <div className="d-flex justify-content-center align-items-center mx-auto">
                <img
                  src="/movie.webp"
                  alt="Movie Blog Logo"
                  style={{ height: "100px", width: "auto" }}
                />
              </div>
              <Nav className="ms-auto">
                <Button
                  variant="outline-secondary"
                  onClick={toggleTheme}
                  className="ms-1 my-2"
                  aria-label="Toggle theme"
                  style={{
                    color: "rgb(223, 197, 156)",
                    borderColor: "rgb(223, 197, 156)",
                  }}
                >
                  {theme === "light" ? <Sun /> : <Moon />}
                </Button>
                <Button
                  variant="outline-primary"
                  as={Link}
                  to="/logout"
                  className="ms-2 my-2"
                  style={{
                    color: "rgb(223, 197, 156)",
                    borderColor: "rgb(223, 197, 156)",
                  }}
                >
                  Logout
                </Button>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarComponent
