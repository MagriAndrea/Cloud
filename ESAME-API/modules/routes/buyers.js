exports.buyers = (app, client, database) => {

    const auth = require('../authentication');

    //ENDPOINT GET che prende tutti i post
    app.get("/buyers/get/:isbn", async (req, res) => {

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

                        res.send(result[0].buyers)

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
    app.post("/buyers/add/:isbn", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate.status === 200 && authenticate.role == "rw") {

            try {

                const collection = await database.collection("data")

                //CONTROLLO DATI OBBLIGATORI
                const first_name = req.body.first_name
                const last_name = req.body.last_name
                const email = req.body.email

                const isbn = req.params.isbn

                if (first_name && last_name && email && isbn) {

                    const checkEmail = await collection.find({'buyers.email':email}).toArray()
                    
                    console.log(checkEmail.length)

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


            } catch (error) {
                console.log(error)
                res.sendStatus(400)
            }

        } else {

            res.sendStatus(401)
        }


    })

    //ENDPOINT DI TIPO PUT che aggiorna un post in base all'id
    app.put("/posts/put/:id", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        //Controllo autenticazione
        if (authenticate === 200) {

            //Contollo che il parametro sia stato passato
            if (req.params.id) {

                try {

                    const collection = await database.collection("data")

                    //GESTIONE DATI
                    const email = req.headers.email
                    const id = req.params.id

                    const checkId = await collection.find({ email: email, 'posts.id': id }).toArray()

                    //Se c'è l'id nel database
                    if (checkId !== 0) {

                        //Prendo i dati dal body
                        const title = req.body.title
                        const content = req.body.content

                        //Se sono stati inseriti i dati nel body
                        if (title && content) {

                            //Per elementi composti basta metterli tra le virgolette
                            const result = await collection.updateOne({ email: email, 'posts.id': id }, {
                                $set: {
                                    'posts.$.title': req.body.title, 'posts.$.content': req.body.content
                                }
                            });

                            res.sendStatus(200)

                        } else {
                            res.status(400).send("Inserisci un titolo e un contenuto!")
                        }

                    } else {
                        res.status(404).send("Id non trovato")
                    }

                } catch (error) {
                    console.log(error)
                    res.sendStatus(400)
                }

            } else {
                res.status(400).send("Inserisci il parametro id")
            }

        } else {
            res.sendStatus(401)
        }

    })

    //ENDPOINT DELETE che cancella in base all'id passato come parametro
    app.delete("/buyers/delete/:email", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate.status === 200 && authenticate.role==="rw") {

            const email=req.params.email

            if (email) {

                try {

                    const collection = await database.collection("data")

                    const checkEmail = await collection.find({"buyers.email": email}).toArray()

                    if (checkEmail.length !== 0) {
                        //Filtro email e posts.id e tolgo ($pull) i posts che hanno tale id
                        const result = await collection.updateOne({"buyers.email":email}, { $pull: { buyers: { email:email } } })

                        res.sendStatus(200)

                    } else {
                        res.status(400).send("Email non trovata!")
                    }

                } catch (error) {
                    console.log(error)
                    res.sendStatus(400)
                }

            } else {
                res.status(400).send("Specifica l'email!")
            }

        } else {
            res.sendStatus(401)
        }

    })
}