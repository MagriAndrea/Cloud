exports.posts = (app, client, database) => {

    const auth = require('../authentication');

    app.get('/posts/get', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                //PRENDO i valori dalla querystring e li elaboro

                //Valore default del numero massimo di post che vengono restituiti
                let limit = 100;

                //Il valore può essere definito dal client
                if ( req.query.limit ) { //Nota che prendo il dato da req.query

                    limit = req.query.limit;

                }

                //Valore default
                let order = 'default';

                //Permetto solo 2 valori: default o reverse
                if ( req.query.order ) {

                    if ( req.query.order === 'default' || req.query.order === 'reverse' ) {

                        order = req.query.order;

                    } else {

                        order = 'default';

                    }

                }
                
                //Cerco i post in base alla mail del utente loggato

                const result = await collection.find({ email: req.headers['email'] }).toArray();
    
                if ( result.length !== 0 ) {
                    
                    //Se order c'è ed è uguale a default
                    if ( order && order === 'default' ) {
                        //result[0] perchè viene mandato un array contenente un solo oggetto, di questo oggetto prendo l'array posts
                        //Slice(start, end) è una funzione che ritorna un array che contiene gli elementi, che hanno come 
                        //indice un numero tra start e end, di un altro array
                        res.send(result[0]['posts'].slice(0, limit));

                    } else {
                        //result[0]['posts'].slice(0, limit) ritorna un array, reverse inverte l'ordine degli elementi di questo array
                        res.send(result[0]['posts'].slice(0, limit).reverse());

                    }
    
                } else {
    
                    res.sendStatus(404);
    
                }
    
            } catch (error) {

                console.log(error)
    
                res.sendStatus(400);
    
            }

        } else {

            res.sendStatus(401);

        }

    });
/*
    //ENDPOINT POST che aggiugne un singolo post
    app.post('/posts/add', async (req, res) => {

        //Devo autenticarmi perchè non posso aggiungere post ad altre persone, e non so a chi aggiungere il post
        const authenticate = await auth.authentication(client, database, req);

        if (authenticate === 200) {

            try {
                //Genero un id random
                const randomId = Math.floor(//Arrotondo per difetto
                    (1 + Math.random()) //1 + math.random fa ritornare numeri tra 1 e 2 
                    * 0x10000) //Questo vuol dire moltiplica per 65536 (0x10000 è la rappresentazione esadecimale di 65536), quindi i numeri generati vanno da 0x10000 a 0x20000
                    .toString(16) //Il numero convertilo in esadecimale(16) e poi in una stringa(.toString())
                    .substring(1); //toglie la prima cifra

                const collection = database.collection('data');

                const result = await collection.updateOne({ email: req.headers['email']}, //dove la email è email
                
                { $push: //$push ha una sintassi $push : { array: {chiave:valore,...}}
                //$push = inserisci nell'array posts --> object
                    { posts: { //posts viene quindi riconosciuto come un array

                        id: randomId,
                        title: req.body.title,
                        content: req.body.content

                    } }
                
                });

                res.sendStatus(200);

            } catch (error) {

                console.log(error);

                res.sendStatus(400);

            }
        } else {
            res.sendStatus(401)
        }

    });
*/

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

    app.put('/posts/update/:id', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                const result = await collection.updateOne({ email: req.headers['email'], 'posts.id': req.params.id }, { $set: { 'posts.$.title': req.body.title, 'posts.$.content': req.body.content } });

                res.sendStatus(200);
    
            } catch (error) {

                console.log(error)
    
                res.sendStatus(400);
    
            }

        } else {

            res.sendStatus(401);

        }

    });

    app.delete('/posts/delete/:id', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                const result = await collection.deleteMany({ email: req.headers['email'], 'posts.id': req.params.id });

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