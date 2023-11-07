//Questo file serve solo per la creazione dell oggetto User, dal quale verranno eseguite le operazioni sul database

const {Schema, model} = require("mongoose")

//Lo schema serve per la definizone di una struttura rigida, in modo che non ci siano problemi dati inconsistenti
const userSchema = new Schema({
    email : {type: String, required: true, unique:true},
    password : {type: String, required:true},
    role : {type: String, required:true},
    usage: {
        lastRequest: String,
        numberOfRequests: Number
      }
})

//model serve per la definizione della collezione in cui vuoi eseguire le query 
const User = model("user", userSchema);

exports.User = User
