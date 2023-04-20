//RICHIAMO I MODULI NECESSARI (LI CARICO IN MEMORIA)


const express = require("express");

const cors = require("cors")

const { MongoClient } = require("mongodb")

const routes = require('./modules/routes') //richiamo di routes.js

//INIZZIALIZZO EXPRESS E ABILITO LE CORS

const app = express()

app.use(cors())

// CONNETTO AL DATABASE

const uri = "mongodb://127.0.0.1:27017"

const client = new MongoClient(uri)

const database = client.db("node_api")

app.use(express.json())
app.use(express.urlencoded({extended:true})) //Permette in postman di passare i parametri checkando x-www-form-urlencoded

//AVVIO L'APP SU PORTA 4000

app.listen(4000, () => {
    console.log("Il server è avviato su porta 4000")
})

//AGGIUNGO GLI ENDPOINT

routes.routes(app, client, database); //routes è il file, .routes è la funzione
