import { useFetch } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { TextInput, Table, Group, Text, Button, Container, Space, Tooltip, Divider, Loader, Popover, Stack } from "@mantine/core";
import { useMantineTheme } from '@mantine/core'

//Icone
import { BsTrash3 } from "react-icons/bs";
import { FaEdit, FaRedo } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { IoMdAdd, IoMdSad } from "react-icons/io";

import.meta.env.VITE_API_BASE_URL //Non va

const ClientList = () => {
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useMantineTheme()

  //UseFetch si occupa di fare il primo fetch e in caso di refetch si usa la funzione refetch
  const { data, loading, error, refetch, abort } = useFetch(`http://localhost:3000/users`);

  //Funzione che serve per filtrare su tutti i campi di un oggetto
  const anyKeyFilter = item => obj =>
    Object.values(obj).some(value =>
      String(value).toLowerCase().includes(item)
    );

  //Ogni volta che viene aggiornato il termine di ricerca, filtro
  useEffect(() => {
    const filtered = data?.filter(anyKeyFilter(searchTerm.toLowerCase()));
    setFilteredClients(filtered);
  }, [searchTerm, data]);

  //Generazione righe della tabella
  const rows = filteredClients?.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.nome}</Table.Td>
      <Table.Td>{element.cognome}</Table.Td>
      <Table.Td>{element.eta}</Table.Td>
      <Table.Td>
        <Group gap={5}>
          <Popover withArrow arrowPosition="side" arrowOffset={5} arrowSize={5} position="top" offset={2}>
            <Popover.Target>
              <Tooltip label="Elimina">
                <Button variant="default" c="deleteButtonRed"> <BsTrash3 /> </Button>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack>
                <Text size="xs" align='center'>
                  Confermi l'eleminazione?
                </Text>
                <Button>
                  Conferma
                </Button>
              </Stack>
            </Popover.Dropdown>
          </Popover>

          <Tooltip label="Modifica">
            <Button variant="default" c='editButtonGreen'> <FaEdit /> </Button>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container fluid>

      {/* Casella per la ricerca */}
      <Group justify="">
        <TextInput
          label="Cerca"
          placeholder="Inserisci termine di ricerca"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
      </Group>

      {/* Spazi ed errori */}
      <Space h="xl" />
      {error && <><Text c="red">{error.message}</Text><Space h="xl" /></>}
      <Divider />
      <Space h="xl" />

      <Group justify="space-between">
        {/* Bottoni refetch e abort */}
        <Group>
          <Tooltip label="Refresh">
            <Button variant="default" onClick={() => { refetch() }}> <FaRedo /> </Button>
          </Tooltip>
          <Tooltip label="Annulla">
            <Button variant="default" disabled={loading ? false : true} onClick={() => { abort() }}> <ImCancelCircle /> </Button>
          </Tooltip>
          {loading ? <Loader color="blue" type="dots" /> : ""}
        </Group>
        <Group>
          <Button leftSection={<IoMdAdd size={20} />}>Aggiungi Nuovo</Button>
        </Group>
      </Group>

      <Space h="xl" />

      {/* Tabella con i dati */}
      <Group justify="center">
        <Table striped highlightOnHover withColumnBorders stickyHeader stickyHeaderOffset={60} >
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
          <Table.Tbody>
            {rows}
          </Table.Tbody>
        </Table>
      </Group>
    </Container>
  );
};

export default ClientList;
