exports.users = (app, client, database) => {

    app.post('/login', async (req, res) => {
        console.log("DEBUG: Chiamato endpoint /login")

        const collection = database.collection('data');

        const result = await collection.find({email: req.body.email}).toArray();

        const bcrypt = require('bcrypt');

        const compareToken = await bcrypt.compare(req.body.password, result[0].password);

        const updateUsage = await collection.updateOne({ email: req.body.email}, { $set: { usage: { latestRequestDate: new Date().toLocaleDateString(), numberOfRequests: result[0].usage.numberOfRequests + 1 } } });

        if ( compareToken && result.length != 0 ) {
            console.log("DEBUG: Loggato con successo!")
            //Salvo la mail dell'utente sulla sessione del server
            //Ogni volta che il valore req.session viene toccato, un hash viene generato e mandato al client
            req.session.email = req.body.email; 

            //In realta questo non serve per rimandare il cookie al client, express-session lo fa gia in automatico ogni volta che si tocca req.session
            //Questo ritorna l'email nel body della risposta
            res.sendStatus(200);

        } else {
            console.log("DEBUG: Combinazione email e password sbagliata")
            res.sendStatus(401);

        }

    })

    //Endpoint per vedere se c'è il login
    app.get('/check-login', async (req,res) => {
        console.log("DEBUG: Chiamato endpoint /check-login")
        console.log(req.session.email);
        if (req.session.email) {
            console.log("DEBUG: Loggato")
            res.sendStatus(200)
        } else {
            console.log("DEBUG: Non loggato")
            res.sendStatus(401)
        }
    })

    app.get('/logout', async (req,res) => {
        console.log("DEBUG: Chiamato endpoint /logout")
        //Tutte le sessioni sono eliminate
        req.session.destroy()
        res.sendStatus(200)
    })
}   