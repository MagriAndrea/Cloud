exports.comments = (app, client, database) => {

    const auth = require('../authentication');

    //ENDPOINT GET che prende tutti i commenti dato un post
    app.get("/posts/:post_id/comments/get", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);

        if (authenticate === 200) {

            try {

                const collection = await database.collection("data")

                //GESTIONE DATI
                //Gestione limit e order

                //Con l'operatore ternario posso scrivere questa sintassi: se valore è stato passato, salvati il valore, altrimenti salvati quello di default
                const limit = req.query.limit ? req.query.limit : 100;
                
                const order = req.query.order == "reverse" ? "reverse" : "default";

                //Gestione email e post_id
                const email = req.headers.email

                const postId = req.params.post_id


                const result = await collection.find({email:email, 'posts.id':postId}).toArray();

                if (result !== 0) {
                    //Tra tutti i post di questo utente
                    result[0].posts.forEach((post) => {
                        //Se il post id è = a quello passato come parametro
                        if (post.id === postId) {
                            res.send(post.comments)
                        }
                        
                    })

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
    app.get("/posts/:post_id/comments/get/:id", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate === 200) {

            try {

                const collection = await database.collection("data");

                //GESTIONE DATI
                const postId = req.params.post_id
                const id = req.params.id

                const result = await collection.find({
                    'posts': {
                        $elemMatch: {
                            'id': postId,
                            'comments.id': id
                        }
                    }
                }).toArray();


                if (result.length === 0) {
                    // Invia una risposta con codice di stato 404 se non viene trovato alcun documento corrispondente
                    res.sendStatus(404);
                } else {
                    // Cerca il post con l'id specificato
                    const post = result[0].posts.find(post => post.id === postId);

                    if (!post) {
                        // Invia una risposta con codice di stato 404 se non viene trovato alcun post corrispondente
                        res.sendStatus(404);
                    } else {
                        // Cerca il commento con l'id specificato
                        const comment = post.comments.find(comment => comment.id === id);
                        if (!comment) {
                            // Invia una risposta con codice di stato 404 se non viene trovato alcun commento corrispondente
                            res.sendStatus(404);
                        } else {
                            // Invia una risposta contenente il commento specificato
                            res.send(comment);
                        }
                    }
                }
                

            } catch (error) {
                console.log(error)
                res.sendStatus(400)
            }

        } else {
            res.sendStatus(401)
        }

    })


    //ENDPOINT POST che aggiugne un singolo post
    app.post("/posts/:post_id/comments/add", async (req, res) => {
        
        //AUTENTICAZIONE
        //Autentico il client che fa la richiesta per sapere a chi aggiungere il post
        const authenticate = await auth.authentication(client, database, req)

        if (authenticate === 200) {
        
            try {

                const collection = await database.collection("data")

                //CONTROLLO DATI OBBLIGATORI

                if (req.body.content) {

                    //Prendo i dati necessari 
                    const email = req.headers.email
                    const postId = req.params.post_id

                    const content = req.body.content

                    //Genero un id random
                    const randId = Math.floor(1 + Math.random()* 0x10000).toString(16)

                    const result = await collection.updateOne({email:email, 'posts.id':postId}, {$push: 
                        { 'posts.$.comments': {
                            id:randId,
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
    app.put("/posts/:post_id/comments/update/:id", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        //Controllo autenticazione
        if (authenticate === 200) {

            //Contollo che il parametro sia stato passato
            if (req.params.id) {

                try {

                    const collection = await database.collection("data")

                    //GESTIONE DATI
                    const email = req.headers.email
                    const postId = req.params.post_id
                    const id = req.params.id

                    const checkId = await collection.find({email:email, 'posts.id':postId, 'posts.comments.id':id}).toArray()

                    //Se c'è l'id nel database
                    if (checkId !== 0) {

                        //Prendo i dati dal body
                        const content = req.body.content

                        //Se sono stati inseriti i dati nel body
                        if (content) {
                
                            //Per elementi composti basta metterli tra le virgolette
                            const result = await collection.updateOne(
                                { email: email },
                                { $set: { 'posts.$[post].comments.$[comment].content': content } },
                                
                                {
                                    //arrayFilters viene eseguito prima di $set, prima infatti esso guarda 
                                  arrayFilters: [
                                    { 'post.id': postId },
                                    { 'comment.id': id }
                                  ]
                                }
                              );

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
    app.delete("/posts/:post_id/comments/delete/:id", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate === 200) {

            //Controllo id
            const id = req.params.id
            const postId = req.params.post_id

            if (id) {

                try {

                    const collection = await database.collection("data")

                    //Gestione mail
                    const email = req.headers.email

                    const checkId = await collection.find({email:email, 'posts.id':postId, 'posts.comments.id':id}).toArray()

                    if (checkId) {
                        //Filtro email e posts.id e tolgo ($pull) i posts che hanno tale id
                        const result = await collection.updateOne({email:email, 'posts.id':postId},
                         { $pull : {'posts.$.comments':{
                            id: id}} })

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