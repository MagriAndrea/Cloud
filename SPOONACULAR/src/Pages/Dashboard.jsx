import React, { useState } from "react";

function Dashboard() {
  // dati fittizi per la tabella
  const [data, setData] = useState([
    { id: 1, title: "Progetto A"},
    { id: 2, title: "Progetto B"},
    { id: 3, title: "Progetto C"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
    { id: 4, title: "Progetto D"},
  ]);

  return (
    <div className="flex justify-center h-full mt-4">
      <div className="w-2/3 p-8 bg-gray-700 rounded-lg shadow-xl text-white">

        <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>

        <div className="grid grid-cols-3 gap-2">

          <div className="bg-blue-500 p-2 rounded-md text-center">
            ID
          </div>
          <div className="bg-blue-500 p-2 rounded-md text-center">
            Titolo
          </div>
          <div className="bg-blue-500 p-2 rounded-md text-center">
            Azioni
          </div>
          
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <div className="bg-gray-600 p-2 rounded-md text-center">
                {row.id}
              </div>
              <div className="bg-gray-600 p-2 rounded-md text-center">
                {row.title}
              </div>
              <div className="bg-gray-600 p-2 rounded-md text-center flex justify-evenly">
                <div className="bg-white cursor-pointer bg-opacity-10 px-1 rounded-md hover:bg-opacity-20">Elimina</div>
                <div className="bg-white cursor-pointer bg-opacity-10 px-1 rounded-md hover:bg-opacity-20">Modifica</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
