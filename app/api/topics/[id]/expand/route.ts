import { NextResponse } from 'next/server';
import { 
  getTopicById, 
  getRelatedTopics, 
  getRelatedTools,
  getRelatedPapers,
  addTopic, 
  addPaper, 
  addAiTool, 
  addRelationship 
} from '@/app/lib/data';
import { searchArxiv } from '@/app/lib/arxiv-service';
import { getRelatedAITopics, getRelatedAITools } from '@/app/lib/openai-service';
import { Topic } from '@/app/types';

// Define a type for relationships
interface Relationship {
  id: number;
  source_id: number;
  source_type: string;
  target_id: number;
  target_type: string;
  relationship_type: string;
  created_at?: string;
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Usar la desestructuración correctamente para Next.js 15
    const { params } = context;
    const { id: idString } = params;
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid topic ID' }, { status: 400 });
    }

    // Fetch the topic from JSON data store
    const topic = getTopicById(id);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Get related nodes from the JSON data store
    const relatedTopics = getRelatedTopics(id, 'topic');
    const relatedTools = getRelatedTools(id, 'topic');
    const relatedPapers = getRelatedPapers(id, 'topic');

    // In a real implementation with a writable data store, 
    // this is where we would request new relationships from the AI services
    // For now, we'll just return the existing relationships

    return NextResponse.json({
      topics: relatedTopics,
      tools: relatedTools,
      papers: relatedPapers
    }, { status: 200 });

  } catch (error) {
    console.error('Error expanding topic:', error);
    return NextResponse.json({ error: 'Failed to expand topic' }, { status: 500 });
  }
} 