exports.buyers = (app, client, database) => {

    const auth = require('../authentication');

    //ENDPOINT GET che prende tutti i buyers di un libro
    app.get("/books/get/:isbn/buyers", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);

        if (authenticate.status === 200) {

            try {

                const collection = await database.collection("data")

                //GESTIONE DATI

                //Gestione isbn
                const isbn = req.params.isbn

                if (isbn) {

                    const result = await collection.find({ isbn: isbn }).toArray();

                    if (result.length !== 0) {

                        if (result[0].hasOwnProperty("buyers")) {

                            res.send(result[0].buyers)

                        } else {

                            res.status(404).send("Questo libro non ha ancora registrato alcun acquirente")
                        }

                    } else {
                        res.sendStatus(404)
                    }

                } else {
                    res.status(400).send("Inserisci isbn come parametro!")
                }

            } catch (error) {
                console.log(error)

                res.sendStatus(400);
            }


        } else {
            res.sendStatus(401)
        }

    });

    //ENDPOINT POST che aggiugne un singolo acquirente
    app.post("/books/add/:isbn/buyers", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate.status === 200 && authenticate.role == "rw") {

            try {

                const collection = await database.collection("data")

                //CONTROLLO DATI OBBLIGATORI
                const first_name = req.body.first_name
                const last_name = req.body.last_name
                const email = req.body.email

                const isbn = req.params.isbn

                const checkIsbn = await collection.find({ isbn: isbn }).toArray()

                if (checkIsbn.length !== 0) {

                    if (first_name && last_name && email) {

                        const checkEmail = await collection.find({ 'buyers.email': email }).toArray()

                        if (checkEmail.length == 0) {

                            const result = await collection.updateOne({ isbn: isbn }, {
                                $push:
                                {
                                    buyers: {
                                        first_name: first_name,
                                        last_name: last_name,
                                        email: email
                                    }
                                }
                            }
                            )

                            res.sendStatus(200)

                        } else {
                            res.status(400).send("Email gia registrata, scegliene un altra")
                        }

                    } else {

                        res.status(400).send("Inserisci tutti i dati obbligatori")
                    }

                } else {
                    res.status(400).send("Libro non presente nel database!")
                }

            } catch (error) {
                console.log(error)
                res.sendStatus(400)
            }

        } else {

            res.sendStatus(401)
        }


    })

    //ENDPOINT DELETE che cancella in base all'id passato come parametro
    app.delete("/books/:isbn/delete/buyers/:email", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate.status === 200 && authenticate.role === "rw") {

            const email = req.params.email

            const isbn = req.params.isbn

            if (email && isbn) {

                try {

                    const collection = await database.collection("data")

                    const checkIsbn = await collection.find({ isbn: isbn }).toArray()

                    if (checkIsbn.length !== 0) {

                        const checkEmail = await collection.find({ "buyers.email": email }).toArray()

                        if (checkEmail.length !== 0) {
                            //Filtro email e posts.id e tolgo ($pull) i posts che hanno tale id
                            const result = await collection.updateOne({ "buyers.email": email }, { $pull: { buyers: { email: email } } })

                            res.sendStatus(200)

                        } else {
                            res.status(400).send("Email non trovata!")
                        }

                    } else {
                        res.status(400).send("Libro non presente nel database!")
                    }

                } catch (error) {
                    console.log(error)
                    res.sendStatus(400)
                }

            } else {
                res.status(400).send("Inserisci i parametri necessari!")
            }

        } else {
            res.sendStatus(401)
        }

    })
}