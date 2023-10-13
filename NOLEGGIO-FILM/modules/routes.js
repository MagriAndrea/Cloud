exports.routes = (app, client, database) => {

    //INCLUDO LE ROUTES

    const filmsRoutes = require('./routes/films') //Richiamo i file
    const rentersRoutes = require('./routes/renters')
    const loginRoute = require("./login")

    //INIZIALIZZO LE ROUTES

    filmsRoutes.films(app, client, database) //userRoutes è il file che ho richiamato, .users è la funzione che ho dichiarato in users.js
    rentersRoutes.renters(app, client, database)
    loginRoute.login(app, client, database)
}