import { Node, Edge } from 'reactflow';

// Basic entity types
export interface Topic {
  id: number;
  name: string;
  description: string;
  source: string;
  parent_id?: number;
  veracity_score: number;
  created_at?: string;
}

export interface Paper {
  id: number;
  arxiv_id: string;
  title: string;
  authors: string;
  summary: string;
  published_date: string;
  url: string;
  created_at?: string;
  categories?: string[];
}

export interface AiTool {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  veracity_score: number;
  created_at?: string;
}

export interface Relationship {
  id: number;
  source_id: number;
  source_type: 'topic' | 'paper' | 'tool';
  target_id: number;
  target_type: 'topic' | 'paper' | 'tool';
  relationship_type: string;
  created_at?: string;
}

// React Flow specific types
export interface TopicNode extends Node {
  data: {
    label: string;
    description: string;
    type: 'topic';
    veracity_score: number;
    originalData: Topic;
  };
}

export interface PaperNode extends Node {
  data: {
    label: string;
    description: string;
    type: 'paper';
    authors: string;
    url: string;
    originalData: Paper;
  };
}

export interface ToolNode extends Node {
  data: {
    label: string;
    description: string;
    type: 'tool';
    category: string;
    url: string;
    veracity_score: number;
    originalData: AiTool;
  };
}

export type CustomNode = TopicNode | PaperNode | ToolNode;

export interface CustomEdge extends Edge {
  data?: {
    relationship_type: string;
  };
}

// Search and indexing types
export interface SearchResult {
  id: string;
  type: 'topic' | 'paper' | 'tool';
  title: string;
  description: string;
  veracity_score?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
} 