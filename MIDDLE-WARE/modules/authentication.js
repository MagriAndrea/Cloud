const jwt = require('jsonwebtoken');
require('dotenv').config()
const {User} = require("../models/userModel")

exports.authenticate = async (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1]
    
    if (!token) {
        res.status(401).send("token di autenticazione mancante")
    }
    
    //jwt.verify accetta come parametri, un token, un jwt_secret e una funzione di callback, in cui sa che nel primo campo
    //deve mettere l'errore e nel secondo campo il payload
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, payload) => {
        if (err) {
            console.log(err)
            //serve per bloccare l'esecuzione di jwt.verify, questo per evitare possibili errori. è uguale a scrivere res.sendS... e sotto return
            return res.status(403).send("Access token scaduto: " + err.expiredAt) 
        }
        
        console.log("DEBUG:", "Token verificato,", "User:", payload.email);

        //Metto il payload dentro la proprietà user di request, in modo da poterla usare dopo nella funzione async
        req.user = payload 
        
        //AGGIORNO IL NUMERO DI RICHIESTE DELL'UTENTE
        try {
        //Trovo il documento
        result = await User.findOne({email: req.user.email})

        //Aggiorno i dati
        await User.updateOne({ 
            email: req.user.email},
            { $set: {
                usage: {
                latestRequestDate: new Date().toLocaleDateString(),
                numberOfRequests: result.usage.numberOfRequests + 1 
            }}
            });
        } catch (e) {
            console.log(e)
            res.sendStatus(400)
        }

        console.log("DEBUG:","Utilizzo aggiornato,", "Numero di richieste: ", result.usage.numberOfRequests + 1)

        next() //Questo esegue la funzione async che ho definito dopo auth.authenticate
    })

}