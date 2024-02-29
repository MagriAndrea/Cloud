exports.routes = (app, client, database) => {

    //INCLUDO LE ROUTES

    const authRoutes = require('./routes/user');

    const userRoutes = require('./routes/users');

    const postRoutes = require('./routes/posts');

    const commentRoutes = require('./routes/comments');

    //INIZIALIZZO LE ROUTES

    authRoutes.users(app, client, database);

    userRoutes.users(app, client, database);

    postRoutes.posts(app, client, database);

    commentRoutes.comments(app, client, database);

}