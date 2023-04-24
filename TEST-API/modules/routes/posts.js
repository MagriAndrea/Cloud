exports.posts = (app, client, database) => {

    const auth = require('../authentication');

    //ENDPOINT GET che prende tutti i post
    app.get("/posts/get", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);

        if (authenticate === 200) {

            try {

                const collection = await database.collection("data")

                //GESTIONE DATI
                //Gestione limit e order

                //Con l'operatore ternario posso scrivere questa sintassi: se valore è stato passato, salvati il valore, altrimenti salvati quello di default
                const limit = req.query.limit ? req.query.limit : 100;
                
                const order = req.query.order == "reverse" ? "reverse" : "default";

                //Gestione email
                const email = req.headers.email


                const result = await collection.find({email:email}).toArray();

                if (result !== 0) {
                    
                    //Vario i risultati in base all'order che mi è stato passato
                    if (order == "default") {
                        res.send(result[0].posts.slice(0, limit))
                    } else {
                        res.send(result[0].posts.slice(0, limit).reverse())
                    }

                //Non scrivo res.sendStatus() perchè nelle instruzione sopra viene gia ritornato qualcosa e lo status in automatico è 200

                } else {
                    res.sendStatus(404)
                }

            } catch (error) {
                console.log(error)

                res.sendStatus(400);
            }


        } else {
            res.sendStatus(401)
        }

    });

    //ENDPOINT GET che prende solo un post in base all id
    app.get("/posts/get/:id", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate === 200) {

            if (req.params.id) {

                try {

                    const collection = await database.collection("data");

                    //GESTIONE DATI
                    //Gestione id
                    const id = req.params.id

                    //Sintassi: "array" :{ $elemMatch :{chiave:valore}}
                    //$elemMatch trova tra gli oggetti dell'array, quale oggetto ha un campo id = id
                    const result = await collection.find({posts : { $elemMatch : {id:id} }}).toArray()

                    if (result !== 0) {
                        //Tra tutti i post di questo utente
                        result[0].posts.forEach((post) => {
                            //Se il post id è = a quello passato come parametro
                            if (post.id === id) {
                                res.send(post)
                            }
                            
                        })

                    } else {

                        res.sendStatus(404)
                    }

                } catch (error) {
                    console.log(error)
                    res.sendStatus(400)
                }

            } else {
                res.status(400).send("Inserisci tutti i campi!")
            }

        } else {
            res.sendStatus(401)
        }

    })


    //ENDPOINT POST che aggiugne un singolo post
    app.post("/posts/add", async (req, res) => {
        
        //AUTENTICAZIONE
        //Autentico il client che fa la richiesta per sapere a chi aggiungere il post
        const authenticate = await auth.authentication(client, database, req)

        if (authenticate === 200) {
        
            try {

                const collection = await database.collection("data")

                //CONTROLLO DATI OBBLIGATORI

                if (req.body.title && req.body.content) {

                    //Prendo i dati necessari 
                    const email = req.headers.email

                    const title = req.body.title
                    const content = req.body.content

                    //Genero un id random
                    const randId = Math.floor(1 + Math.random()* 0x10000).toString(16)

                    const result = await collection.updateOne({email:email}, {$push: 
                        { posts: {
                            id:randId,
                            title:title,
                            content:content
                        }}}
                    )

                    res.sendStatus(200)

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

                    const checkId = await collection.find({email:email, 'posts.id':id}).toArray()

                    //Se c'è l'id nel database
                    if (checkId !== 0) {

                        //Prendo i dati dal body
                        const title = req.body.title
                        const content = req.body.content

                        //Se sono stati inseriti i dati nel body
                        if (title && content) {
                
                            //Per elementi composti basta metterli tra le virgolette
                            const result = await collection.updateOne({email: email, 'posts.id':id}, { $set : {
                                'posts.$.title': req.body.title, 'posts.$.content': req.body.content } });

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
    app.delete("/posts/delete/:id", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate === 200) {

            //Controllo id
            const id = req.params.id

            if (id) {

                try {

                    const collection = await database.collection("data")

                    //Gestione mail
                    const email = req.headers.email

                    const checkId = await collection.find({email:email, 'posts.id':id}).toArray()

                    if (checkId) {
                        //Filtro email e posts.id e tolgo ($pull) i posts che hanno tale id
                        const result = await collection.updateOne({email:email, 'posts.id':id}, { $pull : {posts :{id: id}} })

                        res.sendStatus(200)
                        
                    } else {
                        res.status(400).send("Id non trovato!")
                    }

                } catch (error) {
                    console.log(error)
                    res.sendStatus(400)
                }

            } else {
                res.status(400).send("Specifica l'id!")
            }

        } else {
            res.sendStatus(401)
        }

    })
}