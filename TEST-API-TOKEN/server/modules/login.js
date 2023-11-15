exports.login = async (app, client, database) => {
    
    const jwt = require('jsonwebtoken');
    //Carica il contenuto di .env (il file di questo progetto) nella proprietà process.env
    require('dotenv').config()

    app.post("/users/login", async (req, res) => {

        try {

            const email = req.body.email
            
            if (email) {
                
                const collection = database.collection("data")

                const result = collection.find({email:email}).toArray()

                if (result.length !== 0) {
                    
                    const token = jwt.sign({email:email}, process.env.JWT_SECRET, {
                        expiresIn: "24h",
                    })
                    
                    res.json({token:token})

                } else {
                    res.status(404).send("Email non presente nel database")
                }


            } else {
                res.status(400).send("Inserisci l'email nel body")
            }

        } catch (error) {
            res.sendStatus(400)
        }

    })

}