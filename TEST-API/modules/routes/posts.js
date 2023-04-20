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
    /*
    app.put('/posts/update/:id', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');
                //La virgola che separa {email: ... , 'posts.id': ...} viene considerata come un and
                //Queste 2 condizioni le usiamo per una maggiore sicurezza, basterebbe solo la seconda ma la usiamo per evitare id uguali
                //Scrivere email: req.hea... serve solo come ulteriore filtro
                //email e 'posts.id' sono due campi dello stesso documento
                const result = await collection.updateOne({ email: req.headers['email'], 'posts.id': req.params.id }, 
                //Una volta che il filtro (l'oggetto con email:...) trova cio che ho specificato, si segna l'indice
                //Il $ serve per dire: l'indice dove il filtro è true
                { $set: { 'posts.$.title': req.body.title, 'posts.$.content': req.body.content } });

                res.sendStatus(200);
    
            } catch (error) {

                console.log(error)
    
                res.sendStatus(400);
    
            }

        } else {

            res.sendStatus(401);

        }

        
    }); 
*/

    //ENDPOINT DI TIPO PUT che aggiorna un post in base all'id
    app.put("/posts/put/:id", async (req, res) => {

        const authenticate = auth.authentication(client, database, req)

        if (authenticate === 200) {

            if (req.params.id) {

                try {

                    const collection = database.collection("data")

                } catch (error) {
                    console.log(error)
                    res.sendStatus(400)
                }

            } else {
                res.status(400).send("Inserisci tutti i parametri!")
            }

        } else {
            res.sendStatus(401)
        }

    })

    app.delete('/posts/delete/:id', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');
                
                //$pull elimina tutte le instanze che matchano la condizione
                const result = await collection.updateOne({ email: req.headers['email']}, { $pull: {posts: {id : req.params.id }}});

                res.sendStatus(200);
    
            } catch (error) {

                console.log(error)
    
                res.sendStatus(400);
    
            }

        } else {

            res.sendStatus(401);

        }

    });

}