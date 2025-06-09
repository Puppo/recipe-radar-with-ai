import { Link, Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Recipe Radar
          </Link>
        </div>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="container text-center text-gray-500">
          <p>© {new Date().getFullYear()} Recipe Radar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
