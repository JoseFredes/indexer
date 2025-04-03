import Link from 'next/link';
import Navigation from './components/Navigation';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-9xl font-bold text-blue-600 opacity-30">404</h1>
        
        <div className="text-center mt-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 max-w-md">
            We couldn't find the page you were looking for. 
            Perhaps the knowledge node you seek is on another branch of the graph?
          </p>
        </div>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiHome className="w-5 h-5" />
          Return to Home
        </Link>
      </div>
    </div>
  );
} 