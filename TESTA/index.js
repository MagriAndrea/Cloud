const express = require("express")
const app = express()

//GET(Leggo) POST(Scrivo) PUT(Modifico) DELETE(Elimino)

app.post("/", (req, res) => {
    res.send("Home Page")
})

app.get("/test/:id?", (req, res) => {
    res.send(req.params.id)
})

/*
REQUEST: Parametri (selezione), metodo (tipologia di azione), body (invio dati), headers (autenticazione), cookie (di tutto), query string (filtro)
RESPONSE: status code (stato del server), body (info richieste), headers (autenticazione), cookie (di tutto)

STATUS CODES famosi: 200, 400, 401, 404, 500
*/

app.listen(4000, () => {
    console.log("Il server è stato avviato su porta 4000")
})

