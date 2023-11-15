exports.authentication = async (client, database, req) => {
    
    const jwt = require('jsonwebtoken');
    //Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
    require('dotenv').config()

    var status = 401
    try {
        
        const collection = await database.collection("data")
        
        //Prendo il token e lo decodifico
        const token = req.headers.authorization.split(" ")[1];
       
        //decoded contiene il payload decodificato del jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
        //Trovo se l'email nel payload è nel database
        const result = await collection.find({email:decoded.email}).toArray()

        const updateUsage = await collection.updateOne({ 
            email: req.headers.email},
            { $set: {
                usage: {
                latestRequestDate: new Date().toLocaleDateString(),
                numberOfRequests: result[0].usage.numberOfRequests + 1 
            }}
            });
        
        if (result.length !== 0) {
            status = 200
        } else {
            status = 401
        }
        

    } catch (e) {

        status = 401
    }
    return status

}