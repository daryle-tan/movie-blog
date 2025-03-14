import React, { useState, useEffect } from "react"
import { Navigate, useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Form as BootstrapForm,
  Button,
  Alert,
  Card,
  Modal,
  Row,
  Col,
} from "react-bootstrap"

const Blog = ({ userToken, isLoggedIn, logout }) => {
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
  const navigate = useNavigate()

  useEffect(() => {
    if (id && isLoggedIn) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`http://127.0.0.1/api/posts/${id}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${userToken}`,
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
          Authorization: `Token ${userToken}`,
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
        navigate("/blog")
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
            Authorization: `Token ${userToken}`,
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
      navigate("/blog")
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
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">
            {isEditing ? "Edit Blog" : "Create Blog"}
          </h2>

          {currentBlog && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{currentBlog.post_title}</Card.Title>
                <Card.Text>{currentBlog.post_content}</Card.Text>
                <Card.Text>
                  <strong>Genre:</strong> {currentBlog.movie_genre}
                </Card.Text>
              </Card.Body>
            </Card>
          )}

          <BootstrapForm>
            <BootstrapForm.Group className="mb-3" controlId="postTitle">
              <BootstrapForm.Label>Blog Title</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                name="post_title"
                value={formData.post_title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
              />
            </BootstrapForm.Group>

            <BootstrapForm.Group className="mb-3" controlId="postContent">
              <BootstrapForm.Label>Blog Content</BootstrapForm.Label>
              <BootstrapForm.Control
                as="textarea"
                rows={5}
                name="post_content"
                value={formData.post_content}
                onChange={handleInputChange}
                placeholder="Write your blog content here"
              />
            </BootstrapForm.Group>

            <BootstrapForm.Group className="mb-3" controlId="movieGenre">
              <BootstrapForm.Label>Genre</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                name="movie_genre"
                value={formData.movie_genre}
                onChange={handleInputChange}
                placeholder="Enter movie genre"
              />
            </BootstrapForm.Group>

            <div className="d-flex gap-2 justify-content-center">
              <Button variant="primary" onClick={handleBlogCreate}>
                {isEditing ? "Update Blog" : "Create Blog"}
              </Button>
              {isEditing && (
                <>
                  <Button
                    variant="outline-secondary"
                    onClick={handleBlogEdit}
                    disabled={!currentBlog}
                  >
                    Edit Blog
                  </Button>
                  <Button
                    variant="danger"
                    onClick={confirmDelete}
                    disabled={!currentBlog}
                  >
                    Delete Blog
                  </Button>
                </>
              )}
            </div>
          </BootstrapForm>

          {message && (
            <Alert
              variant={message.includes("successfully") ? "success" : "danger"}
              className="mt-3"
            >
              {message}
            </Alert>
          )}

          <Modal show={showDeleteModal} onHide={cancelDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete{" "}
                <strong>{currentBlog?.post_title}</strong>? This action cannot
                be undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelDelete}>
                No, Cancel
              </Button>
              <Button variant="danger" onClick={handleBlogDelete}>
                Yes, Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  )
}

export default Blog
