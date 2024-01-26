import React, { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(email, password);
  };

  return (
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
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-bold"
        >
          Invia
        </button>
      </form>
    </div>
  );
}

export default Register;
