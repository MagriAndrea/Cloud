import axios from 'axios';
import { useQuery } from "react-query";

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

function Ricette() {

    const { data, isLoading, error} = useQuery("recipes", fetchData);

    return (
        <div>
            {isLoading ? (
                <p>Caricamento in corso...</p>
            ) : error ? (
                <p>C'è stato un errore nella richiesta</p>
            ) : (
                data?.recipes.map((ricetta, index) => (
                <div key={index}>
                    <h2>{ricetta.title}</h2>
                    <img src={ricetta.image} alt={ricetta.title} />
                </div>
            )))}
        </div>
    );
}

export default Ricette;
