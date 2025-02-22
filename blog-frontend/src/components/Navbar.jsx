import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <>
      <ul className="navbar">
        <li>
          <Link to="/blog">Blogs</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </>
  )
}
export default Navbar
