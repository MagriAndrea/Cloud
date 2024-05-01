import { useFetch } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { TextInput, Table, Group, Text, Button, Container, Space, Tooltip, Divider, Loader, Popover, Stack } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import axios from 'axios'

//Icone
import { BsTrash3 } from "react-icons/bs";
import { FaEdit, FaRedo } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { IoMdAdd, IoIosArrowBack } from "react-icons/io";

import.meta.env.VITE_API_BASE_URL //Non va



const BookList = () => {
  const { showClientId } = useParams()
  const { selectClientId } = useParams()
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //UseFetch si occupa di fare il primo fetch e in caso di refetch si usa la funzione refetch
  const { data, loading, error, refetch, abort } = useFetch(`http://localhost:3000/books`);

  //Funzione che serve per filtrare su tutti i campi di un oggetto
  const anyKeyFilter = item => obj =>
    Object.values(obj).some(value =>
      String(value).toLowerCase().includes(item)
    );

  //Ogni volta che viene aggiornato il termine di ricerca, filtro
  useEffect(() => {
    let filtered = data?.filter(anyKeyFilter(searchTerm.toLowerCase()));
    if (showClientId) {
      filtered = filtered?.filter((book) => (book.acquirenti?.includes(showClientId)))
    } else if (selectClientId) {
      filtered = filtered?.filter((book) => (!book.acquirenti?.includes(selectClientId)))
    }
    setFilteredBooks(filtered);
  }, [searchTerm, data]);

  //Eliminazione record
  const elimina = (id) => {
    axios.delete(`http://localhost:3000/books/${id}`).then((response) => (response))
    setFilteredBooks(filteredBooks.filter((book) => {
      return book.id != id
    }))
    //Dovrebbe uscire la notifica ma boh non va
    notifications.show({
      title: "DELETE",
      message: "Riga eliminata con successo!",
      color: "deleteButtonRed"
    })

  }


  //Modifica
  const navigate = useNavigate()
  const dettagli = (id) => {
    if (id) {
      navigate(`/bookdetail/${id}`)
    } else {
      navigate(`/bookdetail`)
    }
  }

  const eliminaClienteDaAcquirenti = (book) => {
    //Toglo id del cliente dall array acquirenti
    book.acquirenti = book.acquirenti?.filter((buyerId) => buyerId !== showClientId);

    //Aggiorno il libro con il nuovo array di acquirenti filtrato
    axios.put(`http://localhost:3000/books/${book.id}`, book)
      .then((response) => {
        if (response.status === 200) {
          notifications.show({
            title: "PUT",
            message: `Record del libro con ID ${book.id} aggiornato con successo!`,
            color: "deleteButtonRed"
          });
          setFilteredBooks(filteredBooks.filter((bok) => {
            return bok.id != book.id
          }))
        }
      })
      .catch(() => {
        notifications.show({
          title: "Errore",
          message: `Non è stato possibile aggiornare il record del libro con ID ${book.id}.`,
          color: "red"
        });
      });
  };

  const apriBooklistSelect = () => {
    refetch() //Non serve a niente, fa solo forzare il re-render della pagina dato che per qualche motivo non funziona
    navigate(`/booklist/select/${showClientId}`)
  }

  const apriBooklistShow = () => {
    refetch() //Non serve a niente, fa solo forzare il re-render della pagina dato che per qualche motivo non funziona
    navigate(`/booklist/${selectClientId}`)
  }

  const aggiungiClienteAdAcquirenti = (book) => {
    //Toglo id del cliente dall array acquirenti
    book.acquirenti?.push(selectClientId);
    console.log(book)

    //Aggiorno il libro con il nuovo array di acquirenti filtrato
    axios.put(`http://localhost:3000/books/${book.id}`, book)
      .then((response) => {
        if (response.status === 200) {
          notifications.show({
            title: "PUT",
            message: `Record del libro con ID ${book.id} aggiornato con successo!`,
            color: "editButtonGreen"
          });
          setFilteredBooks(filteredBooks.filter((bok) => {
            return bok.id != book.id
          }))
        }
      })
      .catch(() => {
        notifications.show({
          title: "Errore",
          message: `Non è stato possibile aggiornare il record del libro con ID ${book.id}.`,
          color: "red"
        });
      });
  };

  //Generazione righe della tabella
  const rows = filteredBooks?.map((book) => (
    <Table.Tr key={book.id}>
      <Table.Td>{book.id}</Table.Td>
      <Table.Td>{book.isbn}</Table.Td>
      <Table.Td>{book.titolo}</Table.Td>
      <Table.Td>{book.numeroPagine}</Table.Td>

        {!showClientId && <Table.Td>{book.quantitaDisponibile}</Table.Td>}
      <Table.Td>
        {/* Sezione azioni */}
        <Group gap={5} justify="space-evenly">

          {!showClientId && !selectClientId ?
            <>
              {/* //Pulsante modifica */}
              <Tooltip label="Modifica">
                <Button variant="default" c='editButtonGreen' onClick={() => { dettagli(book.id) }}> <FaEdit /> </Button>
              </Tooltip>

              {/* //Pulsante cancella con popover di conferma */}
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
                    <Button onClick={() => { elimina(book.id) }}>
                      Conferma
                    </Button>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            </>
            :
            showClientId ? 
            <Tooltip label="Rimuovi">
              <Button variant="default" c='deleteButtonRed' onClick={() => { eliminaClienteDaAcquirenti(book) }}> <BsTrash3 /> </Button>
            </Tooltip>
            : 
            <Tooltip label="Aggiungi">
              <Button variant="default" c='blue' onClick={() => { aggiungiClienteAdAcquirenti(book) }}> <IoMdAdd size={24} /> </Button>
            </Tooltip>
          }

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
          {!showClientId && !selectClientId ?
            <Button leftSection={<IoMdAdd size={20} />} onClick={() => { dettagli() }}>Nuovo Libro</Button>
            :
            !selectClientId ?
            <Button leftSection={<IoMdAdd size={20} />} onClick={() => { apriBooklistSelect() }}>Aggiungi Libro</Button>
            :
            <Button leftSection={<IoIosArrowBack size={20} />} onClick={() => { apriBooklistShow() }}>Torna alla lista</Button>
          }
        </Group>
      </Group>

      <Space h="xl" />

      {/* Tabella con i dati */}
      <Group justify="center">
        <Table striped highlightOnHover withColumnBorders stickyHeader stickyHeaderOffset={60} >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>ISBN</Table.Th>
              <Table.Th>TITOLO</Table.Th>
              <Table.Th>NUMERO PAGINE</Table.Th>
              {!showClientId && <Table.Th>COPIE DISPONIBILI</Table.Th>}
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

export default BookList;
