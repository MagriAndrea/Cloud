//LOGIN SERVE SOLO PER OTTENERE IL JWT TOKEN CHE POI USERO PER OGNI RICHIESTA

exports.refresh = async (app, client, database) => {
    const jwt = require("jsonwebtoken");
    //Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
    require("dotenv").config();

    app.post("/refresh", async (req, res) => {

        try {
            const collection = await database.collection("users");

            const refreshToken = req.body.refreshToken

            //CONTROLLI NEL DATABASE
            const result = await collection.find({ refreshToken: refreshToken }).toArray();

            //Se trovo il refreshToken
            if (result.length !== 0) {

                const verifiedToken = jwt.verify(result[0].refreshToken, process.env.JWT_REFRESH_SECRET)

                //Se il token è valido
                if (verifiedToken) {
                    const token = jwt.sign({ email: result[0].email, role: result[0].password }, process.env.JWT_ACCESS_SECRET, {
                        expiresIn: "1h",


                    });

                    res.json({ token: token });

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
