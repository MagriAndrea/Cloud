import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Recipes = () => {

    const [response, setResponse] = useState();
    const api_cache = sessionStorage.getItem("recipes_api_cache")

    useEffect(() => {
        if (!api_cache) {
            const url = "https://api.spoonacular.com/recipes/random";
            axios.get(url, {
                params: {
                    apiKey: import.meta.env.VITE_API_KEY,
                    number: 10,
                }
            })
                .then(res => {
                    setResponse(res.data.recipes)
                    sessionStorage.setItem("recipes_api_cache", JSON.stringify(res.data.recipes))
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            setResponse(JSON.parse(api_cache))
        }
    }, [])

    return (
        <div className='grid grid-rows-4 gap-4 grid-cols-3 p-2'>
            {response?.map((recipe) => (
                <Link key={recipe.id} to={"/recipe/"+recipe.id}
                className='hover:cursor-pointer flex flex-col justify-end items-center p-2 bg-opacity-10 bg-white rounded-lg'>
                    <p className="text-2xl font-bold"> {recipe.title}</p>
                    <img src={recipe.image} alt={recipe.title}></img>
                </Link>
            ))}
        </div>
    );
};

export default Recipes;