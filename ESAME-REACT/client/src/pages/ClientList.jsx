import { useFetch,useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { TextInput, Table, Group, Text, Button, Container, Space, Tooltip, Divider, Loader, Popover, Stack, Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import axios from 'axios'

//Icone
import { BsTrash3 } from "react-icons/bs";
import { FaEdit, FaRedo } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { FaBookOpen } from "react-icons/fa6";

import.meta.env.VITE_API_BASE_URL //Non va

const ClientList = () => {
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

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

  //Eliminazione record
  const elimina = (id) => {
    axios.delete(`http://localhost:3000/users/${id}`).then((response) => (response))
    setFilteredClients(filteredClients.filter((client) => {
      return client.id != id
    }))
    //Dovrebbe uscire la notifica ma boh non va
    notifications.show({
      title: "DELETE",
      message: "Riga eliminata con successo!",
      color: "deleteButtonRed"
    })

  }

  //Dettagli
  const dettagli = (id) => {
    if (id) {
      navigate(`/clientdetail/${id}`)
    } else {
      navigate(`/clientdetail`)
    }
  }

  //Libri
  const libri = (id) => {
    navigate(`/booklist/${id}`)
  }

  //Generazione righe della tabella
  const rows = filteredClients?.map((client) => (
    <Table.Tr key={client.id}>
      <Table.Td>{client.id}</Table.Td>
      <Table.Td>{client.email}</Table.Td>
      <Table.Td>{client.nome}</Table.Td>
      <Table.Td>{client.cognome}</Table.Td>
      <Table.Td>{client.eta}</Table.Td>
      <Table.Td>
        {/* Sezione azioni */}
        <Group gap={5} justify="space-evenly">

          {/* Pulsante mostra libri cliente */}
          <Tooltip label="Libri">
            <Button variant="default" c='zoomButtonBlue' onClick={() => { libri(client.id) }}> <FaBookOpen /> </Button>
          </Tooltip>

          {/* Pulsante modifica */}
          <Tooltip label="Modifica">
            <Button variant="default" c='editButtonGreen' onClick={() => { dettagli(client.id) }}> <FaEdit /> </Button>
          </Tooltip>

          {/* Pulsante cancella con popover di conferma */}
          <Popover withArrow arrowPosition="side" arrowOffset={5} arrowSize={5} position="top" offset={2}>
            <Popover.Target>
              <Tooltip label="Elimina">
                <Button variant="default" c="deleteButtonRed"> <BsTrash3 /> </Button>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack>
                <Text size="xs" align='center'>
                  Confermi l'eliminazione?
                </Text>
                <Button onClick={() => { elimina(client.id)}}>
                  Conferma
                </Button>
              </Stack>
            </Popover.Dropdown>
          </Popover>

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
      {/* Non posso crederci che error lo devo gestire io altrimenti rimane sempre valorizzato anche dopo che data é ritornato dalla fetch */}
      {!data && error && <><Text c="red">{error.message}</Text><Space h="xl" /></>}
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
          <Button leftSection={<IoMdAdd size={20} />} onClick={() => {dettagli()}}>Nuovo Cliente</Button>
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
      {/* Lascio dello spazio per far in modo che le notifiche non si posizionino sopra i bottoni */}
      <Space h="xl" />
      <Space h="xl" />
    </Container>
  );
};

export default ClientList;
