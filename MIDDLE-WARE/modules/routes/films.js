exports.films = (app, client, database) => {
    const auth = require("../authentication"); //require svolge una funzione simile a import

    //ENDPOINT DI TIPO GET che ritorna tutti i libri
    app.get("/films/get", async (req, res) => {
        const authenticate = await auth.authentication(client, database, req);

        if (authenticate.status === 200) {
            try {
                const collection = database.collection("data");

                //Getisco parametri queryString
                let filter = {};
                //Se viene passato l'id allora aggiunti la voce id:req.query.id all oggetto filtro
                req.query.id ? (filter.isbn = req.query.id) : ""; //Metto "" se no pensa che l'else sia la riga sotto
                req.query.title ? (filter.title = req.query.title) : "";
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
    app.post("/films/add", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req)
        
        if (authenticate.status === 200 && authenticate.role === "rw") {
            
            //Prendo i dati dal body
            const id = Math.floor(100000 + Math.random() * 900000); //Da 100000 a 999999
            const title = req.body.title
            const director = req.body.director
            const duration = parseInt(req.body.duration)
            const plot = req.body.plot
            const rating = parseFloat(req.body.rating)
            const releaseDate = req.body.release_date

            if (id && title && director && duration && plot && rating && releaseDate) {

                try {

                    const collection = await database.collection("data")

                    const checkId = await collection.find({ id: id }).toArray()
                    
                    //Se non c'è gia un film con lo stesso id
                    if (checkId.length === 0) {

                        const result = await collection.insertOne({
                            id: id, title: title, director: director,
                            duration: duration, plot: plot, rating: rating, release_date: releaseDate
                        })

                        res.sendStatus(200)

                    } else {
                        res.status(400).send("Id gia registrato")
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
    app.put("/films/update", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);

        if (authenticate.status === 200 && authenticate.role === "rw") {

            try {

                const collection = await database.collection("data");

                const id = parseInt(req.query.id)

                const resu = await collection.find({ id: id }).toArray();

                //Guardo se l'id passato è presente nel database
                if (resu.length != 0) {
                    //Prendo i dati dal body    
                    //Qusto sfracco di roba serve per permettere l'omissione dei campi
                    var payload = {}
                    //Logica: payload.id = se c'è, id nel body della richiesta OPPURE se il database ha trovato qualcosa
                    payload.title = req.body.title || (resu[0] && resu[0].title);
                    payload.director = req.body.director || (resu[0] && resu[0].director);
                    payload.duration = parseInt(req.body.duration) || (resu[0] && resu[0].duration);
                    payload.plot = req.body.plot || (resu[0] && resu[0].plot);
                    payload.rating = parseFloat(req.body.rating) || (resu[0] && resu[0].rating);
                    payload.release_date = parseInt(req.body.release_date) || (resu[0] && resu[0].release_date);

                    const result = await collection.updateOne({ id: id }, {
                        $set: payload
                    })

                    res.sendStatus(200)


                } else {
                    res.status(400).send("Id non trovato nel database!")
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