//LOGIN SERVE SOLO PER OTTENERE IL JWT TOKEN CHE POI USERO PER OGNI RICHIESTA
const {app} = require("../index")

exports.login = async () => {
    const jwt = require("jsonwebtoken");
    //Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
    require("dotenv").config();

    app.post("/login", async (req, res) => {
        try {
            //Prendo dati dal body
            const email = req.body.email;
            const password = req.body.password;

            if (email && password) {
                const collection = await database.collection("users");

                //CONTROLLI NEL DATABASE
                //Trovo l'utente con tale email
                const result = await collection.find({ email: email }).toArray();

                //Se trovo l'utente
                if (result.length !== 0) {
                    //Contorllo password
                    const bcrypt = require("bcrypt");

                    const comparePassword = await bcrypt.compare(
                        password,
                        result[0].password
                    );

                    //Se la password è corretta
                    if (comparePassword) {
                        //Perndo ruolo
                        const role = result[0].role

                        //Non serve passare la password, è gia stato loggato, non serve più
                        //Basta cambiare il jwt-secret in modo da "sloggare" tutti gli utenti
                        const token = jwt.sign({ email: email, role: role }, process.env.JWT_ACCESS_SECRET, {
                            expiresIn: "1h",
                        });

                        const refreshToken = jwt.sign({ email: email, role: role }, process.env.JWT_REFRESH_SECRET, {
                            expiresIn: "24h",
                        });

                        res.cookie('refresh_token', refreshToken, {
                            path: "/refresh", //Funziona solo nella path /refresh
                            sameSite: "strict", //Utilizza solo sul mio sito
                            httpOnly: true //Non puo essere utilizzato negli script
                        })

                        await collection.updateOne(
                            {email: req.body.email}, 
                            { $set: {refreshToken: refreshToken}}
                            )

                        res.json({token: token});
                        
                    } else {
                        res.status(401).send("Password errata!")
                    }

                } else {
                    res.status(404).send("Email non presente nel database");
                }
            } else {
                res.status(400).send("Inserisci l'email e la password nel body");
            }
        } catch (e) {
            console.log(e)
            res.sendStatus(400);
        }
    });
};
