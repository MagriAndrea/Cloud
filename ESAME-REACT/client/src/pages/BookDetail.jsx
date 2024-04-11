import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookDetail = () => {
  const { id } = useParams(); // Ottieni l'ID del cliente dalla URL
  const [client, setClient] = useState(null);

  // Simulated client data (replace with actual API call)
  const mockClients = [
    { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25 },
    // Add more client data here...
  ];

  useEffect(() => {
    // Trova il cliente corrispondente all'ID
    const foundClient = mockClients.find((c) => c.id === parseInt(id));
    setClient(foundClient);
  }, [id]);

  if (!client) {
    return <p>Caricamento in corso...</p>;
  }

  return (
    <div>
      <h2>Dettagli Cliente</h2>
      <p>Nome: {client.firstName}</p>
      <p>Cognome: {client.lastName}</p>
      <p>Età: {client.age}</p>
      {/* Aggiungi altri campi del cliente se necessario */}
    </div>
  );
};

export default BookDetail;
