import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className='bg-slate-800 text-gray-300 min-h-full' >
      <nav className="bg-gray-700 p-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-blue-500 text-4xl hover:text-blue-800">
            Home
          </Link>
          <Link to="/recipes" className="text-blue-500 text-4xl hover:text-blue-800">
            Recipes
          </Link>
          <Link to="/register" className="text-blue-500 text-4xl hover:text-blue-800">
            Register
          </Link>
          <Link to="/login" className="text-blue-500 text-4xl hover:text-blue-800">
            Login
          </Link>
        </div>
      </nav>
      <main className='h-full'>{children}</main>
    </div>
  );
}

export default Layout;
