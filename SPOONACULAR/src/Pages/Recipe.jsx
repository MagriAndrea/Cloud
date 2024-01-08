import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

const Recipes = () => {

    const {id} = useParams()
    const [response, setResponse] = useState();

    useEffect(() => {
        const url = "https://api.spoonacular.com/recipes/" + id + "/information";
        axios.get(url, {
            params: {
                apiKey: import.meta.env.VITE_API_KEY,
                number: 10,
            }
        })
            .then(res => {
                setResponse(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <>
            {response ? (
                <div className='flex flex-col justify-end items-center p-2 bg-opacity-10 bg-white rounded-lg'>
                    <p className='p-2 text-2xl'>{response.title}</p>
                    <img className='p-2' src={response.image} alt={response.title} />
                    <p className='p-2' dangerouslySetInnerHTML={{__html: response.summary}}></p>
                </div>
            ) : (<p>Caricamento...</p>)}
        </>
    );
};

export default Recipes;