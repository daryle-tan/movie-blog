import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function BlogPage({ userToken, logout, isLoggedIn }) {
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
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
            Authorization: `Token ${userToken}`, // Changed from Bearer to Token
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
      <>
        <div>Loading posts...</div>
      </>
    )
  }

  if (!isLoggedIn) {
    navigate("/")
    return null
  }

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1>Blog Posts</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {posts.map((post) => (
              <li
                key={post.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
                onClick={() => handlePostClick(post.id)}
              >
                <h2>{post.post_title}</h2>
                {post.poster ? (
                  <img
                    src={post.poster}
                    alt={`${post.post_title} poster`}
                    style={{ maxWidth: "200px", height: "auto" }}
                  />
                ) : (
                  <div>No movie image available</div>
                )}
                <small style={{ fontSize: "0.9em", opacity: 1 }}>
                  Blog created on: {post.post_date}
                </small>
                <div>{post.post_content}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
