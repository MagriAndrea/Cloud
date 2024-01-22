import {useEffect, useState} from "react";
import axios from "axios";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Link } from "react-router-dom";

const Home = () => {
  const [error, setError] = useState()
  const [apiResponse, setApiResponse] = useState();

  //Questa funzione si occupa di prendere i dati e metterli dentro gli useState
  const fetchData = () => {
      const url = "https://api.spoonacular.com/recipes/random";
      axios.get(url, {
        params: {
          apiKey: import.meta.env.VITE_API_KEY,
          number: 10,
        } 
      }).then(response => {
        sessionStorage.setItem("home_api_cache", JSON.stringify(response.data))
        setApiResponse(response.data)
      }).catch(error => {
        setError(error)
      })
  }

  //Questo si occupa di controllare se c'è qualcosa in cache e se no, prende dati nuovi
  useEffect(() => {
    const apiCache = sessionStorage.getItem("home_api_cache")
  
    if (!apiCache) {
      fetchData()
    } else {
      setApiResponse(JSON.parse(apiCache))
    }
  }, [])

  return (
    <>
      {/* Mostra i dati di risposta o un messaggio di errore */}
      {error ? (
        <p>C'è stato un errore nella richiesta</p>
      ) : (
        <div>
          <h1>Ricette Casuali</h1>
          <Splide
            className="flex flex-col items-center"
            options={{
              type: 'slide', perPage: 4,
              grid: {
                cols: 4,
                gap: {row: '1rem', col: '1.5rem',},
              },
            }}
          >
            {apiResponse?.recipes.map((recipe) => (
              <SplideSlide key={recipe.id} className="hover:cursor-pointer p-2 m-1 bg-opacity-10 bg-white rounded-lg">
                <Link className="flex flex-col justify-end items-center" to={`/recipe/${recipe.title}/${recipe.id}`}>
                  <h3>{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} width="90%" />
                </Link>
              </SplideSlide>
            ))}
          </Splide>
          <button className="bg-gray-900 hover:bg-gray-700 active:bg-gray-600 p-2 m-2 rounded-lg" onClick={() => fetchData()}>Nuove ricette</button>
        </div>
      )}
    </>
  );
};

export default Home;
