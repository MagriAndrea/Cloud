exports.authentication = async (client, database, req) => {

    if (req.session.email) {
        console.log("DEBUG: Autenticazione avvenuta tramite req.session.email")
        //Questo serve perche tutti i nostri api sono progettati per lavorare con req.headers.email
        req.headers["email"] = req.session.email
        //Se nella session è salvata l'email allora vuol dire che ...
        return 200

    } else { //Nel caso non si usa la sessione, utilizzo il metodo vecchio...

        // try {

        //     const collection = database.collection('data');

        //     const result = await collection.find({ email: req.headers['email'] }).toArray();

        //     const bcrypt = require('bcrypt');

        //     const compareToken = await bcrypt.compare(req.headers['password'], result[0].password);

        //     const updateUsage = await collection.updateOne({ email: req.headers['email'] }, { $set: { usage: { latestRequestDate: new Date().toLocaleDateString(), numberOfRequests: result[0].usage.numberOfRequests + 1 } } });

        //     if (compareToken && result.length != 0) {
        //         console.log("DEBUG: Autenticazione avvenuta tramite email e password")
        //         return 200;

        //     } else {

        //         return 401;

        //     }
            
        // } catch (ex) {

        //     console.log(ex)
        // }
    }
}