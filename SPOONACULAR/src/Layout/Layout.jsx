import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div>
      <nav className="bg-white p-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-blue-500 text-4xl hover:text-blue-800">
            Home
          </Link>
          <Link to="/ricette" className="text-blue-500 text-4xl hover:text-blue-800">
            Ricette
          </Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
