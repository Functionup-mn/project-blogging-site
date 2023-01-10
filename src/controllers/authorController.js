const authorModel = require('../Models/authorModel')
const {isValidString, isVlaidName, isVlaidEmail, isValidPassword} = require('../validator/validator')
const jwt = require('jsonwebtoken')

const createAuthor = async function(req, res){
  try{  
    const data = req.body
    const {fname, lname, title, email, password} = data

    if(!Object.keys(data).length === 0) return res.status(400).send({status: false, message: "please enter data in request body"})

    if(!fname) return res.status(400).send({status: false, message: "fname is mandatory"})
    if(!isValidString(fname) && !isVlaidName(fname)) return res.status(400).send({status: false, message: "please enter valid fname"})

    if(!lname) return res.status(400).send({status: false, message: "lname is mandatory"})
    if(!isValidString(lname) && !isVlaidName(lname)) return res.status(400).send({status: false, message: "please enter valid lname"})

    if(!title) return res.status(400).send({status: false, message: "title is mandatory"})
    if(!isValidString(title) && !isVlaidName(title)) return res.status(400).send({status: false, message: "please enter valid title"})
    let titleValue = ["Mr", "Mrs", "Miss"]
    if(!titleValue.includes(title)) return res.status(400).send({status: false, message: "please don't write except of these values: Mr, Mrs, Miss"})

    if(!email) return res.status(400).send({status: false, message: "email is mandatory"})
    if(!isVlaidEmail(email)) return res.status(400).send({status: false, message: "please enter valid email"})
    const findData = await authorModel.findOne({email: email})
    if(findData) return res.status(400).send({status: false, message: "email is already exist"})

    if(!password) return res.status(400).send({status: false, message: "password is mandatory"})
    if(!isValidPassword(password)) return res.status(400).send({status: false, message: "please enter valid password"})
    
    const createData = await authorModel.create(data)
    res.status(201).send({status: true, data: createData})
}catch(err){
    res.status(500).send({status: false, message: err.message})
}
}

const loginAuthor = async function(req, res){
  try{  
    let email = req.body.email
    let password = req.body.password

    if(Object.keys(req.body).length === 0) return res.status(400).send({status: false, message: "please enter some data in request body"})

    if(!email) return res.status(400).send({status: false, message: "please enter email in req body"})
    if(!password) return res.status(400).send({status: false, message: "please enter password in req body"})
    checkAuthor = await authorModel.findOne({email: email, password: password})
    if(!checkAuthor) return res.status(400).send({status: false, message: "this email and password is not exist in DB"})

    const token = jwt.sign({
        authorId: checkAuthor._id.toString() 
    }, "my-secret-key")
    res.setHeader(("x-api-key", token))
    res.status(200).send({status:true, data:token})
} catch(err){
    return res.status(500).send({status: false, message: err.message})
}
}
module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor