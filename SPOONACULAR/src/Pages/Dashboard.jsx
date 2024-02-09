import React, { useEffect, useState } from "react";
import axios from "axios"

function Dashboard() {
 
  const [apiResponse, setApiResponse] = useState();
  const [errorResponse, setErrorResponse] = useState({})
  const [email, setEmail] = useState("paolo@gmail.com")
  const [password, setPassword] = useState("paolo")

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

  

  return (
    <>
    {/*ALERT*/}
    {errorResponse.status == 401 ? 
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">{errorResponse.status} </strong>
        <span class="block sm:inline">{errorResponse.data}</span>
      </div>
      : ""
      }

    <div className="flex justify-center h-full mt-4">
      <div className="w-2/3 p-8 bg-gray-700 rounded-lg shadow-xl text-white">

        <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>

        <div className="grid grid-cols-4 gap-2">

          <div className="bg-blue-500 p-2 rounded-md text-center">
            ID
          </div>
          <div className="bg-blue-500 p-2 rounded-md text-center">
            Titolo
          </div>
          <div className="bg-blue-500 p-2 rounded-md text-center">
            Contenuto
          </div>
          <div className="bg-blue-500 p-2 rounded-md text-center">
            Azioni
          </div>

          {apiResponse ? 
          apiResponse?.map((item) => (
            <React.Fragment key={item.id}>
              <div className="bg-gray-600 p-2 rounded-md text-center">
                {item.id}
              </div>
              <div className="bg-gray-600 p-2 rounded-md text-center">
                {item.title}
              </div>
              <div className="bg-gray-600 p-2 rounded-md text-center">
                {item.content}
              </div>
              <div className="bg-gray-600 p-2 rounded-md text-center flex justify-evenly">
                <div className="bg-white cursor-pointer bg-opacity-10 px-1 rounded-md hover:bg-opacity-20">Elimina</div>
                <div className="bg-white cursor-pointer bg-opacity-10 px-1 rounded-md hover:bg-opacity-20">Modifica</div>
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
