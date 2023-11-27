import { Routes, Route, } from "react-router-dom"
import Home from './Home';
import About from './About';
import Contact from "./About"
import ToDos from "./ToDos";

const Pages = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/todos' element={<ToDos />} />
        </Routes>
    );
};

export default Pages;