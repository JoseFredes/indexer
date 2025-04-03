import { useState, useCallback, useEffect } from 'react';
import { useReactFlow, Node, Edge, XYPosition, Connection, addEdge } from 'reactflow';
import axios from 'axios';
import { 
  CustomNode, 
  CustomEdge, 
  Topic, 
  Paper, 
  AiTool, 
  TopicNode,
  PaperNode, 
  ToolNode
} from '../types';

// Helper functions
function createTopicNode(topic: Topic, position: XYPosition): TopicNode {
  return {
    id: `topic-${topic.id}`,
    type: 'customNode',
    position,
    data: {
      label: topic.name,
      description: topic.description,
      type: 'topic',
      veracity_score: topic.veracity_score,
      originalData: topic
    }
  };
}

function createPaperNode(paper: Paper, position: XYPosition): PaperNode {
  return {
    id: `paper-${paper.id}`,
    type: 'customNode',
    position,
    data: {
      label: paper.title,
      description: paper.summary,
      type: 'paper',
      authors: paper.authors,
      url: paper.url,
      originalData: paper
    }
  };
}

function createToolNode(tool: AiTool, position: XYPosition): ToolNode {
  return {
    id: `tool-${tool.id}`,
    type: 'customNode',
    position,
    data: {
      label: tool.name,
      description: tool.description,
      type: 'tool',
      category: tool.category,
      url: tool.url,
      veracity_score: tool.veracity_score,
      originalData: tool
    }
  };
}

// Helper function to get topic color based on veracity score
function getTopicColor(topic: any): string {
  const score = topic.veracity_score || 0.5;
  
  // Color scheme based on veracity score
  if (score >= 0.8) {
    return '#e6f7ff'; // high veracity - light blue
  } else if (score >= 0.5) {
    return '#fff7e6'; // medium veracity - light orange
  } else {
    return '#fff1f0'; // low veracity - light red
  }
}

function getNodePosition(parentNode: Node | null, nodeIndex: number, totalNodes: number): XYPosition {
  // Position calculations based on parent node
  if (parentNode) {
    const radius = 300;
    const angle = (2 * Math.PI / totalNodes) * nodeIndex;
    
    return {
      x: parentNode.position.x + radius * Math.cos(angle),
      y: parentNode.position.y + radius * Math.sin(angle)
    };
  }
  
  // Default position for root nodes
  return { x: 400, y: 300 };
}

