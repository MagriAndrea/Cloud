import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../app.css"

function PostDetail() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [response, setResponse] = useState()

    const [isUpdate, setIsUpdate] = useState(false)
    const { id } = useParams()

    //Costanti della richiesta della richiesta
    const body = {
        title: title,
        content: content,
    }

    const navigate = useNavigate(); // Per gestire il redirect

    //Controllo se questa pagina sta venendo utilizzata per un update o per un inserimento
    useEffect(() => {
        if (id) {
            setIsUpdate(true)
            getPosts()
        }
    }, [])

    //Nel caso sia un update, i viecchi dati devono essere presi
    const getPosts = () => {
        axios.get("/posts/get/" + id)
            .then((res) => {
                console.log(res.data)

                setTitle(res.data.title)
                setContent(res.data.content)

            }).catch((err) => {
                console.log(err)
                setResponse(err.response)
            })
    }

    // Creo una funzione separata che esegue la chiamata axios e gestisce la risposta
    const sendRequest = (url, method) => {
        axios({
            url: url,
            method: method,
            data: body
        })
            .then((res) => {
                console.log(body);
                console.log(res)
                setResponse(res)
            })
            .catch((err) => {
                setError(err.response);
            });
    };

    const editPost = () => {
        if (isUpdate) {
            sendRequest(
                "/posts/put/" + id,
                "put"
            );
        } else {
            sendRequest(
                "/posts/add",
                "post"
            );
        }
    };

    //Quando viene fatto il submit del post
    const handleSubmit = (e) => {
        e.preventDefault();
        editPost()
    };

    return (
        <>
            {/*ALERT*/}
            {response ? (
                response.status == 200 ? (
                    <div className="alertSuccess" role="alert">
                        <strong className="font-bold">200 </strong>
                        <span className="block sm:inline">Successo</span>
                    </div>
                ) : (
                    <div className="alertError" role="alert">
                        <strong className="font-bold">{response.status} </strong>
                        <span className="block sm:inline">{response.data}</span>
                    </div>
                )
            ) : (
                ""
            )}


            <div className="flex justify-center h-full mt-4">
                <div className="w-2/3 p-8 bg-gray-700 rounded-lg shadow-xl">
                    <h1 className="text-3xl font-bold mb-4 text-center">DATI</h1>

                    {/* Form per inserire i dati */}
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="flex flex-col">
                            <label htmlFor="title" className="text-sm mb-1">
                                Titolo
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="p-2 rounded-md border border-gray-300 text-gray-950"
                                required
                            />
                        </div>
                        <div className="flex flex-col mt-2">
                            <label htmlFor="content" className="text-sm mb-1">
                                Contenuto
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="p-2 rounded-md border border-gray-300 text-gray-950"
                                rows="5"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 p-2 rounded-md mt-2 text-white hover:bg-blue-600"
                        >
                            Invia
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PostDetail;
