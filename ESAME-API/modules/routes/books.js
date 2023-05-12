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
                req.query.pages ? (filter.pages = req.query.pages) : "";
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
            const pages = req.body.pages
            const description = req.body.description
            const purchases = req.body.purchases

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

                const isbn = req.params.isbn

                const resu = await collection.find({ isbn: isbn }).toArray();

                if (resu.length !== 0) {
                    
                    //Prendo i dati dal body    
                    //Qusto sfracco di roba serve per permettere l'omissione dei campi
                    var payload = {}
                    req.body.isbn ? payload.isbn = req.body.isbn : resu[0].isbn;
                    req.body.title ? payload.title = req.body.title : resu[0].title;
                    req.body.subtitle ? payload.subtitle = req.body.subtitle : resu[0].subtitle;
                    req.body.author ? payload.author = req.body.author : resu[0].author;
                    req.body.publisher ? payload.publisher = req.body.publisher : resu[0].publisher;
                    req.body.pages ? payload.pages = req.body.pages : resu[0].pages;
                    req.body.description ? payload.description = req.body.description : resu[0].description;
                    req.body.purchases ? payload.purchases = req.body.purchases : resu[0].purchases

                    const result = await collection.updateOne({ isbn: isbn }, {
                        $set: payload
                    })

                    res.sendStatus(200)
                    

                } else {
                    res.status(404).send("Libro non presente nel database!")
                }

            } catch (e) {
                console.log(e)
                res.sendStatus(400)
            }

        } else {
            res.sendStatus(401)
        }
    });

    //ENDPOINT DI TIPO DELETE che elimina il documento dell'user che fa la richiesta
    app.delete("/users/delete", async (req, res) => {
        const authenticate = await auth.authentication(client, database, req);

        if (authenticate === 200) {
            //Una volta autenticato, non serve altro per iniziare la cancellazione

            try {
                const collection = await database.collection("data");

                //Prendo email che mi dice dove cancellare, da header, non da body, perchè si puo cancellare solo il proprio account, non quello degli altri
                const email = req.headers.email;

                const result = await collection.deleteMany({ email: email });

                if (result.deletedCount !== 0) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(400);
            }
        } else {
            res.status(401);
        }
    });
};
