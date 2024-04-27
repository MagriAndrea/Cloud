import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from "react-router-dom"
import ClientList from "./pages/ClientList"
import ClientDetail from "./pages/ClientDetail"
import BookList from './pages/BookList'
import BookDetail from './pages/BookDetail'
import classes from "./App.module.css"
import '@mantine/core/styles.css';
import { MantineProvider, createTheme, rem } from '@mantine/core';
import Layout from "./layout/layout";

//Dichiaro valori che uso in tutto il programma
const theme = createTheme({

  colors: {
    'myBlue': ["#ebefff", "#d5dafc", "#a9b1f1", "#7b87e9", "#5362e1", "#3a4bdd", "#2d3fdc", "#1f32c4", "#182cb0", "#0b259c"],
    'myOrange': ["#fff4e2", "#ffe9cc", "#ffd09c", "#fdb766", "#fca13a", "#fb931d", "#fc8c0c", "#e17900", "#c86a00", "#ae5a00"],
    'deleteButtonRed': ["#ffe8e8", "#ffcfcf", "#ff9c9c", "#fe6565", "#fd3937", "#fe1e1a", "#fe0e0b", "#e30000", "#ca0000", "#b10000"],
    'editButtonGreen': ["#e5feee", "#d2f9e0", "#a8f1c0", "#7aea9f", "#53e383", "#3bdf70", "#2bdd66", "#1ac455", "#0caf49", "#00963c"]
  },

  fontFamily: 'Greycliff CF, sans-serif',

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
      <Route index element={<Navigate to="/clientlist" />} />
      <Route path="clientlist" element={<ClientList />} />
      <Route path="clientdetail" element={<ClientDetail />} />
      <Route path="booklist" element={<BookList />} />
      <Route path="bookdetail" element={<BookDetail />} />
    </Route>
  )
);


function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <RouterProvider router={router} />
    </MantineProvider>
  )
}

export default App
