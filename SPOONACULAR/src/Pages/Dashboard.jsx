import React, { useEffect, useState } from "react";
import axios from "axios"
import "../app.css"
import { useNavigate, Link} from "react-router-dom";

function Dashboard() {
 
  const [apiResponse, setApiResponse] = useState();
  const [errorResponse, setErrorResponse] = useState({})
  const [email, setEmail] = useState("paolo@gmail.com")
  const [password, setPassword] = useState("paolo")
  const navigate = useNavigate()

  useEffect(() => {
    axios.get("http://localhost:4000/posts/get", {
    headers: {
      email: email,
      password: password
    }
  }).then((res)=> {
    console.log(res.data)
    setApiResponse(res.data)
  }).catch((err)=> {
    console.log(err)
    setErrorResponse(err.response)
  })
  }, [])

  const deletePost = (id) => {
    axios.delete(
      "http://localhost:4000/posts/delete/" + id,
      {
          headers: {
              email: email,
              password: password,
          },
      }
  )
      .then((res) => {
        setApiResponse(apiResponse.filter((post) => post.id !== id))
      })
      .catch((err) => {
        setErrorResponse(err.response);
      });
  }

  const updatePost = (id) => {
    navigate("/posts/detail/" + id) //Gestire pagina di modifica
  }

  return (
    <>
    {/*ALERT*/}
    {errorResponse?.status == 401 ? 
      <div class="alert" role="alert">
        <strong class="font-bold">{errorResponse.status} </strong>
        <span class="block sm:inline">{errorResponse.data}</span>
      </div>
      : ""
      }

    <Link to="/posts/detail" className="heading">
      Nuovo Post
    </Link>
    <div className="flex justify-center h-full mt-4">
      
      <div className="w-2/3 p-8 bg-gray-700 rounded-lg shadow-xl text-white">

        <h1 className="title">Dashboard</h1>

        <div className="grid grid-cols-4 gap-2">

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
                <div className="action" onClick={() => {deletePost(item.id)}}>Elimina</div>
                <div className="action" onClick={() => {updatePost(item.id)}}>Modifica</div>
              </div>
            </React.Fragment>
          ))
        : <p>Nessun dato</p>
        }
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
