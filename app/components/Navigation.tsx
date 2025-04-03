'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import SearchBar from './SearchBar';

const tabs = [
  { name: 'ArXiv Papers', href: '/arxiv', icon: '📄' },
  { name: 'AI Tools', href: '/tools', icon: '🛠️' },
  { name: 'AI Topics', href: '/topics', icon: '📚' },
];

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">AI Indexer</Link>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <SearchBar />
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={classNames(
                pathname === tab.href
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'flex items-center px-3 pt-1 border-b-2 text-sm font-medium'
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 