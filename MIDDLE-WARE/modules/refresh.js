//LOGIN SERVE SOLO PER OTTENERE IL JWT TOKEN CHE POI USERO PER OGNI RICHIESTA

const { User } = require("../models/userModel")
const jwt = require("jsonwebtoken");
//Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
require("dotenv").config();

exports.refresh = async (app) => {

    app.get("/refresh", async (req, res) => {

        try {
            const refreshToken = req.cookies.refreshToken

            //CONTROLLI NEL DATABASE
            const result = await User.findOne({ refreshToken: refreshToken })

            //Se trovo il refreshToken
            if (result) {

                const verifiedToken = jwt.verify(result.refreshToken, process.env.JWT_REFRESH_SECRET)

                //Se il token è valido
                if (verifiedToken) {
                    const token = jwt.sign({ email: result.email, role: result.password }, process.env.JWT_ACCESS_SECRET, {
                        expiresIn: "1h",
                    });

                    res.json({ token: token });

                    console.log("DEBUG:","token refreshato")

                } else {
                    res.status(401).send("refresh-token scaduto, rifai il login!")
                }

            } else {
                res.status(401).send("refreshToken inesistente")
            }

        } catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
    });
};
