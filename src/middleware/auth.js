const jwt = require('jsonwebtoken')
const blogModel = require('../Models/blogModel')

const authenticate = function (req, res, next) {
  try {
      const token = req.headers["x-api-key"]

      if (!token) {
          res.status(400).send({ msg: "Please set x-api-key header" })
      }

      jwt.verify(token, "Project1-key",(err,decoded) =>{ 
      if(err){
          return res.status(401).send({status: false, message: err.message}) 
      }else{ 
      req.decoded = decoded
      return next()
      } 
      })
  }
  catch (error) {
      res.status(500).send({ msg: "Authentication failure", msg2: error.message })
  }
}

const authorization = async function (req, res, next) {
   const blogId = req.params.blogId
   if(!blogId) return res.status(400).send({status: false, message: "please enter blogId in params"})
   checkData = await blogModel.findById(blogId)
   if(!checkData){
    return res.status(400).send({status: false, message: "blog is not found of this blogId"})
   }
   console.log(checkData.authorId)
   let checkAuthorId = req.decoded.authorId
   if(checkData.authorId.toString() !== checkAuthorId){
    return res.status(403).send({status: false, message: "user is not authorized"})
   }

   next()
  }


module.exports.authenticate = authenticate
module.exports.authorization = authorization