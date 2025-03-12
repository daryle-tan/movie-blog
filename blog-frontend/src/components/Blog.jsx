import React, { useState, useEffect } from "react"
import { Navigate, useParams, useNavigate } from "react-router-dom" // Added useNavigate

const Blog = ({ userToken, isLoggedIn, logout }) => {
  // Added logout prop
  const [formData, setFormData] = useState({
    post_title: "",
    post_content: "",
    movie_genre: "",
  })
  const [message, setMessage] = useState("")
  const [currentBlog, setCurrentBlog] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate() // Added for redirect

  useEffect(() => {
    if (id && isLoggedIn) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`http://127.0.0.1/api/posts/${id}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${userToken}`, // Changed to Token
            },
          })

          if (!response.ok) {
            if (response.status === 401) {
              logout()
              navigate("/")
              throw new Error("Unauthorized. Please log in again.")
            }
            throw new Error("Failed to fetch post")
          }

          const data = await response.json()
          setCurrentBlog(data)
          setFormData({
            post_title: data.post_title,
            post_content: data.post_content,
            movie_genre: data.movie_genre,
          })
          setIsEditing(true)
        } catch (err) {
          setMessage("Error: " + err.message)
        }
      }
      fetchPost()
    }
  }, [id, userToken, isLoggedIn, logout, navigate])

  const handleBlogCreate = async () => {
    if (!isLoggedIn || !userToken) {
      setMessage("Please log in to create a blog post")
      navigate("/")
      return
    }

    try {
      const url = isEditing
        ? `http://127.0.0.1/api/posts/${currentBlog?.id}/`
        : "http://127.0.0.1/api/posts/"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${userToken}`, // Changed to Token
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          logout()
          navigate("/")
          throw new Error("Unauthorized. Please log in again.")
        }
        throw new Error(
          `Failed to ${isEditing ? "update" : "create"} blog post`,
        )
      }

      const data = await response.json()
      setCurrentBlog(data)
      setMessage(
        isEditing ? "Blog updated successfully!" : "Blog created successfully!",
      )
      if (!isEditing) {
        setFormData({ post_title: "", post_content: "", movie_genre: "" })
        navigate("/blog") // Redirect to blog list after creation
      }
      setIsEditing(false)
    } catch (err) {
      setMessage("Error: " + err.message)
    }
  }

  const handleBlogDelete = async () => {
    if (!currentBlog || !isLoggedIn) return

    try {
      const response = await fetch(
        `http://127.0.0.1/api/posts/${currentBlog.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${userToken}`, // Changed to Token
          },
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          logout()
          navigate("/")
          throw new Error("Unauthorized. Please log in again.")
        }
        throw new Error("Failed to delete blog post")
      }

      setCurrentBlog(null)
      setMessage("Blog deleted successfully!")
      navigate("/blog") // Redirect after deletion
    } catch (err) {
      setMessage("Error: " + err.message)
    } finally {
      setShowDeleteModal(false)
    }
  }

  const handleBlogEdit = () => {
    if (!currentBlog || !isLoggedIn) return
    setFormData({
      post_title: currentBlog.post_title,
      post_content: currentBlog.post_content,
      movie_genre: currentBlog.movie_genre,
    })
    setIsEditing(true)
    setMessage("")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const confirmDelete = () => {
    setShowDeleteModal(true)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />
  }

  return (
    <div className="blog-container">
      <h2>{isEditing ? "Edit Blog" : "Create Blog"}</h2>
      <div className="blog-display">
        {currentBlog ? (
          <>
            <h3>{currentBlog.post_title}</h3>
            <p>{currentBlog.post_content}</p>
            <p>
              <strong>Genre:</strong> {currentBlog.movie_genre}
            </p>
          </>
        ) : (
          "No blog created yet."
        )}
      </div>

      <input
        type="text"
        name="post_title"
        value={formData.post_title}
        onChange={handleInputChange}
        placeholder="Blog Title"
      />
      <textarea
        name="post_content"
        value={formData.post_content}
        onChange={handleInputChange}
        placeholder="Blog Content"
      />
      <input
        type="text"
        name="movie_genre"
        value={formData.movie_genre}
        onChange={handleInputChange}
        placeholder="Genre"
      />

      <button
        type="button"
        className="create-blog-btn"
        onClick={handleBlogCreate}
      >
        {isEditing ? "Update Blog" : "Create Blog"}
      </button>
      {isEditing && (
        <>
          <button
            type="button"
            className="edit-blog-btn"
            onClick={handleBlogEdit}
            disabled={!currentBlog}
          >
            Edit Blog
          </button>
          <button
            type="button"
            className="delete-blog-btn"
            onClick={confirmDelete}
            disabled={!currentBlog}
          >
            Delete Blog
          </button>
        </>
      )}

      {message && <p>{message}</p>}

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              color: "black",
              padding: "20px",
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <h3>Are you sure?</h3>
            <p>
              Do you really want to delete {currentBlog?.post_title}? This
              action cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleBlogDelete}
              style={{ marginRight: "10px", padding: "5px 10px" }}
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={cancelDelete}
              style={{ padding: "5px 10px" }}
            >
              No, Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
