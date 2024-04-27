import { useFetch } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { TextInput, Table, Group, Text, LoadingOverlay, Button, Container, Space } from "@mantine/core";
import { BsTrash3 } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import.meta.env.VITE_API_BASE_URL //Non va

const BookList = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //UseFetch si occupa di fare il primo fetch e in caso di refetch si usa la funzione refetch
  const { data, loading, error, refetch, abort } = useFetch(`http://localhost:3000/books`);

  //Funzione che serve per filtrare su qualunque campo di un oggetto
  const anyKeyFilter = item => obj =>
    Object.values(obj).some(value =>
      String(value).toLowerCase().includes(item)
    );

  //Ogni volta che viene aggiornato il termine di ricerca, filtro
  useEffect(() => {
    const filtered = data?.filter(anyKeyFilter(searchTerm.toLowerCase()));
    setFilteredBooks(filtered);
  }, [searchTerm, data]);

  const rows = filteredBooks?.map((element) => (
    <Table.Tr key={element.isbn}>
      <Table.Td>{element.isbn}</Table.Td>
      <Table.Td>{element.titolo}</Table.Td>
      <Table.Td>{element.numeroPagine}</Table.Td>
      <Table.Td>{element.quantitaDisponibile}</Table.Td>
      <Table.Td>
        <Group gap={5}>
          <Button variant="default"> <BsTrash3 /> </Button>
          <Button variant="default"> <FaEdit /> </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container fluid>

      <Group justify="center">
        <TextInput
          label="Cerca"
          placeholder="Inserisci termine di ricerca"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
      </Group>

      <Space h="xl" />

      {error && <><Text c="red">{error.message}</Text><Space h="xl" /></>}

      <Group justify="center">
        <Table striped highlightOnHover withColumnBorders stickyHeader >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ISBN</Table.Th>
              <Table.Th>TITOLO</Table.Th>
              <Table.Th>NUMERO PAGINE</Table.Th>
              <Table.Th>COPIE DISPONIBILI</Table.Th>
              <Table.Th>AZIONI</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Group>
    </Container>
  );
};

export default BookList;
