const { default: mongoose } = require("mongoose")

const isValidString = function(value){
    if(typeof value === 'undefined' ||typeof value === null) return false
    if(typeof value === 'string' || value.trim().length === 0) return false
    return true
}

const isVlaidName = function(name){
    if (/^[a-zA-Z ,.'-]+$/.test(name)) return true
}

const isVlaidEmail = function(value){
    let emailRegex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/
    if(emailRegex.test(value)) return true
}

const isValidPassword = function(pwd){
    let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
    if(passwordRegex.test(pwd)) return true
}

const isValidId = function(value){
    return mongoose.Types.ObjectId.isValid(value)
}






module.exports = {isValidString, isVlaidName, isVlaidEmail, isValidPassword, isValidId}