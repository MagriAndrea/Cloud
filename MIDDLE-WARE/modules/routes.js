exports.routes = (app, client, database) => {

    //INCLUDO LE ROUTES

    const usersRoutes = require('./routes/users') //Richiamo i file
    const loginRoute = require("./login")
    const logoutRoute = require("./logout")
    const refershRoutes = require("./refresh")

    //INIZIALIZZO LE ROUTES

    usersRoutes.users(app, client, database) //userRoutes è il file che ho richiamato, .users è la funzione che ho dichiarato in users.js
    loginRoute.login(app, client, database)
    refershRoutes.refresh(app, client, database)
    logoutRoute.logout(app, client, database)
}