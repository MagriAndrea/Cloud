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
    <Table striped highlightOnHover withColumnBorders>
      {/* {...rows} */}
    </Table>
  );
};

export default ClientList;
