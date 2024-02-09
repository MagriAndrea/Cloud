import { useState } from "react";
import axios from "axios"

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/users/add", {
      email: email,
      password: password,
      role: "user"
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
      setErrorResponse(err.response)
    })

  };

  return (
    <>
      {/*ALERT*/}
      {errorResponse.status == 400 ? 
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">{errorResponse.status} </strong>
        <span class="block sm:inline">{errorResponse.data}</span>
      </div>
      : ""
      }
      

      <div className="flex justify-center items-center h-screen bg-slate-800">
        <form
          onSubmit={handleSubmit}
          className="w-80 p-8 bg-gray-700 rounded-lg shadow-xl text-white"
        >
          <h1 className="text-3xl font-bold mb-4">Registrati</h1>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-950"
              
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-950"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-bold"
          >
            Invia
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
