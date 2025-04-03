'use client';

import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Graph from '../components/Graph';
import Navigation from '../components/Navigation';

export default function ArxivPage() {
  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex-grow">
        <ReactFlowProvider>
          <Graph />
        </ReactFlowProvider>
      </div>
    </div>
  );
} 