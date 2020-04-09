const express = require('express');
const router = express.Router();
const method = require("./userDb")
const postMethod = require("../posts/postDb")



router.post('/', validateUser, (req, res) => {
  res.status(200).json({ message: "you son of a bitch, i'm in", data: req.body })
});

router.post('/:id/posts', validatePost, (req, res) => {
  try {
    res.status(200).json({ message: "post successful", data: req.body })
  } catch (error) {
    res.status(500).json({ message: "something fucky" })
  }
});

router.get('/', (req, res) => {
  const message = process.env.MESSAGE || "hello from localhost";
  method.get(req.query)
  .then(users => {
    res.status(200).json({data: users, msg: message})
  })
  .catch(err => console.error(err))
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', (req, res) => {
  method.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => console.error(err))
});

router.delete('/:id', validateUserId, (req, res) => {
  method.remove(req.user.id)
  .then(i => {
    if(i > 0) {
      res.status(200).json({ successMessage: `removed ${i} user`})
    }
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "something went wrong", error: err })
  })
});

router.put('/:id', validateUserId, (req, res) => {
  method.update(req.user.id, req.body)
  .then(changes => {
    if(changes > 0) {
      res.status(200).json({ successMessage: "that went well, good job" })
    }
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "something went wrong", error: err })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  method.getById(req.params.id)
  .then(user => {
    // validateUserId validates the user id on every request that expects a user id parameter
    if(user) {
      req.user = user
      // if the id parameter is valid, store that user object as req.user
      next()
    } else {
      // if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }
      res.status(400).json({ message: "invalid user id" })
    }
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "something went wrong", error: err })
  })
}

function validateUser(req, res, next) {
  // validateUser validates the body on a request to create a new user
  if(req.body) {
    if(req.body.name) {
      method.insert(req.body)
      next()
    } else {
      // if the request body is missing the required name field, cancel the request and respond with status 400 and { message: "missing required name field" } 
      res.status(400).json({ message: "missing required name field" })
    }
  } else {
    // if the request body is missing, cancel the request and respond with status 400 and { message: "missing user data" }
    res.status(400).json({ message: "missing user data" })
  }
}

function validatePost(req, res, next) {
  // validatePost validates the body on a request to create a new post
  if(req.body) {
    if(req.body.text) {
      req.body.user_id = req.params.id
      postMethod.insert(req.body)
      next()
    } else {
      // if the request body is missing the required text field, cancel the request and respond with status 400 and { message: "missing required text field" }
      res.status(400).json({ message: "missing required text field" })
    }
  } else {
    // if the request body is missing, cancel the request and respond with status 400 and { message: "missing post data" }
    res.status(400).json({ message: "missing post data" })
  }
}

module.exports = router;
