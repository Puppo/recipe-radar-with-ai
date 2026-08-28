import { Link, Outlet } from 'react-router-dom';
import { useNavigationWebMCP } from '../hooks/useNavigationWebMCP';
import { useSkillWebMCP } from '../hooks/useSkillWebMCP';

export function MainLayout() {
  useNavigationWebMCP();
  useSkillWebMCP();
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Recipe Radar
          </Link>
        </div>
      </header>
      
      <main className="flex-1 py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
      
      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center text-gray-500">
          <p>© {new Date().getFullYear()} Recipe Radar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
