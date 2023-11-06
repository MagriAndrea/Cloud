//RICHIAMO I MODULI NECESSARI (LI CARICO IN MEMORIA)
const express = require("express");

const cors = require("cors")

const routes = require('./modules/routes') //richiamo di routes.js

const cookieParser = require('cookie-parser')

//INIZZIALIZZO EXPRESS E ABILITO LE CORS
const app = express()
exports.app = app
app.use(cors())

// CONNETTO AL DATABASE con mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/middle-ware', {useNewUrlParser: true, useUnifiedTopology: true})

//Questi sono middleware
app.use(express.json()) 
app.use(express.urlencoded({extended:true})) //Permette in postman di passare i parametri checkando x-www-form-urlencoded
app.use(cookieParser())

//AVVIO L'APP SU PORTA 4000

app.listen(4000, () => {
    console.log("Il server è avviato su porta 4000")
})

//AGGIUNGO GLI ENDPOINT

routes.routes(app); //routes è il file, .routes è la funzione
