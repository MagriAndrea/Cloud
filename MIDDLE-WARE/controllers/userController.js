const { User } = require("../models/userModel")

exports.getUsers = async (req, res) => {

    console.log("DEBUG:", "Chiamata funzione getUsers")

    try {
        let result = ""
        //Se viene passata l'email da cercare
        if (req.params.email) {
            result = await User.findOne({ email: req.params.email }, {password : 0}) //{password : 0} fa in modo che il campo password sia nascosto
        //Se non viene passata l'email da cercare
        } else {
            result = await User.find({}, {password : 0})
        }

        if (result.length != 0) {
            res.send(result)
            console.log("DEBUG:", "getUsers eseguita senza problemi")
        } else {
            //Se il risultato è vuoto
            res.sendStatus(404)
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }

}

exports.createUser = async (req, res) => {

    console.log("DEBUG:", "Chiamata funzione createUser")

    if (req.user.role == "admin") {

        try {
            //Guardo se sono stati inseriti i campi obbligatori
            if (req.body.email && req.body.password && req.body.role) {

                const checkUser = await User.findOne({ email: req.body.email })

                if (!checkUser) {

                    //GESTIONE PASSWORD
                    //Trasformo la passowrd in chiaro in password hashata con bcrypt
                    const bcrypt = require("bcrypt")
                    const saltRounds = 10

                    //Metto nella variabile la password hashata
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

                    //GESTIONE RUOLO
                    //Ruoli: admin o user;  se il ruolo è admin, admin, altrimenti qualunque altro ruolo inserito diventa user
                    //Uso l'operatore ternario perchè il codice è più pulito (non devo scrivere let ruolo, e poi un if che ne cambia il valori)
                    const role = req.body.role == "admin" ? "admin" : "user";

                    //Creo l'oggetto che poi inserisco dentro il database
                    const userData = {
                        email: req.body.email,
                        password: hashedPassword,
                        role: role,
                        usage: {
                            latestRequestDate: new Date().toLocaleDateString(),
                            numberOfRequests: 1
                        }
                    }

                    //Se tutto va bene allora inserisco il dato nel database
                    await User.create(userData)

                    res.sendStatus(200);

                    console.log("DEBUG:", "createUser eseguita senza problemi")

                } else {
                    res.status(400).send("Email gia registrata, scegliene un'altra!")
                }

            } else {
                res.status(400).send("Inserisci tutti i campi obbligatori!")
            }

        } catch (error) {
            console.log(error)
            res.sendStatus(400)
        }

    } else {
        res.status(401).send("Non hai il permesso di usare questo endpoint")
    }

}

exports.updateUser = async (req, res) => {

    console.log("DEBUG:", "chiamata funzione updateUser")

    const password = req.body.password

    if (password) {

        try {
            //GESTIONE PASSWORD
            const bcrypt = require("bcrypt")
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

            //Nel caso sia un admin
            if (req.user.role === "admin") {

                const newEmail = req.body.email
                const oldEmail = req.params.email

                //GESTIONE RUOLO
                const role = req.body.role == "admin" ? "admin" : "user"

                //Se sono presenti anche gli altri dati
                if (newEmail && oldEmail) {

                    //CONTROLLO UNIVOCITA' NUOVA EMAIL DA INSERIRE
                    const checkNewEmail = await User.findOne({ email: newEmail })

                    //Se la nuova email non è gia registrata
                    if (!checkNewEmail) {

                        const checkOldEmail = await User.findOne({ email: oldEmail })
                        //Se c'è un email da modificare
                        if (checkOldEmail) {

                            //Allora aggiorno
                            await User.updateOne(
                                { email: req.params.email },
                                { $set: { email: newEmail, password: hashedPassword, role: role } }
                            )

                            res.sendStatus(200)

                            console.log("DEBUG:", "updateUser di admin eseguita senza problemi")

                        } else {
                            res.status(400).send("Email da modificare non trovata")
                        }
                    } else {
                        res.status(400).send("Email gia presente nel database")
                    }
                } else {
                    res.status(400).send("Inserisci manca una email, o nuova o vecchia")
                }

                //Nel caso sia un user
            } else {

                await User.updateOne(
                    { email: req.user.email },
                    { $set: { password: hashedPassword } }
                )

                res.sendStatus(200)

                console.log("DEBUG:", "updateUser di user eseguita senza problemi")
            }
        } catch (e) {
            console.log(e)
            res.sendStatus(400)
        }
    } else {
        res.status(400).send("Inserisci la nuova password")
    }
}

exports.deleteUser = async (req, res) => {

    console.log("DEBUG:", "chiamata funzione deleteUser")

    if (req.user.role == "admin") {

        try {

            //Prendo email che mi dice dove cancellare
            const email = req.params.email

            const result = await User.deleteMany({ email: email })

            if (result.deletedCount !== 0) {
                res.sendStatus(200)
                console.log("DEBUG:", "deleteUser eseguita senza problemi")
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


}