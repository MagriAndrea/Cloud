exports.users = (app, client, database) => {

    app.post('/login', async (req, res) => {
        console.log("DEBUG: Chiamato endpoint /login")

        const collection = database.collection('data');

        const result = await collection.find({email: req.body.email}).toArray();

        const bcrypt = require('bcrypt');

        const compareToken = await bcrypt.compare(req.body.password, result[0].password);

        const updateUsage = await collection.updateOne({ email: req.body.email}, { $set: { usage: { latestRequestDate: new Date().toLocaleDateString(), numberOfRequests: result[0].usage.numberOfRequests + 1 } } });

        if ( compareToken && result.length != 0 ) {

            req.session.email = req.body.email; 

            //Viene mandato un cookie contenente un valore che ha come scadenza la sessione. 
            //Viene utilizzato il cookie perche e' come funziona 
            res.send(req.session.email);

        } else {

            res.sendStatus(401);

        }

    })

}