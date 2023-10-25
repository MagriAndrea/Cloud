exports.users = (app, client, database) => {

    const auth = require('../authentication');

    //ENDPOINT DI TIPO GET che ritorna tutti gli user
    app.get('/users/get', auth.authenticate, async (req, res) => {

        console.log(req.user.role)

        try {

            const collection = database.collection('users');

            const result = await collection.find({}).toArray();

            //Di conseguenza result è un array di oggeti, posso facilmente vedere se il contenuto è maggiore di 0 verificando la proprietà .length
            if (result.length !== 0) {

                //Se c'è qualcosa dentro il risultato, lo ritorno al chiamante dell'endpoint
                res.send(result);

            } else {

                //Altrimenti gli ritorno un errore 404 cioè che non è stato trovato niente
                res.sendStatus(404);

            }

        } catch (error) { //Se c'è qualche errore vuol dire che il client ha fatto una richiesta sbagliata

            console.log(error)

            //400 = bad request
            res.sendStatus(400);

        }

    });

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
    app.post("/users/add", auth.authenticate, async (req, res) => {

        if (req.user.role == "admin") {

            try {
                //Guardo se sono stati inseriti i campi obbligatori
                if (req.body.email && req.body.password && req.body.role) {

                    //Prendo la collection dal database
                    const collection = await database.collection("users");

                    //GESTIONE EMAIL
                    //L'email deve essere univoca
                    const checkUser = await collection.find({ email: req.body.email }).toArray();

                    if (checkUser.length == 0) {

                        //GESTIONE PASSWORD
                        //Trasformo la passowrd in chiaro in password hashata con bcrypt
                        const bcrypt = require("bcrypt")
                        const saltRounds = 10

                        //Metto nella variabile la password hashata
                        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

                        //GESTIONE RUOLO
                        //Ruoli: admin o user;  se il ruolo è admin, admin, altrimenti qualunque altro ruolo inserito diventa user
                        //Uso l'operatore ternario perchè il codice è più pulito (non devo scrivere let ruolo, e poi un if che ne cambia il valori)
                        const role = req.body.role == "admin" ? "admin" : "user";

                        //Creo l'oggetto che poi inserisco dentro il database
                        const userData = {
                            email: req.body.email,
                            password: hashedPassword,
                            role: role,
                            usage: {
                                lastRequest: new Date().toLocaleDateString(),
                                numberOfRequests: 1
                            }
                        }

                        //Se tutto va bene allora inserisco il dato nel database
                        const result = await collection.insertOne({ email: userData.email, password: userData.password, role: userData.role, usage: userData.usage })

                        res.sendStatus(200);

                    } else {
                        res.status(400).send("Email gia registrata, scegliene un'altra!")
                    }

                } else {
                    res.status(400).send("Inserisci tutti i campi obbligatori!")
                }

            } catch (error) {
                console.log(error)

                res.sendStatus(400).send("Problemi con la richiesta")
            }

        } else {
            res.status(401).send("Non hai il permesso di usare questo endpoint")
        }

    })

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



