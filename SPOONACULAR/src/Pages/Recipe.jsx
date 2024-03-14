import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import RelatedRecipes from './RelatedRecipes';
import sanitizeHtml from 'sanitize-html'
import parse from "html-react-parser"
import useCheckLogin from '../functions/useCheckLogin';

const Recipes = () => {

    const {id} = useParams() //Estrae il parametro id perchè abbiamo definito questo elemento come /recipe/:id
    const [response, setResponse] = useState();

    useCheckLogin()

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
            })
            .catch(err => {
                console.log(err)
            })
    }, [id])

    return (
        <>
            {response ? (
                <div className='flex flex-col justify-end items-center p-2 bg-opacity-10 bg-white rounded-lg'>
                    <p className='p-2 text-2xl'>{response.title}</p>
                    <img className='p-2' src={response.image} alt={response.title} />
                    <p className='p-2'>{parse(sanitizeHtml(response.summary))}</p>
                </div>
            ) : (<p>Caricamento...</p>)}
            <RelatedRecipes id={id} />
        </>
    );
};

export default Recipes;