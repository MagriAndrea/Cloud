import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const Home = () => {
  const url = "https://api.spoonacular.com/recipes/random";

  // Usa l'hook useQuery per recuperare i dati dall'API
  const { data, isLoading, error, refetch } = useQuery(
    "recipes",
    async () => {
      // Invia una richiesta GET all'API usando le variabili di ambiente
      const response = await axios.get(url, {
        // Passa i parametri nell'oggetto di opzioni
        params: {
          apiKey: import.meta.env.VITE_API_KEY,
          number: 4,
        },
      });
      // Restituisci i dati della risposta
      return response.data;
    },
    {
      // Imposta il tempo di validità dei dati a un'ora
      staleTime: 1000 * 60 * 60,
    }
  );

  return (
    <div>
      {/* Mostra i dati di risposta o un messaggio di errore */}
      {isLoading ? (
        <p>Caricamento in corso...</p>
      ) : error ? (
        <p>C'è stato un errore nella richiesta</p>
      ) : (
        <div>
          <h1>Ricette Casuali</h1>
          <Splide>
            {data &&
              data.recipes.map((item) => (
                <SplideSlide key={item.id}>
                  <h3>{item.title}</h3>
                  <img src={item.image} alt={item.title} />
                </SplideSlide>
              ))}
          </Splide>
          {/* Aggiungi un bottone per il refetch dei dati */}
          <button onClick={refetch}>Aggiorna ricette</button>
        </div>
      )}
    </div>
  );
};

export default Home;
