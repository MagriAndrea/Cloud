import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import {Routes, Route, } from "react-router-dom"
import Home from './pages/Home';
import About from './pages/About';
import Contact from "./pages/About"

function App() {
  return (<>
    <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
      </Routes>
    <Footer />
  </>
  );
}

export default App;
