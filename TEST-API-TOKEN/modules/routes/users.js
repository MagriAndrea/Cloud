exports.users = (app, client, database) => {

    const auth = require('../authentication'); //require svolge una funzione simile a import

    //ENDPOINT DI TIPO GET che ritorna tutti gli user
    app.get('/users/get', async (req, res) => { // '/users/get --> users = risorsa, get = metodo, questa è solo una convenzione

        //Passiamo ad auth.authentication le variabili necessarie, req serve perchè 
        const authenticate = await auth.authentication(client, database, req);
        //nell header della richiesta troviamo email e password
        
        //Facciamo in modo che auth.authenticate ritorni 200(ok) o 401(Unauthorized) in base a come è andata la richiesta
        if ( authenticate === 200 ) {

            try {

                //Prendo il riferimento alla collection data (non copia in memoria la collezione ma solo un riferimento di dove si trova)
                const collection = database.collection('data');
                
                //Collection.find({}) ritorna l'intero contenuto della collection
                //Specifico to.Array() perchè find non ritorna tutto il contenuto della collection ma un cursore (simile a come facevano in java con il ResultSet)
                //.toArray() è una funzione di questo cursore che ritorna tutto il contenuto dentro un array [{ogg1}, {ogg2},...]
                const result = await collection.find({}).toArray();
                
                //Di conseguenza result è un array di oggeti, posso facilmente vedere se il contenuto è maggiore di 0 verificando la proprietà .length
                if ( result.length !== 0 ) {
                    
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

        } else {
            //Se auth non ritorna 200, vuol dire che ha ritornato 401
            res.sendStatus(401);

        }

    });

    //ENDPOINT DI TIPO GET che ritorna un user in base all'email passata
    app.get("/users/get/:email", async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);

        //Una volta autenticato
        if (authenticate === 200) {

            try {
                
                const collection = database.collection("data")
                //Metto nella variabile result il risultato della query
                const result = await collection.find({email:req.params.email}).toArray();
                
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
        } else {
            //Se non autenticato, ritorna 401 cioè forbidden
            res.sendStatus(401)
        }

    })

    // //ENDPOINT POST che permette di aggiungere un user al database
    app.post("/users/add", async (req, res) => {
        
        try {
            //Guardo se sono stati inseriti i campi obbligatori
            if (req.body.email && req.body.password && req.body.role) {
                
                //Prendo la collection dal database
                const collection = await database.collection("data");

                //GESTIONE EMAIL
                //L'email deve essere univoca
                const checkUser = await collection.find({email: req.body.email}).toArray();
                
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
                    const result = await collection.insertOne({email: userData.email, password: userData.password, role: userData.role, usage: userData.usage})

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

    })

    //ENDPOINT DI TIPO PUT che aggiorna un documento in base a cosa è stato passato nell'header
    app.put("/users/update", async (req, res) => {
        
        const authenticate = await auth.authentication(client, database, req);

        if (authenticate === 200) {

            //VERIFICA DATI
            if (req.body.email && req.body.password && req.body.role) {

                try {

                    const collection = await database.collection("data")
                    
                    //CONTROLLO UNIVOCITA' EMAIL DA INSERIRE
                    const email = req.body.email
                    const checkUser = await collection.find({email:email}).toArray();

                    if (checkUser.length == 0) {

                        //GESTIONE PASSWORD
                        const bcrypt = require("bcrypt")
                        const saltRounds = 10
                        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

                        //GESTIONE RUOLO
                        const role = req.body.role == "admin" ? "admin" : "user"

                        //Modifico dati del database
                        const result = await collection.updateOne(
                            {email: req.headers.email}, //Qui specifico l'email passata nella header perchè mi serve per indicare quale documento modificare
                            { $set: {email:email, password:hashedPassword, role:role}}
                            ) //Qua sotto specifico l'email presa dal body, nel caso voglia cambiare l'email

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
            res.status(401)
        }
    })

    //ENDPOINT DI TIPO DELETE che elimina il documento dell'user che fa la richiesta
    app.delete("/users/delete", async (req, res) => {
            
        const authenticate = await auth.authentication(client, database, req);

        if (authenticate === 200) {

            //Una volta autenticato, non serve altro per iniziare la cancellazione

            try {

                const collection = await database.collection("data")
                
                //Prendo email che mi dice dove cancellare, da header, non da body, perchè si puo cancellare solo il proprio account, non quello degli altri
                const email = req.headers.email

                const result = await collection.deleteMany({email:email})
                
                if (result.deletedCount !== 0 ) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(404)
                }

                    
            } catch (error) {
                console.log(error)
                res.sendStatus(400)
            } 


        } else {
            res.status(401)
        }
    })
    

}



