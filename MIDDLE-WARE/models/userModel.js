const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    email : {type: String, required: true, unique:true},
    password : {type: String, required:true},
    role : {type: String, required:true},
    usage: {
        lastRequest: String,
        numberOfRequests: Number
      }
})

const User = model("user", userSchema);

//ESPORTA USER NON LE FUNZIONI!!

exports.User = User
