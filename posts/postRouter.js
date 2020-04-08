const express = require('express');
const router = express.Router();
const method = require("./postDb")


router.get('/', (req, res) => {
  method.get()
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => console.error(err))
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  method.remove(req.post.id)
  .then(changes => {
    if(changes > 0) {
      res.status(200).json({ successMessage: `removed ${changes} post`})
    }
  })
  .catch(err => console.error(err))
});

router.put('/:id', validatePostId, (req, res) => {
  method.update(req.post.id, req.body)
  .then(changes => {
    if(changes > 0) {
      res.status(200).json({ successMessage: `updated ${changes} post`})
    }
  })
  .catch(err => console.error(err))
});

// custom middleware

function validatePostId(req, res, next) {
  method.getById(req.params.id)
  .then(post => {
    if(post) {
      req.post = post
      next()
    } else {
      res.status(400).json({ message: "invalid post id"})
    }
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "something went wrong", error: err })
  })
}

module.exports = router;
