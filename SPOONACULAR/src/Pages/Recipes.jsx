import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCheckLogin from '../functions/useCheckLogin';

const Recipes = () => {

    const [apiResponse, setApiResponse] = useState();

    useCheckLogin()

    const fetchData = () => {
        const url = "https://api.spoonacular.com/recipes/random";
        axios.get(url, {
            params: {
                apiKey: import.meta.env.VITE_API_KEY,
                number: 10,
            }
        }).then(response => {
            sessionStorage.setItem("recipes_api_cache", JSON.stringify(response.data))
            setApiResponse(response.data)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        const apiCache = sessionStorage.getItem("recipes_api_cache")

        if (!apiCache) {
            fetchData()
        } else {
            setApiResponse(JSON.parse(apiCache))
        }
    }, [])

    return (
        <>
        <div className='grid grid-rows-4 gap-4 grid-cols-3 p-2'>
            {apiResponse?.recipes.map((recipe) => (
                <Link key={recipe.id} to={`/recipe/${recipe.title}/${recipe.id}`}
                    className='hover:cursor-pointer flex flex-col justify-end items-center p-2 bg-opacity-10 bg-white rounded-lg'>
                    <p className="text-2xl font-bold"> {recipe.title}</p>
                    <img src={recipe.image} alt={recipe.title}></img>
                </Link>
            ))}
        </div>
        <button className="bg-gray-900 hover:bg-gray-700 active:bg-gray-600 p-2 m-2 rounded-lg" onClick={() => fetchData()}>Nuove ricette</button>
        </>
    );
};

export default Recipes;