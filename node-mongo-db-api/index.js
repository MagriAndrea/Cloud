//RICHIAMO I MODULI NECESSARI

const express = require('express');

const cors = require('cors');

const session = require('express-session'); //Prendo l'oggetto session

const { MongoClient } = require('mongodb');

const routes = require('./modules/routes');

//INIZIALIZZO EXPRESS E ABILITO LE CORS

const app = express();

app.use(cors({
    origin: (_, callback) => callback(null, true),
    credentials : true
}));

//Aggiungo sessione
app.use(session({
    secret: 'keyboard cat', 
    resave: true,
    saveUninitialized: true, 
    cookie: {
        sameSite: "lax"
    }
}));

//CONNETTO AL DATABASE

const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri);

const database = client.db('node_api');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//AVVIO L'APP SU PORTA 4000

app.listen(4000, () => {

    console.log('Il server è avviato su porta 4000');

});

//AGGIUNGO GLI ENDPOINT

routes.routes(app, client, database);
