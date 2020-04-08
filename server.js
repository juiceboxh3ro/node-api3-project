const express = require('express');
const server = express();

server.use(logger)
server.use(express.json())

const userRouter = require('./users/userRouter')
server.use("/api/user/", userRouter)

const postRouter = require('./posts/postRouter')
server.use("/posts/", postRouter)

server.get('/', (req, res) => {
  res.send(`<h2>What</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} Request to: ${req.originalUrl} `)
  next()
}

module.exports = server;
