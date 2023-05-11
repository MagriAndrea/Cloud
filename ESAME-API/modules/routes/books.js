exports.books = (app, client, database) => {
  const auth = require("../authentication"); //require svolge una funzione simile a import

  //ENDPOINT DI TIPO GET che ritorna tutti i libri
  app.get("/books/get", async (req, res) => {
    const authenticate = 200; //await auth.authentication(client, database, req);

    if (authenticate === 200) {
      try {
        const collection = database.collection("data");

        //Getisco parametri queryString
        let filter = {};
        //Se viene passato l'isbn allora aggiunti la voce isbn:req.query.isbn all oggetto filtro
        req.query.isbn ? (filter.isbn = req.query.isbn) : ""; //Metto "" se no pensa che l'else sia la riga sotto
        req.query.title ? (filter.title = req.query.title) : "";
        req.query.pages ? (filter.pages = req.query.pages) : "";
        const order = req.query.order === "desc" ? "desc" : "asc";

        const result = await collection.find(filter).toArray();

        if (result.length !== 0) {

          if (order === "asc") {
            //Se il titolo del primo libro è maggiore (es. F > O, G > Y...) ritorno 1 altrimenti -1
            //Se viene ritornato 1 allora a viene dopo b; Se viene ritornato -1 allora a viene prima di b
            res.send(result.sort((a, b) => (a.title > b.title ? 1 : -1)));

          } else {
            res.send(result.sort((a, b) => (a.title > b.title ? -1 : 1)));
            
          }

        } else {
          res.sendStatus(404);
        }
      } catch (error) {
        console.log(error);
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(401);
    }
  });

  //ENDPOINT DI TIPO GET che ritorna un user in base all'email passata
  app.get("/users/get/:email", async (req, res) => {
    const authenticate = await auth.authentication(client, database, req);

    if (authenticate === 200) {
      try {
        const collection = database.collection("data");

        const result = await collection
          .find({ email: req.params.email })
          .toArray();

        if (result.length !== 0) {
          res.send(result);
        } else {
          res.sendStatus(404);
        }
      } catch (error) {
        console.log(error);

        res.sendStatus(400);
      }
    } else {
      res.sendStatus(401);
    }
  });

  // //ENDPOINT POST che permette di aggiungere un libri al database
  app.post("/users/add", async (req, res) => {
    try {
      if (req.body.email && req.body.password && req.body.role) {
        const collection = await database.collection("data");

        const checkUser = await collection
          .find({ email: req.body.email })
          .toArray();

        if (checkUser.length == 0) {
          //GESTIONE PASSWORD
          //Trasformo la passowrd in chiaro in password hashata con bcrypt
          const bcrypt = require("bcrypt");
          const saltRounds = 10;

          //Metto nella variabile la password hashata
          const hashedPassword = await bcrypt.hash(
            req.body.password,
            saltRounds
          );

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
              numberOfRequests: 1,
            },
          };

          //Se tutto va bene allora inserisco il dato nel database
          const result = await collection.insertOne({
            email: userData.email,
            password: userData.password,
            role: userData.role,
            usage: userData.usage,
          });

          res.sendStatus(200);
        } else {
          res.status(400).send("Email gia registrata, scegliene un'altra!");
        }
      } else {
        res.status(400).send("Inserisci tutti i campi obbligatori!");
      }
    } catch (error) {
      console.log(error);

      res.sendStatus(400).send("Problemi con la richiesta");
    }
  });

  //ENDPOINT DI TIPO PUT che aggiorna un documento in base a cosa è stato passato nell'header
  app.put("/users/update", async (req, res) => {
    const authenticate = await auth.authentication(client, database, req);

    if (authenticate === 200) {
      //VERIFICA DATI
      if (req.body.email && req.body.password && req.body.role) {
        try {
          const collection = await database.collection("data");

          //CONTROLLO UNIVOCITA' EMAIL DA INSERIRE
          const email = req.body.email;
          const checkUser = await collection.find({ email: email }).toArray();

          if (checkUser.length == 0) {
            //GESTIONE PASSWORD
            const bcrypt = require("bcrypt");
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
              req.body.password,
              saltRounds
            );

            //GESTIONE RUOLO
            const role = req.body.role == "admin" ? "admin" : "user";

            //Modifico dati del database
            const result = await collection.updateOne(
              { email: req.headers.email }, //Qui specifico l'email passata nella header perchè mi serve per indicare quale documento modificare
              { $set: { email: email, password: hashedPassword, role: role } }
            ); //Qua sotto specifico l'email presa dal body, nel caso voglia cambiare l'email

            res.sendStatus(200);
          } else {
            res.status(400).send("Email gia registrata, prova con un altra!");
          }
        } catch (error) {
          console.log(error);
          res.sendStatus(400);
        }
      } else {
        res.status(400).send("Inserisci tutti i campi obbligatori!");
      }
    } else {
      res.status(401);
    }
  });

  //ENDPOINT DI TIPO DELETE che elimina il documento dell'user che fa la richiesta
  app.delete("/users/delete", async (req, res) => {
    const authenticate = await auth.authentication(client, database, req);

    if (authenticate === 200) {
      //Una volta autenticato, non serve altro per iniziare la cancellazione

      try {
        const collection = await database.collection("data");

        //Prendo email che mi dice dove cancellare, da header, non da body, perchè si puo cancellare solo il proprio account, non quello degli altri
        const email = req.headers.email;

        const result = await collection.deleteMany({ email: email });

        if (result.deletedCount !== 0) {
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      } catch (error) {
        console.log(error);
        res.sendStatus(400);
      }
    } else {
      res.status(401);
    }
  });
};
