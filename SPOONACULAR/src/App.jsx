import {Routes, Route} from "react-router-dom"
import Home from "./Pages/Home"
import Ricette from "./Pages/Ricette"
import { QueryClient, QueryClientProvider } from "react-query"

function App() {

  const queryClient = new QueryClient()

  return <>
  <QueryClientProvider client={queryClient}>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/ricette" element={<Ricette/>}/>
    </Routes>
  </QueryClientProvider>
  </>
}

export default App
