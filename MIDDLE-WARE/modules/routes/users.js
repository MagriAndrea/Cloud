const {getUsers, createUser, getUserByEmail, updateUser} = require("../../controllers/userController")

exports.users = (app) => {

    const auth = require('../authentication');

    //ENDPOINT DI TIPO GET che ritorna tutti gli user
    app.get('/users/get', auth.authenticate, getUsers);

    //ENDPOINT DI TIPO GET che ritorna un user in base all'email passata
    app.get("/users/get/:email", auth.authenticate, getUserByEmail)

    // //ENDPOINT POST che permette di aggiungere un user al database
    app.post("/users/add", auth.authenticate, createUser)

    //ENDPOINT DI TIPO PUT che aggiorna un documento in base a cosa è stato passato nell'header
    app.put("/users/update/:email", auth.authenticate, updateUser)

    //ENDPOINT DI TIPO DELETE che elimina il documento dell'user che fa la richiesta
    app.delete("/users/delete/:email", auth.authenticate, async (req, res) => {

        if (req.user.role == "admin") {

            try {

                const collection = await database.collection("users")

                //Prendo email che mi dice dove cancellare, da header, non da body, perchè si puo cancellare solo il proprio account, non quello degli altri
                const email = req.params.email

                const result = await collection.deleteMany({ email: email })

                if (result.deletedCount !== 0) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(404)
                }


            } catch (error) {
                console.log(error)
                res.sendStatus(400)
            }

        } else {
            res.status(401).send("Non hai il permesso di usare questo endpoint")
        }


    })


}



