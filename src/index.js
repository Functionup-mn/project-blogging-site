const express = require('express')
const bodyParser = require('body-parser')
const route = require('./routes/route')
const mongoose = require('mongoose')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb+srv://modassar123:modassar1234@test.ahxnnau.mongodb.net/project-database",{
    useNewUrlParser: true
})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 3000, function(){
    console.log("express is running on port " + (process.env.PORT || 3000));
})