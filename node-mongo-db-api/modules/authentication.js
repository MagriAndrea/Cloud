exports.authentication = async (client, database, req) => {

    if (req.session.email) {
        //Questo serve perche tutti i nostri api sono progettati per lavorare con req.headers.email
        req.headers.email = req.session.email

        return 200

    } else { //Nel caso non si usa la sessione, utilizzo il metodo vecchio

        const collection = database.collection('data');

        const result = await collection.find({email: req.headers['email']}).toArray();

        const bcrypt = require('bcrypt');

        const compareToken = await bcrypt.compare(req.headers['password'], result[0].password);

        const updateUsage = await collection.updateOne({ email: req.headers['email']}, { $set: { usage: { latestRequestDate: new Date().toLocaleDateString(), numberOfRequests: result[0].usage.numberOfRequests + 1 } } });

        if ( compareToken && result.length != 0 ) {

            return 200;

        } else {

            return 401;

        }
    }
}