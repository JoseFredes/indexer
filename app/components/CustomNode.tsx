import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FiInfo, FiExternalLink, FiPlus } from 'react-icons/fi';
import { CustomNode } from '../types';
import classNames from 'classnames';

interface CustomNodeProps extends NodeProps {
  data: CustomNode['data'];
}

const NODE_COLORS = {
  topic: 'bg-blue-50 border-blue-400',
  paper: 'bg-green-50 border-green-400',
  tool: 'bg-purple-50 border-purple-400'
};

const NODE_ICONS = {
  topic: '📚',
  paper: '📄',
  tool: '🛠️'
};

const VeracityBadge = ({ score }: { score: number }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';
  
  if (score >= 0.8) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (score >= 0.5) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }
  
  return (
    <div className={`absolute -top-2 -right-2 text-xs font-bold px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
      {Math.round(score * 100)}%
    </div>
  );
};

function CustomNodeComponent({ data, id }: CustomNodeProps) {
  const { label, description, type } = data;
  const hasVeracityScore = type === 'topic' || type === 'tool';
  const nodeColorClass = NODE_COLORS[type as keyof typeof NODE_COLORS] || 'bg-gray-50 border-gray-400';
  const nodeIcon = NODE_ICONS[type as keyof typeof NODE_ICONS] || '❓';
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
      />
      <div 
        className={classNames(
          'p-3 rounded-lg shadow-md border-2 max-w-xs transition-all',
          nodeColorClass,
          'hover:shadow-lg hover:scale-105'
        )}
      >
        {hasVeracityScore && <VeracityBadge score={data.veracity_score} />}
        
        <div className="flex items-center mb-2">
          <span className="mr-2 text-lg">{nodeIcon}</span>
          <h3 className="font-bold text-sm truncate">{label}</h3>
        </div>
        
        <p className="text-xs text-gray-700 line-clamp-2">
          {description}
        </p>
        
        <div className="flex justify-end mt-3 space-x-1">
          <button 
            className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            title="More Information"
            onClick={(e) => {
              e.stopPropagation();
              // We'll implement this in the parent component
              window.dispatchEvent(new CustomEvent('node-info', { detail: { id } }));
            }}
          >
            <FiInfo className="w-4 h-4" />
          </button>
          
          {data.url && (
            <a 
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              title="Open URL"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink className="w-4 h-4" />
            </a>
          )}
          
          <button 
            className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 transition"
            title="Expand Node"
            onClick={(e) => {
              e.stopPropagation();
              // We'll implement this in the parent component
              window.dispatchEvent(new CustomEvent('node-expand', { detail: { id } }));
            }}
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
    </>
  );
}

export default memo(CustomNodeComponent); 