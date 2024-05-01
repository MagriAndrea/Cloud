import { useForm, hasLength, isEmail, isNotEmpty, isInRange } from '@mantine/form';
import { TextInput, Button, Space, Container, Stack, Group } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { FaList } from "react-icons/fa";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      isbn: '123-4-56-789876-5',
      titolo: '',
      numeroPagine: '',
      quantitaDisponibile: ''
    },
    validate: {
      isbn: (value) => {
        // Espressione regolare per validare un ISBN a 10 o 13 cifre 
        const regex = /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/;
        if (!regex.test(value)) {
          return 'ISBN non valido. Deve essere di 10 o 13 cifre e può contenere quanti trattini vuoi.';
        }
        // Aggiungi qui ulteriori controlli se necessario
        return null;
      },
      titolo: hasLength(
        { min: 2, max: 50 },
        'Il titolo deve avere almeno 2 caratteri e al massimo 50 caratteri!'
      ),
      numeroPagine: (value) => {
        if (!value) return 'Inserisci il numero di pagine!';
        const number = parseFloat(value);
        if (isNaN(number)) return 'Il numero di pagine deve essere un valore numerico!';
        if (number < 0) return 'Il numero di pagine non può essere negativo!';
        return null;
      },
      quantitaDisponibile: (value) => {
        if (!value) return 'Inserisci la quantità disponibile!';
        const number = parseFloat(value);
        if (isNaN(number)) return 'La quantità disponibile deve essere un valore numerico!';
        if (number < 0) return 'La quantità disponibile non può essere negativa!';
        return null;
      }
    }
  });


  //UseFetch non funziona per qualche motivo quindi si ritorna ad axios
  useEffect(() => {
    if (id) {


      axios.get(`http://localhost:3000/books/${id}`).then((response) => {
        form.setValues({
          isbn: response.data?.isbn,
          titolo: response.data?.titolo,
          numeroPagine: response.data?.numeroPagine,
          quantitaDisponibile: response.data?.quantitaDisponibile
        })
      })

    }
  }, [id]);

  //Gestisco il submit del form
  const handleSubmit = (values) => {
    //Controllo che i dati siano validi (solo in frontend, un secondo controllo sarebbe da fare nel backend)
    if (form.isValid) {
      //Se questa pagina è stata aperta con un param id, allora si tratta di una modifica
      if (id) {
        axios.put(`http://localhost:3000/books/${id}`, form.getValues())
          .then((response) => {
            if (response.status === 200) {
              notifications.show({
                title: "PUT",
                message: "Record aggiornato con successo!",
                color: "editButtonGreen"
              })
            }
          })

        //Una volta modificato il record, faccio tornare l'utente nella lista
        navigate('/booklist')

        //Altrimenti aggiunto il nuovo record
      } else {
        axios.post(`http://localhost:3000/books`, form.getValues())
          .then((response) => {
            if (response.status === 201) { //201 vuol dire "created"
              notifications.show({
                title: "POST",
                message: "Record aggiunto con successo!",
                color: "editButtonGreen"
              })
            }
          })

        //Permetto l'aggiunta di piú record
        form.reset()
      }
    }
  };

  return (
    <Container fluid>
      <Stack >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Isbn"
            {...form.getInputProps('isbn')}
          />
          <Space h="md" />
          <TextInput
            label="Titolo"
            {...form.getInputProps('titolo')}
          />
          <Space h="md" />
          <TextInput
            label="Numero di pagine"
            {...form.getInputProps('numeroPagine')}
          />
          <Space h="md" />
          <TextInput
            label="Copie disponibili"
            {...form.getInputProps('quantitaDisponibile')}
          />
          <Space h="xl" />

          <Group>
            <Button type="submit">{id ? 'Aggiorna Libro' : 'Crea Libro'}</Button>
            <Button leftSection={<FaList />} onClick={() => { navigate('/booklist') }}>Torna alla lista</Button>
          </Group>

        </form>
      </Stack>
    </Container>
  );
}

export default BookDetail;
