import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Layout({ children }) {

  const navigate = useNavigate()

  const logout = () => {
    axios.get('http://localhost:3000/logout')
    .then(() => {
      navigate('/login')
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className='bg-slate-800 text-gray-300 min-h-full' >
      <nav className="bg-gray-700 p-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="navHeading">
            Home
          </Link>
          <Link to="/recipes" className="navHeading">
            Recipes
          </Link>
          <Link to="/register" className="navHeading">
            Register
          </Link>
          <Link to="/login" className="navHeading">
            Login
          </Link>
          <Link to="/dashboard" className="navHeading">
            Dash
          </Link>
          <button onClick={() => logout()}>LogOut</button>
        </div>
      </nav>
      <main className='h-full'>{children}</main>
    </div>
  );
}

export default Layout;
