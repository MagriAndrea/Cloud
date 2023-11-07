const { User } = require("../models/userModel")


exports.getUsers = async (req, res) => {

    try {
        const result = await User.find({})

        if (result.length !== 0) {
            res.send(result)
        } else {
            //Se il risultato è vuoto
            res.sendStatus(404)
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }

}

exports.getUserByEmail = async (req, res) => {

    try {
        const result = await User.findOne({ email: req.params.email })

        if (result) {
            res.send(result)
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

                const checkUser = await User.findOne({ email: req.params.email })

                if (checkUser) {

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
                            lastRequest: new Date().toLocaleDateString(),
                            numberOfRequests: 1
                        }
                    }

                    //Se tutto va bene allora inserisco il dato nel database
                    await User.save(userData)

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

            res.sendStatus(400).send("Problemi con la richiesta")
        }

    } else {
        res.status(401).send("Non hai il permesso di usare questo endpoint")
    }

}

exports.updateUser = async (req, res) => {

    console.log("DEBUG:","chiamata funzione updateUser")

    if (req.user.role == "admin") {

        if (req.body.email && req.body.password && req.body.role) {

            try {

                //CONTROLLO UNIVOCITA' EMAIL DA INSERIRE
                const email = req.body.email
                const checkUser = await User.findOne({ email: email })

                if (checkUser) {

                    //GESTIONE PASSWORD
                    const bcrypt = require("bcrypt")
                    const saltRounds = 10
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

                    //GESTIONE RUOLO
                    const role = req.body.role == "admin" ? "admin" : "user"

                    //Modifico dati del database
                    await User.updateOne(
                        { email: req.query.email },
                        { $set: { email: email, password: hashedPassword, role: role } }
                    )

                    res.sendStatus(200)

                    console.log("DEBUG:","updateUser eseguita senza problemi")

                } else {
                    res.status(400).send("Email gia registrata, prova con un altra!")
                }

            } catch (error) {
                console.log(error)
                res.sendStatus(400)
            }

        } else {
            res.status(400).send("Inserisci tutti i campi obbligatori!")
        }

    } else {
        res.status(401).send("Non hai il permesso di usare questo endpoint")
    }


}