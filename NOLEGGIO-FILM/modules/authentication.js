//AUTHENTICATION SERVE PER VERIFICARE SE IL JWT TOKEN CONTIENE

exports.authentication = async (client, database, req) => {
    
    const jwt = require('jsonwebtoken');
    //Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
    require('dotenv').config()

    var status = 401
    var role = "r"

    try {
        
        const collection = await database.collection("users")
        
        //Prendo il token e lo decodifico
        const token = req.headers.authorization.split(" ")[1];
       
        //decoded contiene il payload decodificato del jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
        //Trovo se l'email nel payload è nel database
        const result = await collection.find({email:decoded.email}).toArray()

        if (result[0].email == req.headers.email) {
            status = 200
            role = decoded.role
        } else {
            //Nel caso il token non viene utilizzato dall'email che si è loggata
            status = 401
        }   
        
        //Aggiorno l'utilizzo
        const updateUsage = await collection.updateOne({ 
            email: req.headers.email},
            { $set: {
                usage: {
                latestRequestDate: new Date().toLocaleDateString(),
                numberOfRequests: result[0].usage.numberOfRequests + 1 
            }}
            });
        

    } catch (e) {
        console.log(e)
        status = 401
    }
    
    return {status:status, role:role}

}