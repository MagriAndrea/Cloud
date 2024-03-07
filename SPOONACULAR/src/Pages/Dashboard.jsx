import React, { useEffect, useState } from "react";
import axios from "axios"
import "../app.css"
import { useNavigate, Link } from "react-router-dom";
import useCheckLogin from "../functions/useCheckLogin";

function Dashboard() {

  const [apiResponse, setApiResponse] = useState();
  const [massIds, setMassIds] = useState([])
  const [errorResponse, setErrorResponse] = useState()
  const [email, setEmail] = useState("paolo@gmail.com")
  const [password, setPassword] = useState("paolo")
  const navigate = useNavigate()

  useCheckLogin()

  useEffect(() => {
    axios.get("http://localhost:4000/posts/get", {
      headers: {
        email: email,
        password: password
      }
    }).then((res) => {
      console.log(res.data)
      setApiResponse(res.data)
    }).catch((err) => {
      console.log(err)
      setErrorResponse(err.response)
    })
  }, [])

  const deletePost = (id) => {
    {/*Faccio una chiamata all'endpoint delete passando id */ }
    axios.delete(
      "http://localhost:4000/posts/delete/" + id,
      {
        headers: {
          email: email,
          password: password,
        },
      }
    ) //Filtro l'array senza richiedere i dati
      .then((res) => {
        setApiResponse(apiResponse.filter((post) => post.id !== id))
      })
      .catch((err) => {
        setErrorResponse(err.response);
      });
  }

  const deleteMassPosts = () => {
    console.log(typeof(massIds))
    massIds.map(id => {
      axios.delete(
        "http://localhost:4000/posts/delete/" + id,
        {
          headers: {
            email: email,
            password: password,
          },
        }
      ).then((res) => {
        setApiResponse(apiResponse.filter((post) => post.id !== id))
      }).catch((err) => {
        setErrorResponse(err.response);
      });

    });

  }

  const updatePost = (id) => {
    navigate("/posts/detail/" + id) //Gestire pagina di modifica
  }

  const handleChecked = (e, itemId) => {
    const isChecked = e.target.checked;
  
    if (isChecked) {
      setMassIds([...massIds, itemId]);
    } else {
      const updatedIds = massIds.filter((id) => id !== itemId);
      setMassIds(updatedIds);
    }
  };

  return (
    <>
      {/*ALERT*/}
      {errorResponse ? (
        errorResponse.status == 200 ? (
          <div class="alertSuccess" role="alert">
            <strong class="font-bold">200</strong>
            <span class="block sm:inline">Successo</span>
          </div>
        ) : (
          <div class="alertError" role="alert">
            <strong class="font-bold">{errorResponse.status} </strong>
            <span class="block sm:inline">{errorResponse.data}</span>
          </div>
        )
      ) : (
        ""
      )}

      <Link to="/posts/detail" className="button">
        Nuovo Post
      </Link>
      <div className="flex justify-center h-full mt-4">

        <div className="w-2/3 p-8 bg-gray-700 rounded-lg shadow-xl text-white">

          <h1 className="title">Dashboard</h1>

          <div className="grid grid-cols-5 gap-2">

            <div className="">

            </div>
            <div className="heading">
              ID
            </div>
            <div className="heading">
              Titolo
            </div>
            <div className="heading">
              Contenuto
            </div>
            <div className="heading">
              Azioni
            </div>

            {apiResponse ?
              apiResponse?.map((item) => (
                <React.Fragment key={item.id}>
                  <input className="checkBox" id="deleteCheckBox" type='checkbox' onChange={(e) => handleChecked(e, item.id)}/>
                  <div className="item">
                    {item.id}
                  </div>
                  <div className="item">
                    {item.title}
                  </div>
                  <div className="item">
                    {item.content}
                  </div>
                  <div className="item flex justify-evenly">
                    <div className="actionUpdate" onClick={() => updatePost(item.id)}>Modifica</div>
                    <div className="actionDelete" onClick={() => deletePost(item.id)}>Elimina</div>
                  </div>
                </React.Fragment>
              ))
              : <p>Nessun dato</p>
            }
          </div>
          {massIds.length > 0 ? 
          <button className="button" onClick={() => deleteMassPosts()}>Elimina Selezionati</button>
          : ""
        }
        </div>
      </div>
    </>
  );
}

export default Dashboard;
