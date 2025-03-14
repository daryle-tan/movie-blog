import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  ListGroup,
} from "react-bootstrap"
import Navbar from "../components/Navbar"

export default function BlogPage({ userToken, logout, isLoggedIn }) {
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([]) // Unused for now
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userToken) {
        setError("No authentication token available. Please log in again.")
        logout()
        navigate("/")
        return
      }

      try {
        const postsResponse = await fetch("http://127.0.0.1/api/posts/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${userToken}`,
          },
        })

        if (!postsResponse.ok) {
          if (postsResponse.status === 401) {
            logout()
            navigate("/")
            throw new Error(
              "Session expired or invalid token. Please log in again.",
            )
          }
          throw new Error(`Failed to fetch posts: ${postsResponse.statusText}`)
        }

        const postsData = await postsResponse.json()

        const postsWithPosters = await Promise.all(
          postsData.map(async (post) => {
            try {
              const movieTitle = encodeURIComponent(post.post_title)
              const omdbResponse = await fetch(
                `https://www.omdbapi.com/?t=${movieTitle}&apikey=${omdbApiKey}`,
              )
              const omdbData = await omdbResponse.json()
              if (omdbData.Response === "True") {
                return { ...post, poster: omdbData.Poster }
              } else {
                return { ...post, poster: null }
              }
            } catch (err) {
              console.error(
                `Failed to fetch poster for ${post.post_title}:`,
                err,
              )
              return { ...post, poster: null }
            }
          }),
        )

        setPosts(postsWithPosters)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [userToken, logout, navigate, omdbApiKey])

  const handlePostClick = (postId) => {
    navigate(`/blog/edit/${postId}`)
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading posts...</p>
      </Container>
    )
  }

  if (!isLoggedIn) {
    navigate("/")
    return null
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Blog Posts</h1>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          {posts.length === 0 ? (
            <p className="text-center">No posts available.</p>
          ) : (
            <ListGroup as="ul">
              {posts.map((post) => (
                <ListGroup.Item
                  as="li"
                  key={post.id}
                  action
                  onClick={() => handlePostClick(post.id)}
                  className="mb-3 p-3"
                >
                  <Card>
                    <Row className="g-0">
                      {post.poster && (
                        <Col md={4} className="d-flex align-items-center">
                          <Card.Img
                            src={post.poster}
                            alt={`${post.post_title} poster`}
                            style={{ maxWidth: "200px", height: "auto" }}
                          />
                        </Col>
                      )}
                      <Col md={post.poster ? 8 : 12}>
                        <Card.Body>
                          <Card.Title>{post.post_title}</Card.Title>
                          <Card.Text>{post.post_content}</Card.Text>
                          <Card.Text>
                            <small className="text-muted">
                              Blog created on: {post.post_date}
                            </small>
                          </Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  )
}
