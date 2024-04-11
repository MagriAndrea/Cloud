import { useState, useEffect } from 'react';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    //fetch api
  }, []);

  useEffect(() => {
    // Filter books based on search term
    const filtered = books.filter((book) =>
      book.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.cognome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [books, searchTerm]);

  return (
    <div>
      <h2>LISTA LIBRI</h2>
      <input
        type="text"
        placeholder="Ricerca per nome"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredBooks.map((book) => (
          <li key={book.isbn}>
            {book.nome} {book.cognome} (Age: {client.eta})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
