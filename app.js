const express = require("express")
require("dotenv").config()
const app = express()
const port = process.env.APP_PORT ?? 5000
app.use(express.json())

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list")
}

app.get("/", welcome)

const movieHandlers = require("./movieHandlers")
const userHandlers = require("./userHandlers")
const { validateMovie, validateUser } = require("./validators.js")
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js")

app.get("/api/movies", movieHandlers.getMovies)
app.get("/api/movies/:id", movieHandlers.getMovieById)

app.get("/api/users", userHandlers.getUsers)
app.get("/api/users/:id", userHandlers.getUsersById)
app.post("/api/users", validateUser, hashPassword, userHandlers.postUser)
app.delete("/api/users/:id", userHandlers.deleteUser)
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
)

app.use(verifyToken)

app.post("/api/movies", validateMovie, movieHandlers.postMovie)
app.put("/api/movies/:id", movieHandlers.updateMovie)
app.delete("/api/movies/:id", movieHandlers.deleteMovie)

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened")
  } else {
    console.log(`Server is listening on ${port}`)
  }
})
