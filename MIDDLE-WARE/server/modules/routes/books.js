const {getBooks, createBook, updateBook, deleteBook} = require("../../controllers/bookController")

exports.books = (app) => {

    const auth = require('../authentication');

    //ENDPOINT DI TIPO GET 
    app.get("/books/get/:isbn?", auth.authenticate, getBooks)

    //ENDPOINT POST
    app.post("/books/add", auth.authenticate, createBook)

    //ENDPOINT DI TIPO PUT
    app.put("/books/update/:isbn?", auth.authenticate, updateBook)

    //ENDPOINT DI TIPO DELETE
    app.delete("/books/delete/:isbn", auth.authenticate, deleteBook)


}



