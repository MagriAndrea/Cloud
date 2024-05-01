import { useForm, hasLength, isEmail, isNotEmpty, isInRange } from '@mantine/form';
import { TextInput, Button, Space, Container, Stack, Group } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { FaList } from "react-icons/fa";

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      nome: '',
      cognome: '',
      email: '',
      eta: ''
    },
    validate: {
      nome: hasLength(
        { min: 2, max: 50 },
        'Il nome deve avere minimo 2 caratteri e massimo 50 caratteri!'
      ),
      cognome: hasLength(
        { min: 2, max: 50 },
        'Il cognome deve avere minimo 2 caratteri e massimo 50 caratteri!'
      ),
      email: isEmail('Email non valida!'),
      eta: (value) => {
        if (!value) return "Inserisci l'età!";
        const number = parseFloat(value);
        if (isNaN(number)) return 'L\'età deve essere un numero!';
        if (number < 0) return 'Valore negativo!';
        if (number > 150) return 'Valore troppo alto!';
        return null;
      }
    }
  });

  //UseFetch non funziona per qualche motivo quindi si ritorna ad axios
  useEffect(() => {
    if (id) {

      axios.get(`http://localhost:3000/users/${id}`).then((response) => {
        form.setValues({
          nome: response.data?.nome,
          cognome: response.data?.cognome,
          email: response.data?.email,
          eta: response.data?.eta
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
        axios.put(`http://localhost:3000/users/${id}`, form.getValues())
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
        navigate('/clientlist')

        //Altrimenti aggiunto il nuovo record
      } else {
        axios.post(`http://localhost:3000/users`, form.getValues())
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
            label="Nome"
            {...form.getInputProps('nome')}
          />
          <Space h="md" />
          <TextInput
            label="Cognome"
            {...form.getInputProps('cognome')}
          />
          <Space h="md" />
          <TextInput
            label="Email"
            {...form.getInputProps('email')}
          />
          <Space h="md" />
          <TextInput
            label="Età"
            {...form.getInputProps('eta')}
          />
          <Space h="xl" />

          <Group>
            <Button type="submit">{id ? 'Aggiorna Cliente' : 'Crea Cliente'}</Button>
            <Button leftSection={<FaList />} onClick={() => { navigate('/clientlist') }}>Torna alla lista</Button>
          </Group>

        </form>
      </Stack>
    </Container>
  );
}

export default ClientDetail;
