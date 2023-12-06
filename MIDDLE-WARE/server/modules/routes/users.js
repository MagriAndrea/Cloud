const {getUsers, createUser, getUserByEmail, updateUser, deleteUser} = require("../../controllers/userController")

exports.users = (app) => {

    const auth = require('../authentication');

    //ENDPOINT DI TIPO GET che ritorna un user in base all'email passata o tutti gli user
    app.get("/users/get/:email?", auth.authenticate, getUsers)

    //ENDPOINT POST che permette di aggiungere un user al database
    app.post("/users/add", auth.authenticate, createUser)

    //ENDPOINT DI TIPO PUT che aggiorna un documento in base a cosa è stato passato nell'header
    app.put("/users/update/:email?", auth.authenticate, updateUser)

    //ENDPOINT DI TIPO DELETE che elimina il documento dell'user che fa la richiesta
    app.delete("/users/delete/:email", auth.authenticate, deleteUser)


}



