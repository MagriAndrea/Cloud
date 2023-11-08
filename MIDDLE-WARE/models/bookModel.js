const {Schema, model} = require("mongoose")

const bookSchema = new Schema({
  isbn: { type: String, required: true, unique: true }, // Il codice identificativo del libro
  title: { type: String, required: true }, // Il titolo del libro
  subtitle: String, // Il sottotitolo del libro
  author: { type: String, required: true }, // L'autore del libro
  publisher: { type: String, required: true }, // L'editore del libro
  pages: { type: Number, required: true }, // Il numero di pagine del libro
  description: String, // La descrizione del libro
  purchases: { type: Number, default: 0 } // Il numero di acquisti del libro
});

const Book = model("book", bookSchema);

exports.Book = Book
