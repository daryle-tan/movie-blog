import { Link } from "react-router-dom"

function Navbar({ isLoggedIn, handleLogout }) {
  return (
    <nav>
      {isLoggedIn ? (
        <>
          <Link to="/blog">Home</Link>
          <Link to="/create-blog">Blog</Link>
          <Link to="/logout">Logout</Link>
        </>
      ) : null}
    </nav>
  )
}

export default Navbar
