import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function PostDetail() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [email, setEmail] = useState("paolo@gmail.com")
    const [password, setPassword] = useState("paolo")

    const [errorResponse, setErrorResponse] = useState({});

    const [isUpdate, setIsUpdate] = useState(false)
    const { id } = useParams()

    //Costanti della richiesta della richiesta
    const body = {
        title: title,
        content: content,
    }
    const headers = {
        email: email,
        password: password,
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
        axios.get("http://localhost:4000/posts/get/" + id, {headers})
            .then((res) => {
                console.log(res.data)
                setTitle(res.data.title)
                setContent(res.data.content)
            }).catch((err) => {
                console.log(err)
                setErrorResponse(err.response)
            })
    }

    // Creo una funzione separata che esegue la chiamata axios e gestisce la risposta
    const sendRequest = (url, method) => {
        axios({
            url: url,
            method: method,
            data: body,
            headers: headers,
        })
            .then((res) => {
                navigate("/dashboard");
            })
            .catch((err) => {
                setErrorResponse(err.response);
            });
    };

    const editPost = () => {
        if (isUpdate) {
            sendRequest(
                "http://localhost:4000/posts/put/" + id,
                "put"
            );
        } else {
            sendRequest(
                "http://localhost:4000/posts/add",
                "post"
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editPost()
    };

    return (
        <>
            {/*ALERT*/}
            {errorResponse?.status == 401 ? (
                <div
                    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong class="font-bold">{errorResponse.status} </strong>
                    <span class="block sm:inline">{errorResponse.data}</span>
                </div>
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
