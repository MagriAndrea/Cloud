import { useFetch } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { TextInput, Table, Group, Text, LoadingOverlay, Center} from "@mantine/core";
import.meta.env.VITE_API_BASE_URL //Non va

const ClientList = () => {
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  //UseFetch si occupa di fare il primo fetch e in caso di refetch si usa la funzione refetch
  const { data, loading, error, refetch, abort } = useFetch(`http://localhost:3000/users`);
  
  //Funzione che serve per filtrare su qualunque campo di un oggetto
  const anyKeyFilter = item => obj =>
  Object.values(obj).some(value =>
    String(value).toLowerCase().includes(item)
  );

useEffect(() => {
  const filtered = data?.filter(anyKeyFilter(searchTerm.toLowerCase()));
  setFilteredClients(filtered);
}, [searchTerm, data]);
  

  const rows = filteredClients?.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.nome}</Table.Td>
      <Table.Td>{element.cognome}</Table.Td>
      <Table.Td>{element.eta}</Table.Td>
      <Table.Td></Table.Td>
    </Table.Tr>
  ));

  return (
    <Group>
      
      <Group>
        <TextInput
          label="Cerca"
          placeholder="Inserisci termine di ricerca"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
      </Group>
      
      {error && <Text c="red">{error.message}</Text>}

      <Group justify="center">
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>EMAIL</Table.Th>
              <Table.Th>NOME</Table.Th>
              <Table.Th>COGNOME</Table.Th>
              <Table.Th>ETA</Table.Th>
              <Table.Th>AZIONI</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}/>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Group>
    </Group>
  );
};

export default ClientList;
