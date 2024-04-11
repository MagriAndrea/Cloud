import {createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom"
import Layout from "./layout/layout"
import ClientList from "./pages/ClientList"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={Layout}>
      <Route path="/" element={<Navigate to="/clientlist" />} /> {/*Faccio in modo che la route / vada sulla route /clientlist */}
      <Route path="/clientlist" element={<ClientList/>}/>
      <Route path="/clientdetail" element={<ClientDetail/>}/>
    </Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
