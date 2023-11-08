const { Book } = require("../models/bookModel")

exports.getBooks = async (req, res) => {

    console.log("DEBUG:", "Chiamata funzione getBooks")

    try {

        //Getisco parametri queryString
        let filter = {};
        //Se viene passato l'isbn allora aggiunti la voce isbn:req.query.isbn all oggetto filtro
        req.query.isbn ? (filter.isbn = req.query.isbn) : ""; //Metto "" se no pensa che l'else sia la riga sotto
        req.query.title ? (filter.title = req.query.title) : "";
        req.query.pages ? (filter.pages = parseInt(req.query.pages)) : ""; //parseInt perchè pages:"352" non è considerato numero
        const order = req.query.order === "desc" ? "desc" : "asc";

        result = await Book.find(filter)

        if (result.length != 0) {
            if (order === "asc") {
                //Se il titolo del primo libro è maggiore (es. F > O, G > Y...) ritorno 1 altrimenti -1
                //Se viene ritornato 1 allora a viene dopo b; Se viene ritornato -1 allora a viene prima di b
                res.send(result.sort((a, b) => (a.title > b.title ? 1 : -1)));
                console.log("DEBUG:", "getBooks eseguita senza problemi")
            } else {
                res.send(result.sort((a, b) => (a.title > b.title ? -1 : 1)));
                console.log("DEBUG:", "getBooks eseguita senza problemi")
            }

        } else {
            //Se il risultato è vuoto
            res.sendStatus(404)
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }

}

exports.createBook = async (req, res) => {
    if (req.user.role == "admin") {
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

                const checkIsbn = await Book.findOne({ isbn: isbn })

                if (!checkIsbn) {

                    await Book.create({
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
        res.status(401).send("Non hai il permesso di usare questo endpoint")
    }
}

exports.updateBook = async (req, res) => {

    if (req.user.role == "admin") {

        try {

            const newIsbn = req.body.isbn
            const oldIsbn = req.params.isbn

            const checkIsbn = await Book.findOne({ isbn: newIsbn })

            if (!checkIsbn) {

                //Questo prende i dati in caso non vengano cambiati
                const resu = await Book.findOne({ isbn: oldIsbn })

                //Prendo i dati dal body    
                //Qusto sfracco di roba serve per permettere l'omissione dei campi
                var payload = {}
                //Logica: payload.isbn = se c'è, isbn nel body della richiesta OPPURE se il database ha trovato 
                // un isbn, metti quello altimenti undefined
                payload.isbn = req.body.isbn || (resu && resu.isbn);
                payload.title = req.body.title || (resu && resu.title);
                payload.subtitle = req.body.subtitle || (resu && resu.subtitle);
                payload.author = req.body.author || (resu && resu.author);
                payload.publisher = req.body.publisher || (resu && resu.publisher);
                payload.pages = parseInt(req.body.pages) || (resu && resu.pages);
                payload.description = req.body.description || (resu && resu.description);
                payload.purchases = parseInt(req.body.purchases) || (resu && resu.purchases);

                const result = await Book.updateOne({ isbn: oldIsbn }, {
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
        res.status(401).send("Non hai il permesso di usare questo endpoint")
    }
}

exports.deleteBook = async (req, res) => {

    console.log("DEBUG:", "chiamata funzione deleteBook")

    if (req.user.role == "admin") {

        try {

            //Prendo email che mi dice dove cancellare
            const isbn = req.params.isbn

            const result = await Book.deleteMany({ isbn: isbn })

            if (result.deletedCount !== 0) {
                res.sendStatus(200)
                console.log("DEBUG:", "deleteBook eseguita senza problemi")
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

}
