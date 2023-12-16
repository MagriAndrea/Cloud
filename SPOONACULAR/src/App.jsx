import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Ricette from "./Pages/Ricette"
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
        <Route path="/ricette" element={<Ricette />} />
      </Routes>
      {/*<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />*/}
    </QueryClientProvider>
  </Layout>
  </>
}

export default App
