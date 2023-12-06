import { Link } from "react-router-dom"

const Header = (props) => { //Tutte le props vengono messe dentro un oggetto, poi da quell oggetto si prendono i valori tramite la dot notation
    //Oppure utilizzando il destructuring cioè {name} è come fare props.name
    return (
        <header>
            <h3>{props.name}</h3>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/todos">ToDos</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;