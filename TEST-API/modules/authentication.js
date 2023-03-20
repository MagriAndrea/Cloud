exports.authentication = async (client, database, req) => {

    const collection = database.collection('data');

    //1 Cerco nel database il documento che contiene l'email passata nell'header
    //Qui c'è scritto req.headers['email'] che equivale a req.header.email
    const result = await collection.find({email: req.headers['email']}).toArray();

    //Prendo il necessario per l'hashing della password
    const bcrypt = require('bcrypt');

    //2 Comparo la password passata nell'header e la password dal database
    //La password che si trova dentro header è in chiaro, quella del database
    //Scrivo result[0] perchè facendo .toArray() ottengo un formato tipo [{ogg1}] e quindi result[0] è il primo e unico dell'array
    const compareToken = await bcrypt.compare(req.headers['password'], result[0].password);

    //Dato che auth viene eseguito ad ogni richiesta (di risorse ad un endpoint),
    //aggiorno l'ultimo utilizzo con la data del momento e aumento di 1 le richieste
    const updateUsage = await collection.updateOne({ 
        email: req.headers['email']}, //Dico dove aggiornare
        { $set: { //Non so a cosa serva dire $set, te scrivilo 
            usage: { latestRequestDate: new Date().toLocaleDateString(),
            numberOfRequests: result[0].usage.numberOfRequests + 1 }
        }
        });

    //Serve davvero fare === true?
    //Guardo 1 che sia stata trovata l'email nel database e 2 che la comparazione delle password sia avvenuta con successo
    if ( compareToken === true && result.length !== 0 ) {

        return 200;

    } else {

        return 401;

    }

}