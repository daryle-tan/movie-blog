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
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
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
                  className="mb-3 p-3 d-flex justify-content-center"
                  style={{ cursor: "pointer" }}
                >
                  <Card className="text-center" style={{ maxWidth: "95%" }}>
                    <Card.Body>
                      <Card.Title as="h2">{post.post_title}</Card.Title>
                      <Card.Text className="mb-3">
                        Genre: {post.movie_genre}
                      </Card.Text>
                      {post.poster ? (
                        <Card.Img
                          src={post.poster}
                          alt={`${post.post_title} poster`}
                          className="my-3 mx-auto d-block"
                          style={{ maxWidth: "95%", height: "auto" }}
                        />
                      ) : (
                        <Card.Text className="my-3">
                          No movie image available
                        </Card.Text>
                      )}
                      <Card.Text className="text-center">
                        <small className="text-muted d-block mb-2">
                          Blog created on: {post.post_date}
                        </small>
                      </Card.Text>
                      <div className="text-start">
                        {post.post_content
                          .split("\n")
                          .map((paragraph, index) => (
                            <p key={index} className="mb-3">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </Card.Body>
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
