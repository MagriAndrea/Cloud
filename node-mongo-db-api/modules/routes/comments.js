exports.comments = (app, client, database) => {

    const auth = require('../authentication');

    app.get('/posts/:post_id/comments/get', async (req, res) => {

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
    
                const result = await collection.find({ email: req.headers['email'], 'posts.id': req.params.post_id }).toArray();

                if ( result.length !== 0 ) {

                    result[0]['posts'].forEach((element) => {

                        if ( element.id == req.params.post_id ) {

                            if ( order && order === 'default' ) {

                                res.send(element['comments'].slice(0, limit));
        
                            } else {
        
                                res.send(element['comments'].slice(0, limit).reverse());
        
                            }

                        }

                    });
    
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

    app.get('/posts/:post_id/comments/get/:id', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');
    
                const result = await collection.find({ email: req.headers['email'], posts: { $elemMatch: { id: req.params.post_id } }, 'posts.comments': { $elemMatch: { id: req.params.id } } }).toArray();
    
                if ( result.length !== 0 ) {

                    result[0]['posts'].forEach((element) => {

                        if ( element['id'] === req.params.post_id ) {

                            element['comments'].forEach((elem) => {

                                if ( elem['id'] === req.params.id ) {

                                    res.send(elem);

                                }

                            });

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

    app.post('/posts/:post_id/comments/add', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const randomId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

                const collection = database.collection('data');

                const result = await collection.updateOne({ email: req.headers['email'], 'posts.id': req.params.post_id}, { $push:

                    { 'posts.$.comments': {

                        id: randomId,
                        content: req.body.content

                    } }
                
                });

                res.sendStatus(200);

            } catch (error) {

                console.log(error);

                res.sendStatus(400);

            }

        } else {

            res.sendStatus(401);

        }

    });

    app.put('/posts/:post_id/comments/update/:id', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                const result = await collection.updateOne({ email: req.headers['email'], 'posts.id': req.params.post_id, 'posts.comments.id': req.params.id }, { $set: { 'posts.$.comments.0.content': req.body.content } });

                res.sendStatus(200);
    
            } catch (error) {

                console.log(error)
    
                res.sendStatus(400);
    
            }

        } else {

            res.sendStatus(401);

        }

    });

    app.delete('/posts/:post_id/comments/delete/:id', async (req, res) => {

        const authenticate = await auth.authentication(client, database, req);
        
        if ( authenticate === 200 ) {

            try {

                const collection = database.collection('data');

                const result = await collection.updateMany({ email: req.headers['email'], 'posts.id': req.params.post_id, 'posts.comments.id': req.params.id }, { $pull: { 'posts.$.comments': { id: req.params.id } } });

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