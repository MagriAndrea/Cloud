import { useForm } from '@mantine/form';
import { TextInput, Button, Box, Space, Container, Stack, Group } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFetch } from '@mantine/hooks';

function ClientDetail() {
  const { id } = useParams();
  const { data, loading, error, refetch, abort } = useFetch(`http://localhost:3000/users/${id}`, { autoInvoke: false });
  const form = useForm({
    initialValues: {
      nome: '',
      cognome: '',
      email: '',
      eta: '',
      id: ''
    },
  });

  const handleSubmit = (values) => {
    if (id) {
      // Aggiorna il cliente esistente
      // updateClient(id, values);
    } else {
      // Crea un nuovo cliente
      // createClient(values);
    }
  };
  //Todo gestisci caricamento dati e salvataggio 
  
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
          <Space h="md" />
          <TextInput
            {...form.getInputProps('id')}
            type="hidden"
          />
          <Space h="xl" />
          <Button type="submit">{id ? 'Aggiorna Cliente' : 'Crea Cliente'}</Button>
        </form>
      </Stack>
    </Container>
  );
}

export default ClientDetail;
