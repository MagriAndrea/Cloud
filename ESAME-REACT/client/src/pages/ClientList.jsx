import { useState, useEffect } from 'react';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    //fetch api
  }, []);

  useEffect(() => {
    // Filter clients based on search term
    const filtered = clients.filter((client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cognome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  return (
    <div>
      <h2>LISTA CLIENTI</h2>
      <input
        type="text"
        placeholder="Ricerca per nome"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredClients.map((client) => (
          <li key={client.id}>
            {client.nome} {client.cognome} (Age: {client.eta})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
