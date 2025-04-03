import React, { useEffect, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import ReactFlow, {
  Background,
  Controls,
  NodeTypes,
  Node,
  Edge,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
  ConnectionLineType,
  useReactFlow,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNodeComponent from './CustomNode';
import InfoModal from './InfoModal';
import useGraphData from '../hooks/useGraphData';
import { CustomNode, CustomEdge, Topic, Paper, AiTool } from '../types';
import axios from 'axios';

// Define custom node types
const nodeTypes: NodeTypes = {
  customNode: CustomNodeComponent,
};

export default function Graph() {
  const pathname = usePathname();
  const pageType = pathname?.includes('/topics') ? 'topics' : 
                  pathname?.includes('/tools') ? 'tools' : 
                  pathname?.includes('/arxiv') ? 'arxiv' : 'topics';
                  
  // Create local state for nodes and edges to ensure they're properly managed
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle node drag and other node changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  // Fetch data directly in this component for debugging
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Current page type:', pageType);
        
        // Get all data from the API
        const response = await axios.get('/api/topics/initial');
        console.log('API Response:', response.data);
        
        if (response.data.topics && response.data.topics.length > 0) {
          const initialNodes: Node[] = [];
          const initialEdges: Edge[] = [];
          
          // Filter data based on page type
          let filteredTopics: Topic[] = [];
          let filteredPapers: Paper[] = [];
          let filteredTools: AiTool[] = [];
          
          if (pageType === 'topics') {
            // For topics page, show main parent topics and their direct children
            const mainTopics = response.data.topics.filter((topic: Topic) => 
              !topic.parent_id && 
              (topic.source === 'initial_seed' || topic.source === 'advanced_seed')
            );
            
            const childTopics = response.data.topics.filter((topic: Topic) => 
              topic.parent_id && mainTopics.some((main: Topic) => main.id === topic.parent_id)
            );
            
            filteredTopics = [...mainTopics, ...childTopics];
          } 
          else if (pageType === 'tools') {
            // For tools page, get tool-related topics
            // First get all tools from the database
            const toolsResponse = await axios.get('/api/tools');
            filteredTools = toolsResponse.data.tools || [];
            
            // Get topics related to these tools
            const toolRelatedTopics = response.data.topics.filter((topic: Topic) => 
              topic.name.toLowerCase().includes('tool') || 
              topic.description.toLowerCase().includes('tool') ||
              ['workflow', 'automation', 'langchain', 'cursor', 'n8n'].some(
                keyword => topic.name.toLowerCase().includes(keyword)
              )
            );
            
            filteredTopics = toolRelatedTopics;
          }
          else if (pageType === 'arxiv') {
            // For arxiv page, get paper-related topics
            // First get all papers from the database
            const papersResponse = await axios.get('/api/papers');
            filteredPapers = papersResponse.data.papers || [];
            
            // Get topics related to research and papers
            const paperRelatedTopics = response.data.topics.filter((topic: Topic) => 
              topic.name.toLowerCase().includes('model') || 
              topic.description.toLowerCase().includes('research') || 
              ['transformers', 'gpt', 'llm', 'language', 'claude', 'diffusion'].some(
                keyword => topic.name.toLowerCase().includes(keyword)
              )
            );
            
            filteredTopics = paperRelatedTopics;
          }
          
          // Position topics in a circle with increased distance
          const centerX = 600;  // Increased center coordinates
          const centerY = 400;
          const radius = 400;   // Increased radius for main topics
          
          // Create nodes for topics
          const mainTopics = filteredTopics.filter(topic => !topic.parent_id);
          const childTopics = filteredTopics.filter(topic => topic.parent_id);
          
          // Function to check if a position is too close to existing nodes
          const isTooClose = (x: number, y: number, minDistance: number = 180) => {
            return initialNodes.some(node => {
              const dx = node.position.x - x;
              const dy = node.position.y - y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < minDistance;
            });
          };
          
          // Function to get a position with minimum distance from other nodes
          const getPositionWithMinDistance = (baseX: number, baseY: number, attempt: number = 0) => {
            // Add some randomness to avoid perfect circle
            const jitter = attempt === 0 ? 0 : (Math.random() * 100) - 50;
            const x = baseX + jitter;
            const y = baseY + jitter;
            
            if (!isTooClose(x, y) || attempt > 5) {
              return { x, y };
            }
            
            // Recursive try with more randomness
            return getPositionWithMinDistance(baseX, baseY, attempt + 1);
          };
          
          mainTopics.forEach((topic: Topic, index: number) => {
            // Calculate position in a circle with spacing
            const angle = (2 * Math.PI / Math.max(mainTopics.length, 1)) * index;
            const baseX = centerX + radius * Math.cos(angle);
            const baseY = centerY + radius * Math.sin(angle);
            
            // Get position with minimum distance from other nodes
            const position = getPositionWithMinDistance(baseX, baseY);
            
            initialNodes.push({
              id: `topic-${topic.id}`,
              type: 'customNode',
              position,
              draggable: true, // Make node draggable
              data: {
                label: topic.name,
                description: topic.description,
                type: 'topic',
                veracity_score: topic.veracity_score,
                originalData: topic
              }
            });
          });
          
          // Position child topics near their parents with increased spacing
          childTopics.forEach((topic: Topic) => {
            const parentNode = initialNodes.find(node => 
              node.id === `topic-${topic.parent_id}`
            );
            
            if (parentNode) {
              // Larger random variation and distance from parent
              const randomAngle = Math.random() * 2 * Math.PI;
              const randomDistance = 200 + Math.random() * 100;
              const baseX = parentNode.position.x + randomDistance * Math.cos(randomAngle);
              const baseY = parentNode.position.y + randomDistance * Math.sin(randomAngle);
              
              // Get position with minimum distance from other nodes
              const position = getPositionWithMinDistance(baseX, baseY);
              
              initialNodes.push({
                id: `topic-${topic.id}`,
                type: 'customNode',
                position,
                draggable: true, // Make node draggable
                data: {
                  label: topic.name,
                  description: topic.description,
                  type: 'topic',
                  veracity_score: topic.veracity_score,
                  originalData: topic
                }
              });
            }
          });
          
          // If we're on the tools page, add tool nodes
          if (pageType === 'tools' && filteredTools.length > 0) {
            // Position tools around the graph with more spacing
            filteredTools.forEach((tool: AiTool, index: number) => {
              const angle = (2 * Math.PI / filteredTools.length) * index;
              const baseX = centerX + (radius * 1.8) * Math.cos(angle);
              const baseY = centerY + (radius * 1.8) * Math.sin(angle);
              
              // Get position with minimum distance from other nodes
              const position = getPositionWithMinDistance(baseX, baseY);
              
              initialNodes.push({
                id: `tool-${tool.id}`,
                type: 'customNode',
                position,
                draggable: true, // Make node draggable
                data: {
                  label: tool.name,
                  description: tool.description,
                  type: 'tool',
                  category: tool.category,
                  url: tool.url,
                  veracity_score: tool.veracity_score,
                  originalData: tool
                }
              });
              
              // Connect tools to relevant topics
              const relatedTopics = initialNodes.filter(node => 
                node.type === 'customNode' && 
                node.data.type === 'topic' &&
                (node.data.label.toLowerCase().includes(tool.name.toLowerCase()) ||
                tool.name.toLowerCase().includes(node.data.label.toLowerCase()))
              );
              
              // Llevo un registro de conexiones ya creadas para tools
              const toolConnectionsMap = new Map();
              
              relatedTopics.forEach((topic, idx) => {
                const connectionKey = `${topic.id}-tool-${tool.id}`;
                
                // Si ya existe esta conexión, añado un índice único
                const edgeId = toolConnectionsMap.has(connectionKey)
                  ? `edge-${topic.id}-tool-${tool.id}-${idx}`
                  : `edge-${topic.id}-tool-${tool.id}`;
                
                initialEdges.push({
                  id: edgeId,
                  source: topic.id,
                  target: `tool-${tool.id}`,
                  data: {
                    relationship_type: 'related'
                  }
                });
                
                // Registro esta conexión
                toolConnectionsMap.set(connectionKey, true);
              });
            });
          }
          
          // If we're on the arxiv page, add paper nodes
          if (pageType === 'arxiv' && filteredPapers.length > 0) {
            // Position papers around the graph with more spacing
            filteredPapers.forEach((paper: Paper, index: number) => {
              const angle = (2 * Math.PI / filteredPapers.length) * index;
              const baseX = centerX + (radius * 1.8) * Math.cos(angle);
              const baseY = centerY + (radius * 1.8) * Math.sin(angle);
              
              // Get position with minimum distance from other nodes
              const position = getPositionWithMinDistance(baseX, baseY);
              
              initialNodes.push({
                id: `paper-${paper.id}`,
                type: 'customNode',
                position,
                draggable: true, // Make node draggable
                data: {
                  label: paper.title,
                  description: paper.summary,
                  type: 'paper',
                  authors: paper.authors,
                  url: paper.url,
                  originalData: paper
                }
              });
              
              // Connect papers to relevant topics based on keywords
              const keywords = paper.title.toLowerCase().split(' ');
              const relatedTopics = initialNodes.filter(node => 
                node.type === 'customNode' && 
                node.data.type === 'topic' &&
                keywords.some(keyword => 
                  keyword.length > 3 && 
                  node.data.label.toLowerCase().includes(keyword)
                )
              );
              
              // Llevo un registro de conexiones ya creadas para papers
              const paperConnectionsMap = new Map();
              
              relatedTopics.forEach((topic, idx) => {
                const connectionKey = `${topic.id}-paper-${paper.id}`;
                
                // Si ya existe esta conexión, añado un índice único
                const edgeId = paperConnectionsMap.has(connectionKey)
                  ? `edge-${topic.id}-paper-${paper.id}-${idx}`
                  : `edge-${topic.id}-paper-${paper.id}`;
                
                initialEdges.push({
                  id: edgeId,
                  source: topic.id,
                  target: `paper-${paper.id}`,
                  data: {
                    relationship_type: 'related'
                  }
                });
                
                // Registro esta conexión
                paperConnectionsMap.set(connectionKey, true);
              });
            });
          }
          
          // Process relationships between topics
          if (response.data.relationships) {
            // Llevo un registro de las conexiones que ya he creado
            const existingConnections = new Set();
            
            response.data.relationships.forEach((rel: any, index: number) => {
              const sourceId = `topic-${rel.source_id}`;
              const targetId = `topic-${rel.target_id}`;
              
              // Clave única para esta conexión
              const connectionKey = `${sourceId}-${targetId}`;
              
              // Verify both source and target nodes exist in our filtered set
              const sourceExists = initialNodes.some(node => node.id === sourceId);
              const targetExists = initialNodes.some(node => node.id === targetId);
              
              if (sourceExists && targetExists) {
                // Siempre usamos un timestamp aleatorio para garantizar unicidad
                const uniqueTimestamp = Date.now() + Math.floor(Math.random() * 1000) + index;
                const edgeId = `edge-${sourceId}-${targetId}-${uniqueTimestamp}`;
                
                initialEdges.push({
                  id: edgeId,
                  source: sourceId,
                  target: targetId,
                  animated: rel.relationship_type === 'parent-child', // Animate parent-child relationships
                  style: {
                    strokeWidth: rel.relationship_type === 'parent-child' ? 2 : 1,
                  },
                  data: {
                    relationship_type: rel.relationship_type
                  }
                });
                
                // Registro esta conexión como existente
                existingConnections.add(connectionKey);
              }
            });
          }
          
          console.log(`${pageType} Nodes:`, initialNodes.length);
          console.log(`${pageType} Edges:`, initialEdges.length);
          
          setNodes(initialNodes);
          setEdges(initialEdges);
        }
      } catch (error) {
        console.error('Error fetching graph data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [pageType]);

  const {
    loading,
    selectedNode,
    infoModalOpen,
    additionalInfo,
    expandNode,
    onConnect,
    onNodeClick,
    getNodeInfo,
    closeInfoModal
  } = useGraphData();

  // Event listeners for custom events
  useEffect(() => {
    const handleNodeInfo = (event: CustomEvent) => {
      const nodeId = event.detail.id;
      // En lugar de buscar en el DOM, busca el nodo en el estado actual
      console.log('handleNodeInfo triggered for nodeId:', nodeId);
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        console.log('Node found for info request:', node);
        try {
          // Call getNodeInfo and log when it completes
          getNodeInfo(node)
            .then(() => console.log('getNodeInfo completed successfully'))
            .catch(err => console.error('getNodeInfo failed:', err));
        } catch (error) {
          console.error('Error calling getNodeInfo:', error);
        }
      } else {
        console.error('Node not found for info:', nodeId);
      }
    };

    const handleNodeExpand = (event: CustomEvent) => {
      expandNode(event.detail.id);
    };

    // Add event listeners
    window.addEventListener('node-info', handleNodeInfo as EventListener);
    window.addEventListener('node-expand', handleNodeExpand as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('node-info', handleNodeInfo as EventListener);
      window.removeEventListener('node-expand', handleNodeExpand as EventListener);
    };
  }, [expandNode, getNodeInfo, nodes]); // Añadimos 'nodes' a las dependencias

  // Default React Flow props
  const defaultEdgeOptions = {
    style: { stroke: '#b1b1b7', strokeWidth: 2 },
    type: 'smoothstep',
    animated: false,
  };

  // Page-specific titles
  const pageTitle = {
    'topics': 'AI Topics Knowledge Graph',
    'tools': 'AI Tools Ecosystem',
    'arxiv': 'Research Papers Network'
  }[pageType];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">{pageTitle}</h2>
        <p className="text-gray-600 text-sm">
          {pageType === 'topics' && 'Explore AI concepts and their relationships. Drag nodes to rearrange the graph.'}
          {pageType === 'tools' && 'Discover tools and platforms for AI development. Drag nodes to rearrange the graph.'}
          {pageType === 'arxiv' && 'Browse research papers and related concepts. Drag nodes to rearrange the graph.'}
        </p>
      </div>
    
      {(loading || isLoading) && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-blue-500">Loading data...</p>
          </div>
        </div>
      )}

      {nodes.length === 0 && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Found</h3>
            <p className="text-gray-600">
              No {pageType} data was found to display. 
              Try refreshing the page or check the database connection.
            </p>
          </div>
        </div>
      )}

      <div className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          panOnScroll={true}   // Enable panning on scroll
          selectionOnDrag={true} // Enable selecting nodes on drag
          zoomOnPinch={true}   // Enable zooming with pinch
          zoomOnScroll={true}  // Enable zooming with scroll
          zoomOnDoubleClick={true} // Enable zooming on double click
        >
          <Background 
            color="#aaa" 
            gap={16} 
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <Controls />
        </ReactFlow>
      </div>

      <InfoModal
        isOpen={infoModalOpen}
        onClose={closeInfoModal}
        node={selectedNode}
        additionalInfo={additionalInfo}
      />
    </div>
  );
} 