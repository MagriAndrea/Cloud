//LOGIN SERVE SOLO PER OTTENERE IL JWT TOKEN CHE POI USERO PER OGNI RICHIESTA

const { User } = require("../models/userModel");
//Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
require("dotenv").config();

exports.logout = async (app) => {

    app.post("/logout", async (req, res) => {
        
        try {
            const refreshToken = req.cookies.refresh_token

            if (refreshToken) {

                //CONTROLLI NEL DATABASE
                //Trovo l'utente con tale email
                const result = await User.findOne({ refreshToken: refreshToken })

                //Se trovo il token
                if (result) {
                    
                    const result = await User.updateOne({refreshToken:refreshToken}, {
                        $unset : {refreshToken: ""}
                    })

                    res.sendStatus(200);

                    console.log("DEBUG:","logout avvenuto con successo")
                    
                } else {
                    res.status(404).send("refreshToken non presente nel database");
                }
            } else {
                res.status(400).send("refresh_token non presente nei cookie");
            }
        } catch (e) {
            console.log(e)
            res.sendStatus(400);
        }
    });
};
