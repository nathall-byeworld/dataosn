import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Trophy } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <span>OSN Results</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/handbook"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/handbook') 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
              }`}
            >
              <Book className="h-4 w-4" />
              <span>ByeWorld's Handbook</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;