exports.routes = (app, client, database) => {

    //INCLUDO LE ROUTES

    const bookRoutes = require('./routes/books') //Richiamo i file
    const buyerRoutes = require('./routes/buyers')
    const loginRoute = require("./login")

    //INIZIALIZZO LE ROUTES

    bookRoutes.books(app, client, database) //userRoutes è il file che ho richiamato, .users è la funzione che ho dichiarato in users.js
    buyerRoutes.buyers(app, client, database)
    loginRoute.login(app, client, database)
}