//LOGIN SERVE SOLO PER OTTENERE IL JWT TOKEN CHE POI USERO PER OGNI RICHIESTA

exports.logout = async (app, client, database) => {
    const jwt = require("jsonwebtoken");
    //Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
    require("dotenv").config();

    app.post("/logout", async (req, res) => {
        
        try {
            const refreshToken = req.body.refreshToken

            if (refreshToken) {

                const collection = await database.collection("users");

                //CONTROLLI NEL DATABASE
                //Trovo l'utente con tale email
                const result = await collection.find({ refreshToken: refreshToken }).toArray();

                //Se trovo il token
                if (result.length !== 0) {
                    
                    const result = await collection.updateOne({refreshToken:refreshToken}, {
                        $unset : {refreshToken: ""}
                    })

                    res.sendStatus(200);
                    
                } else {
                    res.status(404).send("refresh-token non presente nel database");
                }
            } else {
                res.status(400).send("Inserisci ii refresh-token nel body");
            }
        } catch (e) {
            console.log(e)
            res.sendStatus(400);
        }
    });
};
