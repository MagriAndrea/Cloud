exports.users = (app, client, database) => {

    const auth = require('../authentication');

    app.get('/users/get', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');
    
                const result = await collection.find({}).toArray();
    
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

    app.get('/users/get/:email', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                const result = await collection.find({ email: req.params.email }).toArray();

                if ( result.length !== 0 ) {

                    res.send(result);

                } else {

                    res.sendStatus(404);

                }

            } catch (error) {

                res.sendStatus(400);

            }

        } else {

            res.sendStatus(401);

        }

    });

    app.post('/users/add', async (req, res) => {

        try {

            const collection = database.collection('data');

            const checkUser = await collection.find({email: req.body.email}).toArray();

            if ( checkUser.length === 0 ) {

                const bcrypt = require('bcrypt');
                const saltRounds = 10;
                const myPlaintextPassword = req.body.password;

                const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);

                const userData = {

                    email: req.body.email,
                    password: hashedPassword,
                    role: req.body.role,
                    usage: {
                        latestRequestDate: new Date().toLocaleDateString(),
                        numberOfRequests: 1
                    }

                };

                if ( userData.email && userData.password && userData.role ) {

                    if ( userData.role !== 'admin' && userData.role !== 'user' ) {

                        userData.role = 'user';

                    }

                    const result = await collection.insertOne({ email: userData.email, password: userData.password, role: userData.role, usage: userData.usage });

                    res.sendStatus(200);

                } else {

                    res.sendStatus(400);

                }

            } else {

                res.sendStatus(400);

            } 

        } catch (error) {

            res.sendStatus(400);

        }

    });

    //ENDPOINT UPDATE USER

    /*app.put('/users/update', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);

        //AUTENTICO L'UTENTE

        if ( authenticate === 200 ) {

            //AUTENTICATO

            const email = req.headers['email'];

            //OPERAZIONE MONGO DB

            try {

                const password = await bcrypt.hash(req.body.password, 10);

                let role = req.body.role;

                if ( !req.body.password || !req.body.email ) {

                    res.sendStatus(400);

                } else {

                    if ( role !== 'admin' || role !== 'user' ) {

                        role = 'user';

                    }

                    const collection = database.collection('data');

                    const checkUser = await collection.updateOne({email: email}, { $set: { email: req.body.email, password: password, role: role } });

                    res.sendStatus(200);

                }

            } catch (e) {

                res.sendStatus(400);

                console.log(e);

            }

        } else {

            res.sendStatus(401);

        }

    });*/















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

    app.delete('/users/delete', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

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