const {User} = require("../models/userModel")

exports.createUser = async (req, res) => {

    if (req.user.role == "admin") {

        try {
            //Guardo se sono stati inseriti i campi obbligatori
            if (req.body.email && req.body.password && req.body.role) {

                const checkUser = await getUser({email: req.params.email})

                if (checkUser.length != 0) {

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
                    createUser(userData)

                    res.sendStatus(200);

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

exports.getUsers = async (req, res) => {

    try {
        const result = await User.find({})
        
        if (result.length !== 0) {
            res.send(result)
        } else {
            //Se il risultato è vuoto
            res.sendStatus(404)
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }

}