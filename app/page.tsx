import React from 'react';
import Link from 'next/link';
import Navigation from './components/Navigation';
import { FiArrowRight } from 'react-icons/fi';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-blue-600 mb-6">
          AI Knowledge Indexer
        </h1>
        
        <p className="text-xl text-gray-600 text-center max-w-3xl mb-10">
          Explore the world of Artificial Intelligence through an interactive knowledge graph. 
          Discover papers, tools, and topics with verified information and interconnected relationships.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-8">
          <CategoryCard 
            title="ArXiv Papers" 
            description="Explore the latest AI research papers from ArXiv, with summaries and related topics." 
            icon="📄"
            href="/arxiv"
          />
          
          <CategoryCard 
            title="AI Tools" 
            description="Discover powerful AI tools and platforms, with verified information and categorization." 
            icon="🛠️"
            href="/tools"
          />
          
          <CategoryCard 
            title="AI Topics" 
            description="Browse AI topics and concepts, with detailed explanations and veracity scoring." 
            icon="📚"
            href="/topics"
          />
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How it works</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-12 mt-6">
            <FeatureCard 
              title="Explore the Graph" 
              description="Navigate through the knowledge graph to discover related concepts, papers, and tools."
              step={1}
            />
            
            <FeatureCard 
              title="Expand Nodes" 
              description="Click the + button on any node to expand and discover more related entities."
              step={2}
            />
            
            <FeatureCard 
              title="Get Detailed Info" 
              description="Click the ? button to get AI-generated information about any topic, paper, or tool."
              step={3}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function CategoryCard({ title, description, icon, href }: { 
  title: string; 
  description: string; 
  icon: string;
  href: string;
}) {
  return (
    <Link href={href} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <div className="flex items-center text-blue-600 font-medium">
          Explore <FiArrowRight className="ml-2" />
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ title, description, step }: { 
  title: string; 
  description: string; 
  step: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-xs">
      <div className="flex justify-center mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {step}
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 text-center text-gray-800">{title}</h3>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </div>
  );
}
