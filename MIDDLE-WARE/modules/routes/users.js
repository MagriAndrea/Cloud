const {getUsers, createUser} = require("../../controllers/userController")

exports.users = (app) => {

    const auth = require('../authentication');

    //ENDPOINT DI TIPO GET che ritorna tutti gli user
    app.get('/users/get', auth.authenticate, getUsers);


    //ENDPOINT DI TIPO GET che ritorna un user in base all'email passata
    app.get("/users/get/:email", auth.authenticate, async (req, res) => { //Viene passato il riferimento a 

        try {

            const collection = database.collection("users")
            //Metto nella variabile result il risultato della query
            const result = await collection.find({ email: req.params.email }).toArray();

            if (result.length !== 0) {

                res.send(result)
            } else {
                //Se il risultato è vuoto
                res.sendStatus(404)
            }



        } catch (error) {
            console.log(error);

            res.sendStatus(400);
        }

    })

    // //ENDPOINT POST che permette di aggiungere un user al database
    app.post("/users/add", auth.authenticate, createUser)

    //ENDPOINT DI TIPO PUT che aggiorna un documento in base a cosa è stato passato nell'header
    app.put("/users/update", auth.authenticate, async (req, res) => {

        if (req.user.role == "admin") {

            if (req.body.email && req.body.password && req.body.role) {

                try {

                    const collection = await database.collection("users")

                    //CONTROLLO UNIVOCITA' EMAIL DA INSERIRE
                    const email = req.body.email
                    const checkUser = await collection.find({ email: email }).toArray();

                    if (checkUser.length == 0) {

                        //GESTIONE PASSWORD
                        const bcrypt = require("bcrypt")
                        const saltRounds = 10
                        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

                        //GESTIONE RUOLO
                        const role = req.body.role == "admin" ? "admin" : "user"

                        //Modifico dati del database
                        const result = await collection.updateOne(
                            { email: req.query.email },
                            { $set: { email: email, password: hashedPassword, role: role } }
                        )

                        res.sendStatus(200)

                    } else {
                        res.status(400).send("Email gia registrata, prova con un altra!")
                    }

                } catch (error) {
                    console.log(error)
                    res.sendStatus(400)
                }

            } else {
                res.status(400).send("Inserisci tutti i campi obbligatori!")
            }

        } else {
            res.status(401).send("Non hai il permesso di usare questo endpoint")
        }


    })

    //ENDPOINT DI TIPO DELETE che elimina il documento dell'user che fa la richiesta
    app.delete("/users/delete/:email", auth.authenticate, async (req, res) => {

        if (req.user.role == "admin") {

            try {

                const collection = await database.collection("users")

                //Prendo email che mi dice dove cancellare, da header, non da body, perchè si puo cancellare solo il proprio account, non quello degli altri
                const email = req.params.email

                const result = await collection.deleteMany({ email: email })

                if (result.deletedCount !== 0) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(404)
                }


            } catch (error) {
                console.log(error)
                res.sendStatus(400)
            }

        } else {
            res.status(401).send("Non hai il permesso di usare questo endpoint")
        }


    })


}