export default function useGraphData() {
  const { getNodes, setNodes, getEdges, setEdges, addNodes, addEdges } = useReactFlow<CustomNode, CustomEdge>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/topics/initial');
        
        const initialNodes: CustomNode[] = [];
        const initialEdges: CustomEdge[] = [];
        
        // Process initial topics
        if (response.data.topics) {
          // Group the main topics (those without parent_id)
          const mainTopics = response.data.topics.filter((topic: Topic) => !topic.parent_id);
          const childTopics = response.data.topics.filter((topic: Topic) => topic.parent_id);
          
          // Arrange main topics in a circular layout
          const centerX = 500;  // Center X of the layout
          const centerY = 300;  // Center Y of the layout
          const radius = 300;  // Radius of the circular layout
          
          mainTopics.forEach((topic: Topic, index: number) => {
            // Calculate position in a circle
            const angle = (2 * Math.PI / mainTopics.length) * index;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            initialNodes.push(createTopicNode(topic, { x, y }));
          });
          
          // Add child topics with a small offset from their parents
          // We'll only add direct children of the initial topics
          childTopics.forEach((topic: Topic) => {
            const parentNode = initialNodes.find(node => 
              node.id === `topic-${topic.parent_id}`
            );
            
            if (parentNode) {
              // Offset from parent with small random variation
              const randomX = (Math.random() - 0.5) * 100;
              const randomY = (Math.random() - 0.5) * 100;
              const position = {
                x: parentNode.position.x + 100 + randomX,
                y: parentNode.position.y + 100 + randomY
              };
              
              initialNodes.push(createTopicNode(topic, position));
            }
          });
          
          // Process initial tools if provided
          if (response.data.tools && response.data.tools.length > 0) {
            // Coloca las herramientas alrededor de los tópicos principales en un círculo exterior
            const toolRadius = radius * 1.5; // Un radio mayor para las herramientas
            
            response.data.tools.forEach((tool: AiTool, index: number) => {
              const angle = (2 * Math.PI / response.data.tools.length) * index;
              const x = centerX + toolRadius * Math.cos(angle);
              const y = centerY + toolRadius * Math.sin(angle);
              
              initialNodes.push(createToolNode(tool, { x, y }));
            });
          }
          
          // Process initial papers if provided
          if (response.data.papers && response.data.papers.length > 0) {
            // Coloca los papers en un círculo exterior aún más grande
            const paperRadius = radius * 1.8; // Un radio mayor para los papers
            
            response.data.papers.forEach((paper: Paper, index: number) => {
              const angle = (2 * Math.PI / response.data.papers.length) * index;
              const x = centerX + paperRadius * Math.cos(angle);
              const y = centerY + paperRadius * Math.sin(angle);
              
              initialNodes.push(createPaperNode(paper, { x, y }));
            });
          }
          
          // Process relationships
          if (response.data.relationships) {
            const edgesMap = new Map();
            
            response.data.relationships.forEach((rel: any, index: number) => {
              const sourceId = `${rel.source_type}-${rel.source_id}`;
              const targetId = `${rel.target_type}-${rel.target_id}`;
              
              // Verify both source and target nodes exist in our filtered set
              const sourceExists = initialNodes.some(node => node.id === sourceId);
              const targetExists = initialNodes.some(node => node.id === targetId);
              
              if (sourceExists && targetExists) {
                // Add unique timestamp to ensure ID uniqueness
                const uniqueTimestamp = Date.now() + Math.floor(Math.random() * 1000) + index;
                const edgeId = `edge-${sourceId}-${targetId}-${uniqueTimestamp}`;
                
                if (!edgesMap.has(edgeId)) {
                  edgesMap.set(edgeId, {
                    id: edgeId,
                    source: sourceId,
                    target: targetId,
                    animated: rel.relationship_type === 'parent-child',
                    style: {
                      strokeWidth: rel.relationship_type === 'parent-child' ? 2 : 1,
                      strokeDasharray: rel.source_type === 'paper' || rel.target_type === 'paper' ? '5,5' : 
                                      (rel.source_type === 'tool' || rel.target_type === 'tool' ? '3,3' : undefined)
                    },
                    data: {
                      relationship_type: rel.relationship_type
                    }
                  });
                }
              }
            });
            
            setEdges(Array.from(edgesMap.values()));
          }
        }
        
        setNodes(initialNodes);
      } catch (error) {
        console.error('Error loading initial graph data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [setNodes, setEdges]);
  
  // Handle node expansion
  const expandNode = useCallback(async (nodeId: string) => {
    console.log('expandNode called with nodeId:', nodeId);
    try {
      setLoading(true);
      
      // Determine node type and ID
      const [nodeType, id] = nodeId.split('-');
      console.log(`Expanding ${nodeType} with ID ${id}`);
      
      // Different API endpoints based on node type
      let endpoint = '';
      if (nodeType === 'topic') {
        endpoint = `/api/topics/${id}/expand`;
      } else if (nodeType === 'tool') {
        endpoint = `/api/tools/${id}/expand`;
      } else if (nodeType === 'paper') {
        endpoint = `/api/papers/${id}/expand`;
      }
      
      console.log(`Fetching from endpoint: ${endpoint}`);
      
      const response = await fetch(endpoint);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error expanding node');
      }
      
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const existingNodeIds = new Set(getNodes().map(n => n.id));
      
      // Process related topics
      if (data.topics && Array.isArray(data.topics)) {
        console.log(`Processing ${data.topics.length} related topics`);
        data.topics.forEach((topic: any) => {
          const topicNodeId = `topic-${topic.id}`;
          
          // Only add if not already in graph
          if (!existingNodeIds.has(topicNodeId)) {
            // Create topic node
            const position = getNodePosition(getNodes().find(n => n.id === nodeId), 0, 0);
            
            newNodes.push({
              id: topicNodeId,
              data: { 
                label: topic.name,
                type: 'topic',
                description: topic.description,
                ...topic
              },
              position,
              style: {
                background: getTopicColor(topic),
                border: '1px solid #ddd',
                color: '#333',
                width: 150,
              },
              draggable: true,
            });
          }
          
          // Connect to expanded node
          // Use timestamp to ensure unique edge IDs
          const uniqueTimestamp = Date.now() + Math.floor(Math.random() * 1000);
          const edgeId = `edge-${nodeId}-${topicNodeId}-${uniqueTimestamp}`;
          
          newEdges.push({
            id: edgeId,
            source: nodeId,
            target: topicNodeId,
            animated: false,
          });
        });
      }
      
      // Process related papers
      const papers = data.papers || [];
      if (papers.length > 0) {
        papers.forEach((paper: any, index: number) => {
          const paperNodeId = `paper-${paper.id}`;
          
          // Only add if not already in graph
          if (!existingNodeIds.has(paperNodeId)) {
            // Create paper node
            const position = getNodePosition(getNodes().find(n => n.id === nodeId), 0, 0);
            
            newNodes.push({
              id: paperNodeId,
              data: { 
                label: paper.title,
                type: 'paper',
                description: paper.abstract,
                url: paper.url,
                ...paper
              },
              position,
              style: {
                background: '#f5f5f5',
                border: '1px solid #ddd',
                color: '#333',
                width: 180,
              },
              draggable: true,
            });
            
            // Connect to the expanded node
            const uniqueTimestamp = Date.now() + Math.floor(Math.random() * 1000) + index;
            const edgeId = `edge-${nodeId}-${paperNodeId}-${uniqueTimestamp}`;
            
            newEdges.push({
              id: edgeId,
              source: nodeId,
              target: paperNodeId,
              style: { strokeDasharray: '5,5' },
            });
          }
          
          // Connect paper to its related topics that already exist in the graph
          paper.topics.forEach((topicId: number, topicIndex: number) => {
            const topicNodeId = `topic-${topicId}`;
            const existingNode = getNodes().find(n => n.id === topicNodeId);
            
            if (existingNode) {
              // Use timestamp to ensure unique edge IDs
              const uniqueTimestamp = Date.now() + Math.floor(Math.random() * 1000) + index + topicIndex;
              const edgeId = `edge-paper-${paper.id}-topic-${topicId}-${uniqueTimestamp}`;
              
              // Only add if edge doesn't already exist
              if (!getEdges().find(e => e.id === edgeId)) {
                newEdges.push({
                  id: edgeId,
                  source: paperNodeId,
                  target: topicNodeId,
                  style: { strokeDasharray: '5,5' },
                });
              }
            }
          });
        });
      }
      
      // Process related tools
      const tools = data.tools || [];
      if (tools.length > 0) {
        tools.forEach((tool: any, index: number) => {
          const toolNodeId = `tool-${tool.id}`;
          
          // Only add if not already in graph
          if (!existingNodeIds.has(toolNodeId)) {
            // Create tool node
            const position = getNodePosition(getNodes().find(n => n.id === nodeId), 0, 0);
            
            newNodes.push({
              id: toolNodeId,
              data: { 
                label: tool.name,
                type: 'tool',
                description: tool.description,
                url: tool.url,
                ...tool
              },
              position,
              style: {
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                color: '#0050b3',
                width: 150,
              },
              draggable: true,
            });
            
            // Connect to the expanded node
            const uniqueTimestamp = Date.now() + Math.floor(Math.random() * 1000) + index;
            const edgeId = `edge-${nodeId}-${toolNodeId}-${uniqueTimestamp}`;
            
            newEdges.push({
              id: edgeId,
              source: nodeId,
              target: toolNodeId,
              style: { strokeDasharray: '3,3' },
            });
          }
          
          // Connect tool to its related topics that already exist in the graph
          tool.topics.forEach((topicId: number, topicIndex: number) => {
            const topicNodeId = `topic-${topicId}`;
            const existingNode = getNodes().find(n => n.id === topicNodeId);
            
            if (existingNode) {
              // Use timestamp to ensure unique edge IDs
              const uniqueTimestamp = Date.now() + Math.floor(Math.random() * 1000) + index + topicIndex;
              const edgeId = `edge-tool-${tool.id}-topic-${topicId}-${uniqueTimestamp}`;
              
              // Only add if edge doesn't already exist
              if (!getEdges().find(e => e.id === edgeId)) {
                newEdges.push({
                  id: edgeId,
                  source: toolNodeId,
                  target: topicNodeId,
                  style: { strokeDasharray: '3,3' },
                });
              }
            }
          });
        });
      }
      
      // Add new nodes and edges to the graph
      addNodes(newNodes);
      addEdges(newEdges);
      
      setLoading(false);
    } catch (error) {
      console.error('Error expanding node:', error);
      setLoading(false);
    }
  }, [getNodes, getEdges, addNodes, addEdges]);
  
  // Handle connection (edge) creation
  const onConnect = useCallback((connection: Connection) => {
    // Generar un ID único para esta conexión
    const timestamp = Date.now();
    const uniqueId = `edge-${connection.source}-${connection.target}-${timestamp}`;
    
    setEdges((edges) => addEdge(
      {
        ...connection, 
        id: uniqueId,
        data: { relationship_type: 'related' }
      } as CustomEdge, 
      edges
    ));
  }, [setEdges]);
  
  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
  }, []);
  
  // Get additional information about a node
  const getNodeInfo = useCallback(async (node: CustomNode) => {
    console.log('getNodeInfo called with node:', node);
    try {
      // Store the selected node first
      setSelectedNode(node);
      
      // Set loading state and open modal immediately
      setLoading(true);
      setInfoModalOpen(true);
      
      // Show loading message
      setAdditionalInfo('Loading information...');
      
      const nodeType = node.data.type;
      const nodeId = node.id.split('-')[1];
      const originalId = parseInt(nodeId);
      
      if (isNaN(originalId)) {
        console.error('Invalid node ID format:', nodeId);
        setAdditionalInfo('Error: Invalid node ID format');
        return false;
      }
      
      const apiUrl = `/api/${nodeType}s/${originalId}/info`;
      console.log(`Fetching info for ${nodeType} with ID ${originalId}`);
      console.log(`API URL: ${apiUrl}`);
      
      try {
        const response = await axios.get(apiUrl);
        console.log('API Response received:', response);
        
        // Check if we have the info field directly in the response
        if (response.data && response.data.info) {
          console.log('Setting additionalInfo from response.data.info:', response.data.info);
          // Ensure we're handling a string here
          setAdditionalInfo(String(response.data.info));
        } else if (response.data) {
          // If we don't have the "info" property, try to use the whole response
          console.log('No info field found, using whole response data:', response.data);
          setAdditionalInfo(typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
        } else {
          console.error('Response did not contain expected data:', response);
          setAdditionalInfo('Information not available in the expected format.');
        }
        
        return true;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error in getNodeInfo:', error.message, error.response?.data);
          setAdditionalInfo(`API Error: ${error.message}. ${error.response?.data?.error || ''}`);
        } else {
          console.error('Unknown error in getNodeInfo:', error);
          setAdditionalInfo('Error retrieving information: ' + (error instanceof Error ? error.message : String(error)));
        }
        return false;
      }
    } catch (error) {
      console.error('Error getting node info:', error);
      setAdditionalInfo('Error retrieving information: ' + (error instanceof Error ? error.message : String(error)));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Close info modal
  const closeInfoModal = useCallback(() => {
    setInfoModalOpen(false);
  }, []);
  
  return {
    loading,
    selectedNode,
    infoModalOpen,
    additionalInfo,
    expandNode,
    onConnect,
    onNodeClick,
    getNodeInfo,
    closeInfoModal
  };
} 