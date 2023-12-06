//LOGIN SERVE SOLO PER OTTENERE IL JWT TOKEN CHE POI USERO PER OGNI RICHIESTA

const { User } = require("../models/userModel")
const jwt = require("jsonwebtoken");
//Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
require("dotenv").config();

exports.login = async (app) => {

    app.post("/login", async (req, res) => {
        try {
            //Prendo dati dal body
            const email = req.body.email;
            const password = req.body.password;

            if (email && password) {

                const result = await User.findOne({ email: email })

                //Se trovo l'utente
                if (result) {
                    //Contorllo password
                    const bcrypt = require("bcrypt");

                    const comparePassword = await bcrypt.compare(
                        password,
                        result.password
                    );

                    //Se la password è corretta
                    if (comparePassword) {
                        //Perndo ruolo
                        const role = result.role

                        //Non serve passare la password, è gia stato loggato, non serve più
                        //Basta cambiare il jwt-secret in modo da "sloggare" tutti gli utenti
                        const token = jwt.sign({ email: email, role: role }, process.env.JWT_ACCESS_SECRET, {
                            expiresIn: "1h",
                        });

                        const refreshToken = jwt.sign({ email: email, role: role }, process.env.JWT_REFRESH_SECRET, {
                            expiresIn: "24h",
                        });

                        //Creo due cookie per non complicare la situazione
                        res.cookie('refresh_token', refreshToken, {
                            path: "/refresh", //Funziona solo nella path /refresh
                            sameSite: "strict", //Utilizza solo sul mio sito
                            httpOnly: true //Non puo essere utilizzato negli script
                        })
                        res.cookie('refresh_token', refreshToken, {
                            path: "/logout", //Funziona solo nella path /refresh
                            sameSite: "strict", //Utilizza solo sul mio sito
                            httpOnly: true //Non puo essere utilizzato negli script
                        })

                        const aaa = await User.findOneAndUpdate(
                            { email: email },
                            { $set: { refreshToken: refreshToken } },
                            { useFindAndModify: false, new: true }
                        )

                        res.json({ token: token });

                        console.log("DEBUG:", "login avvenuto con successo")

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
