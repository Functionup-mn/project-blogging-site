const express = require('express')
const router = express.Router()
const authorController = require('../Controllers/authorController')
const blogController = require('../Controllers/blogController')
const middleware = require('../middlewares/auth')

router.post('/authors2', authorController.createAuthor)

router.post('/loginAuthor', authorController.loginAuthor)

router.post('/blogs', middleware.authenticate, blogController.createBlog)

router.get('/blogs', middleware.authenticate, blogController.getBlog)

router.put('/blogs/:blogId', middleware.authenticate, middleware.authorization, blogController.updateBlogs)

router.delete('/blogs/:blogId', middleware.authenticate, middleware.authorization, blogController.deleteBlogs)

router.delete('/blogs', middleware.authenticate, middleware.authorization, blogController.deleteByQuery)

router.all("/*", (req,res) => {res.status(404).send( {msg:"Enter correct address"} ) }   )


module.exports = router
