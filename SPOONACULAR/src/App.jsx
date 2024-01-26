import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Recipes from "./Pages/Recipes"
import Recipe from "./Pages/Recipe"
import { QueryClient, QueryClientProvider } from "react-query"
import Layout from "./Layout/Layout"
import Register from "./Pages/Register"
import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"

function App() {

  const queryClient = new QueryClient()

  return <>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe/:slug/:id" element={<Recipe />} /> {/*Super easy passare il parametro id, basta usare useParams*/}
      </Routes>
    </Layout>
  </>
}

export default App
