import { useFetch } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { TextInput, Table } from '@mantine/core';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error, refetch, abort } = useFetch()

  useEffect(() => {

  }, []);

  useEffect(() => {
    // Filter clients based on search term
    const filtered = clients.filter((client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cognome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  //TODO
  //Guarda componenti per search, 
  //usa useFetch e guarda come implementarlo

  return (
    <>
      {error && <Text c="red">{error.message}</Text>}

      <TextInput
        label="Inserisci nome o cognome"
        placeholder="Nome... Cognome..."
      />

      <Table striped highlightOnHover withColumnBorders>

      </Table>
    </>
  );
};

export default ClientList;
