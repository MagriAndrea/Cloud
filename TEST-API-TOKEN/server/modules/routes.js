exports.routes = (app, client, database) => {

    //INCLUDO LE ROUTES

    const userRoutes = require('./routes/users') //Richiamo i file
    const postRoutes = require('./routes/posts')
    const commentRoutes = require('./routes/comments')
    const loginRoute = require("./login")

    //INIZIALIZZO LE ROUTES

    userRoutes.users(app, client, database) //userRoutes è il file che ho richiamato, .users è la funzione che ho dichiarato in users.js
    postRoutes.posts(app, client, database)
    commentRoutes.comments(app, client, database)
    loginRoute.login(app, client, database)
}