import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import "../app.css"
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState({})
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post("/login", {
      email : email,
      password: password
    }
    ).then((res) => {
      navigate("/dashboard")
    }).catch((err) => {
      setErrorResponse(err)
    })

  };

  return (
    <>
    {/*ALERT*/}
    {errorResponse.status == 401 ? 
      <div class="alertError" role="alert">
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
        <h1 className="text-3xl font-bold mb-4">Accedi</h1>
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
            required
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
          className="button"
        >
          Invia
        </button>
      </form>
    </div>
    </>
  );
}

export default Login;
