import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Recipes from "./Pages/Recipes"
import Recipe from "./Pages/Recipe"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Layout from "./Layout/Layout"

function App() {

  const queryClient = new QueryClient()

  return <>
  <Layout>
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes/>} />
        <Route path="/recipe/:id" element={<Recipe/>} /> {/*Super easy passare il parametro id, basta usare useParams*/}
      </Routes>
      {/*<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />*/}
    </QueryClientProvider>
  </Layout>
  </>
}

export default App
