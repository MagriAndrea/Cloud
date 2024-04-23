import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom"
import Layout from "./layout/layout"
import ClientList from "./pages/ClientList"
import ClientDetail from "./pages/ClientDetail"

import classes from "./App.module.css"
import '@mantine/core/styles.css';
import { MantineProvider, createTheme, rem } from '@mantine/core';

const theme = createTheme({

  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
  autoContrast: true,
  luminanceThreshold: 0.47,
  activeClassName: classes.active,
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/clientlist" element={<ClientList />} index />
      <Route path="/clientdetail" element={<ClientDetail />} />
      <Route path="/booklist" element={<ClientList />} index />
      <Route path="/bookdetail" element={<ClientDetail />} />
    </Route>
  )
)

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  )
}

export default App
