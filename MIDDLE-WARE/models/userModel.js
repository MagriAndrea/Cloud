//Questo file serve solo per la creazione dell oggetto User, dal quale verranno eseguite le operazioni sul database
//Si fa un file model per ogni collezione
const {Schema, model} = require("mongoose")

//Lo schema serve per la definizone di una struttura rigida, in modo che non ci siano problemi dati inconsistenti
const userSchema = new Schema({
    email : {type: String, required: true, unique:true},
    password : {type: String, required:true},
    role : {type: String, required:true},
    refreshToken : String,
    usage: {
        latestRequestDate: String,
        numberOfRequests: Number
      }
})

//model serve per la definizione della collezione in cui vuoi eseguire le query
//Nonostante la collzione si chiami users, io scrivo user perchè mongoose prende al plurale per qualche motivo 
const User = model("user", userSchema);

exports.User = User
