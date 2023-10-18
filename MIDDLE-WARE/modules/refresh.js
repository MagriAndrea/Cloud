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

                const token = jwt.sign({ email: result[0].email, role: result[0].password }, process.env.JWT_ACCESS_SECRET, {
                    expiresIn: "10m",
                });

                res.json({ token: token });

            } else {
                res.status(401).send("refreshToken inesistente")
            }

        } catch (error) {
            res.sendStatus(400);
        }
    });
};
