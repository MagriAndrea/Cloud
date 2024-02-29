exports.posts = (app, client, database) => {

    const auth = require('../authentication');

    app.get('/posts/get', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                let limit = 100;

                if ( req.query.limit ) {

                    limit = req.query.limit;

                }

                let order = 'default';

                if ( req.query.order ) {

                    if ( req.query.order === 'default' || req.query.order === 'reverse' ) {

                        order = req.query.order;

                    } else {

                        order = 'default';

                    }

                }
    
                const result = await collection.find({ email: req.headers['email'] }).toArray();
    
                if ( result.length !== 0 ) {
    
                    if ( order && order === 'default' ) {

                        res.send(result[0]['posts'].slice(0, limit));

                    } else {

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

    app.get('/posts/get/:id', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');
    
                const result = await collection.find({ posts: { $elemMatch: { id: req.params.id } } }).toArray();
    
                if ( result.length !== 0 ) {

                    result[0]['posts'].forEach(element => {
                        
                        if ( element['id'] === req.params.id ) {

                            res.send(element);

                        }

                    });
    
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

    app.post('/posts/add', async (req, res) => {

        try {

            const randomId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

            const collection = database.collection('data');

            const result = await collection.updateOne({ email: req.headers['email']}, { $push:

                { posts: {

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

    });

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

                const result = await collection.updateMany({ email: req.headers['email'] }, { $pull: { posts: { id: req.params.id } } });

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