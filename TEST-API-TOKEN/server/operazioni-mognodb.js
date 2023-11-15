//Questo file è solo un esempio per mostrare alcuni comandi, non fa parte del progetto

//INCLUDO IL MODULO

const { MongoClient } = require('mongodb');

//CONNETTO AL SERVER LOCALE

const uri = 'mongodb://127.0.0.1:27017'; //URL DELLA CONNESSIONE LOCALE (STESSA USATA IN MONGO DB COMPASS)

const client = new MongoClient(uri); //CREO LA CONNESSIONE AL SERVER PASSANDO L'URL INDICATO SOPRA

const database = client.db('node_api'); //SELEZIONO IL DATABASE DESIDERATO UTILIZZANDO LA CONNESSIONE CREATA SOPRA

//OPERAZIONI

const collection = database.collection('data'); //SELEZIONO LA COLLEZIONE

//Non mettere .toArray() alla fine, questo è solo un inserimento
const insertResult = await collection.insertOne({ first_name: firstName, last_name: lastName, email: email, password: password }); //AGGIUNGO I VALORI SELEZIONATI COME DOCUMENTO (DA INSERIRE IN FUNZIONE ASYNC)

const findResult = await collection.find({}); //SELEZIONO TUTTI I DOCUMENTI DELLA COLLEZIONE SELEZIONATA (DA INSERIRE IN FUNZIONE ASYNC)

const findSpecificResult = await collection.find({ email: email }); //SELEZIONO UNO SPECIFICO DOCUMENTO FILTRANDO PER CHIAVE E VALORE NELLA COLLEZIONE SELEZIONATA (DA INSERIRE IN FUNZIONE ASYNC)

const updateResult = await collection.updateOne({ email: email }, { $set: { password: password } }); //AGGIORNO UNO (O PIU') VALORE/I DOVE UNA DETERMINATA CHIAVE CORRISPONDE A QUANTO INDICATO (DA INSERIRE IN FUNZIONE ASYNC)

const deleteResult = await collection.deleteMany({ email: email }); //ELIMINO UNO SPECIFICO DOCUMENTO (DA INSERIRE IN FUNZIONE ASYNC)