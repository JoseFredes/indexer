import React, { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { CustomNode } from '../types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: CustomNode | null;
  additionalInfo: string;
}

export default function InfoModal({ isOpen, onClose, node, additionalInfo }: InfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Add debug log
  console.log('InfoModal rendered with:', { isOpen, node: node?.id, additionalInfo });
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen || !node) return null;
  
  const { type, label } = node.data;
  
  const typeLabel = {
    topic: 'Topic',
    paper: 'Research Paper',
    tool: 'AI Tool'
  }[type] || 'Item';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold flex items-center">
            {type === 'topic' && <span className="mr-2">📚</span>}
            {type === 'paper' && <span className="mr-2">📄</span>}
            {type === 'tool' && <span className="mr-2">🛠️</span>}
            {typeLabel}: {label}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {type === 'topic' && node.data.veracity_score && (
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Veracity Score</div>
              <div className="flex items-center">
                <div className="h-2 bg-gray-200 rounded-full w-full max-w-xs">
                  <div 
                    className={`h-2 rounded-full ${
                      node.data.veracity_score >= 0.8 ? 'bg-green-500' : 
                      node.data.veracity_score >= 0.5 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.round(node.data.veracity_score * 100)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {Math.round(node.data.veracity_score * 100)}%
                </span>
              </div>
            </div>
          )}
          
          {type === 'paper' && (
            <>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Authors</div>
                <p>{node.data.authors || 'Unknown'}</p>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Summary</div>
                <p className="text-sm">{node.data.description}</p>
              </div>
              {node.data.url && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Source</div>
                  <a 
                    href={node.data.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on arXiv
                  </a>
                </div>
              )}
            </>
          )}
          
          {type === 'tool' && (
            <>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Category</div>
                <p>{node.data.category || 'Uncategorized'}</p>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Description</div>
                <p className="text-sm">{node.data.description}</p>
              </div>
              {node.data.url && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Website</div>
                  <a 
                    href={node.data.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              )}
              {node.data.veracity_score && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Veracity Score</div>
                  <div className="flex items-center">
                    <div className="h-2 bg-gray-200 rounded-full w-full max-w-xs">
                      <div 
                        className={`h-2 rounded-full ${
                          node.data.veracity_score >= 0.8 ? 'bg-green-500' : 
                          node.data.veracity_score >= 0.5 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.round(node.data.veracity_score * 100)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {Math.round(node.data.veracity_score * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              {additionalInfo ? (
                <div className="whitespace-pre-line">
                  {(() => {
                    console.log('Rendering additionalInfo:', additionalInfo);
                    try {
                      // Try to handle as JSON if it's not a string
                      if (typeof additionalInfo === 'string') {
                        return additionalInfo;
                      } else {
                        return JSON.stringify(additionalInfo, null, 2);
                      }
                    } catch (error) {
                      console.error('Error rendering additionalInfo:', error);
                      return 'Error displaying additional information.';
                    }
                  })()}
                </div>
              ) : (
                'No additional information available.'
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 