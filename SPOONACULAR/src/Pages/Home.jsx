import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const fetchData = () => {
  const url = "https://api.spoonacular.com/recipes/random";
  return axios.get(url, {
    params: {
      apiKey: import.meta.env.VITE_API_KEY,
      number: 4,
    },
  }).then(response => {
    return response.data;
  })
}

const Home = () => {

  const { data, isLoading, error, refetch } = useQuery("recipes", fetchData);

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
          <Splide
            options={{
              type: 'slide',
              perPage: 4,
              grid: {
                cols: 4,
                gap: {
                  row: '1rem',
                  col: '1.5rem',
                },
              },
            }}
            className="flex flex-col items-center"
          >
            {data?.recipes.map((item) => (
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
