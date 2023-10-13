exports.renters = (app, client, database) => {

    const auth = require('../authentication');

    //ENDPOINT GET che prende tutti i renters di un film
    app.get("/films/get/:id/renters", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);

        if (authenticate.status === 200) {

            try {

                const collection = await database.collection("data")

                //GESTIONE DATI

                //Gestione id
                const id = parseInt(req.params.id)

                if (id) {

                    const result = await collection.find({ id: id }).toArray();
                    //Se viene trovato il film
                    if (result.length !== 0) {
                        
                        //Controllo prima se esiste, se no, mi viene ritornato undefined
                        if (result[0].renters && result[0].renters.length !== 0) {
                            res.send(result[0].renters);
                        } else {
                            res.status(404).send("Questo film non ha ancora registrato alcun noleggio!");
                        }

                    } else {
                        res.status(404).send("Film non trovato!")
                    }

                } else {
                    res.status(400).send("Inserisci id come parametro!")
                }

            } catch (error) {
                console.log(error)

                res.sendStatus(400);
            }


        } else {
            res.sendStatus(401)
        }

    });

    //ENDPOINT POST che aggiugne un singolo noleggiante
    app.post("/films/add/:id/renters", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate.status === 200 && authenticate.role == "rw") {

            try {

                const collection = await database.collection("data")

                //CONTROLLO DATI OBBLIGATORI
                const first_name = req.body.first_name
                const last_name = req.body.last_name
                const email = req.body.email

                const id = parseInt(req.params.id)

                const checkIsbn = await collection.find({ id: id }).toArray()

                if (checkIsbn.length !== 0) {

                    if (first_name && last_name && email) {

                        const checkEmail = await collection.find({ 'renters.email': email }).toArray()

                        if (checkEmail.length == 0) {

                            const result = await collection.updateOne({ id: id }, {
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
                    res.status(400).send("Film non presente nel database!")
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
    app.delete("/films/:id/delete/renters/:email", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate.status === 200 && authenticate.role === "rw") {

            const email = req.params.email

            const id = parseInt(req.params.id)

            if (email && id) {

                try {

                    const collection = await database.collection("data")

                    const checkId = await collection.find({ id: id }).toArray()

                    if (checkId.length !== 0) {

                        const checkEmail = await collection.find({ "renters.email": email }).toArray()

                        if (checkEmail.length !== 0) {
                            //Filtro email e posts.id e tolgo ($pull) i posts che hanno tale id
                            const result = await collection.updateOne({ "renters.email": email }, { $pull: { renters: { email: email } } })

                            res.sendStatus(200)

                        } else {
                            res.status(400).send("Email non trovata!")
                        }

                    } else {
                        res.status(400).send("Film non presente nel database!")
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