exports.books = (app, client, database) => {
    const auth = require("../authentication"); //require svolge una funzione simile a import

    //ENDPOINT DI TIPO GET che ritorna tutti i libri
    app.get("/books/get", async (req, res) => {
        const authenticate = await auth.authentication(client, database, req);

        if (authenticate.status === 200) {
            try {
                const collection = database.collection("data");

                //Getisco parametri queryString
                let filter = {};
                //Se viene passato l'isbn allora aggiunti la voce isbn:req.query.isbn all oggetto filtro
                req.query.isbn ? (filter.isbn = req.query.isbn) : ""; //Metto "" se no pensa che l'else sia la riga sotto
                req.query.title ? (filter.title = req.query.title) : "";
                req.query.pages ? (filter.pages = parseInt(req.query.pages)) : ""; //parseInt perchè pages:"352" non è considerato numero
                const order = req.query.order === "desc" ? "desc" : "asc";

                const result = await collection.find(filter).toArray();

                if (result.length !== 0) {

                    if (order === "asc") {
                        //Se il titolo del primo libro è maggiore (es. F > O, G > Y...) ritorno 1 altrimenti -1
                        //Se viene ritornato 1 allora a viene dopo b; Se viene ritornato -1 allora a viene prima di b
                        res.send(result.sort((a, b) => (a.title > b.title ? 1 : -1)));

                    } else {
                        res.send(result.sort((a, b) => (a.title > b.title ? -1 : 1)));

                    }

                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(400);
            }
        } else {
            res.sendStatus(401);
        }
    });

    // //ENDPOINT POST che permette di aggiungere un libro al database
    app.post("/books/add", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)

        if (authenticate.status === 200 && authenticate.role === "rw") {

            //Prendo i dati dal body
            const isbn = req.body.isbn
            const title = req.body.title
            const subtitle = req.body.subtitle
            const author = req.body.author
            const publisher = req.body.publisher
            const pages = parseInt(req.body.pages)
            const description = req.body.description
            const purchases = parseInt(req.body.purchases)

            if (isbn && title && subtitle && author && publisher && pages && description && purchases) {

                try {

                    const collection = await database.collection("data")

                    const checkIsbn = await collection.find({ isbn: isbn }).toArray()

                    if (checkIsbn.length === 0) {

                        const result = await collection.insertOne({
                            isbn: isbn, title: title, subtitle: subtitle,
                            author: author, publisher: publisher, pages: pages, description: description, purchases: purchases
                        })

                        res.sendStatus(200)

                    } else {
                        res.status(400).send("Isbn gia registrato")
                    }

                } catch (e) {

                }

            } else {
                res.status(400).send("Inserisci tutti i campi nel body")
            }

        } else {

            res.sendStatus(401);
        }

    });

    //ENDPOINT DI TIPO PUT che aggiorna un documento in base a cosa è stato passato nell'header
    app.put("/books/update/:isbn", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);

        if (authenticate.status === 200 && authenticate.role === "rw") {

            try {

                const collection = await database.collection("data");

                const newIsbn = req.body.isbn

                const oldIsbn = req.params.isbn

                const checkIsbn = await collection.find({ isbn: newIsbn }).toArray();

                if (checkIsbn.length == 0) {

                    //Questo prende i dati in caso non vengano cambiati
                    const resu = await collection.find({ isbn: oldIsbn }).toArray();

                    //Prendo i dati dal body    
                    //Qusto sfracco di roba serve per permettere l'omissione dei campi
                    var payload = {}
                    //Logica: payload.isbn = se c'è, isbn nel body della richiesta OPPURE se il database ha trovato 
                    // un isbn, metti quello altimenti undefined
                    payload.isbn = req.body.isbn || (resu[0] && resu[0].isbn);
                    payload.title = req.body.title || (resu[0] && resu[0].title);
                    payload.subtitle = req.body.subtitle || (resu[0] && resu[0].subtitle);
                    payload.author = req.body.author || (resu[0] && resu[0].author);
                    payload.publisher = req.body.publisher || (resu[0] && resu[0].publisher);
                    payload.pages = parseInt(req.body.pages) || (resu[0] && resu[0].pages);
                    payload.description = req.body.description || (resu[0] && resu[0].description);
                    payload.purchases = parseInt(req.body.purchases) || (resu[0] && resu[0].purchases);

                    const result = await collection.updateOne({ isbn: oldIsbn }, {
                        $set: payload
                    })

                    res.sendStatus(200)


                } else {
                    res.status(400).send("Libro gia presente nel database!")
                }

            } catch (e) {
                console.log(e)
                res.sendStatus(400)
            }

        } else {
            res.sendStatus(401)
        }
    });

}