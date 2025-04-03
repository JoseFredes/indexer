'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import axios from 'axios';
import { SearchResult } from '../types';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Handle search input changes
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(response.data.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchResults, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigate to the appropriate page based on type
    if (result.type === 'topic') {
      router.push('/topics');
    } else if (result.type === 'paper') {
      router.push('/arxiv');
    } else if (result.type === 'tool') {
      router.push('/tools');
    }
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'topic':
        return '📚';
      case 'paper':
        return '📄';
      case 'tool':
        return '🛠️';
      default:
        return '🔍';
    }
  };
  
  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        
        <input
          id="search"
          name="search"
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search for topics, papers, or tools"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        
        {query && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
          >
            <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
          </button>
        )}
      </div>
      
      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 z-10 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading results...
            </div>
          ) : (
            <ul className="py-1">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-start"
                    onClick={() => handleResultClick(result)}
                  >
                    <span className="mr-2 text-lg">{getIconForType(result.type)}</span>
                    <div>
                      <div className="font-medium text-gray-900 truncate">
                        {result.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {result.description.substring(0, 80)}
                        {result.description.length > 80 ? '...' : ''}
                      </div>
                      <div className="text-xs text-gray-400 uppercase mt-1">
                        {result.type}
                        {result.veracity_score !== undefined && (
                          <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                            result.veracity_score >= 0.8 ? 'bg-green-100 text-green-800' : 
                            result.veracity_score >= 0.5 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {Math.round(result.veracity_score * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 