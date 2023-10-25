const jwt = require('jsonwebtoken');
require('dotenv').config()
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
            return res.sendStatus(403) //serve per bloccare l'esecuzione di jwt.verify, questo per evitare possibili errori. è uguale a scrivere res.sendS... e sotto return
        }

        req.user = payload //Metto il payload dentro la proprietà user di request, in modo da poterla usare dopo nella funzione async
        
        next() //Questo esegue la funzione async che ho definito dopo auth.authenticate
    })

}