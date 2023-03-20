exports.users = (app, client, database) => {

    const auth = require('../authentication'); //require svolge una funzione simile a import

    //ENDPOINT DI TIPO GET che ritorna tutti gli user
    app.get('/users/get', async (req, res) => {

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
    
            } catch (error) { //Se c'è qualche errore

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
    app.get('/users/get/:email', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                //Ora però devo passare un parametro cioè la email
                const result = await collection.find({ email: req.params.email }).toArray();

                if ( result.length !== 0 ) {

                    res.send(result);

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

    //ENDPOINT POST che permette di aggiungere un user al database
    app.post('/users/add', async (req, res) => {
        //Quando si effettua un post, ciò che si vuole postare si trova dentro il body

        try {

            const collection = database.collection('data');

            //Controllo che non esista gia l'utente inserito
            const checkUser = await collection.find({email: req.body.email}).toArray();

            //Se l'utente non è gia nel database
            if ( checkUser.length === 0 ) {

                //Prendo il necessario per effettuare il confrono della password hashata e password in chiaro
                const bcrypt = require('bcrypt');
                const saltRounds = 10;
                const myPlaintextPassword = req.body.password;

                //Si usa await perchè bycript.hash, nonostante non sia niente che centra con il database, ritorna una promise
                //Ora traduco la password in chiaro, in passoword hashata in modo che non sia visibile (leggibile, più che altro) nel database
                const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);

                //Creo l'oggetto che viene poi inserito nel database; traduco l'oggeto passato dalla richiesta in un oggetto che va bene nel database
                const userData = {

                    email: req.body.email,
                    password: hashedPassword,
                    role: req.body.role,
                    usage: {
                        //L'ultima richiesta è chiaramente stata effettuata quando è stato creato l'oggetto
                        latestRequestDate: new Date().toLocaleDateString(), 
                        //Giustamente è stata fatta solo una richiesta, quella di creare il documento (record)
                        numberOfRequests: 1
                    }

                };

                //Usiamo la funzione di javascript truty; le stringhe, qualuque siano, vengono valutate come true, se sono vuote (""), vengono valutate come false 
                if ( userData.email && userData.password && userData.role ) {

                    //Forzatura del ruolo, o admin o user, qualunque altra opzione viene convertita in "user"
                    if ( userData.role !== 'admin' && userData.role !== 'user' ) {

                        userData.role = 'user';

                    }

                    //InsertOne crea un documento, e inserisce la varie proprietà
                    const result = await collection.insertOne({ email: userData.email, password: userData.password, role: userData.role, usage: userData.usage });

                    //Faccio capire a chi ha chiamato l'endpoint che l'operazione è stata svolta con successo
                    res.sendStatus(200);

                } else {

                    //Ritorno che la richiesta è stata fatta male
                    res.sendStatus(400);

                }

            } else {

                res.sendStatus(400);

            } 

        } catch (error) {

            res.sendStatus(400);

        }

    });

    //ENDPOINT DI TIPO PUT che aggiorna un documento in base a cosa è stato passato nell'header
    app.put('/users/update', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                if ( req.body.email && req.body.password && req.body.role ) {

                    if ( req.body.role !== 'admin' && req.body.role !== 'user' ) {

                        req.body.role = 'user';

                    }

                    const bcrypt = require('bcrypt');
                    const saltRounds = 10;
                    const myPlaintextPassword = req.body.password;

                    const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);

                    //In update bisogna specificare quale documento aggiornare
                    const result = await collection.updateOne({ email: req.headers['email'] }, { $set: { email: req.body.email, password: hashedPassword, role: req.body.role } });

                    res.sendStatus(200);

                } else {

                    res.sendStatus(400);

                }
    
            } catch (error) {

                console.log(error)
    
                res.sendStatus(400);
    
            }

        } else {

            res.sendStatus(401);

        }

    });
    //ENDPOINT DI TIPO DELETE che elimina tutti i documenti appartenenti all'user autenticato
    app.delete('/users/delete', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                //DeleteMany cancella l'intero documento in cui trova tale email
                const result = await collection.deleteMany({ email: req.headers['email'] });

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