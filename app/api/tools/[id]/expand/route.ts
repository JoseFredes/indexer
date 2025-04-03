import { NextResponse } from 'next/server';
import { 
  getToolById, 
  getRelatedTopics, 
  getRelatedPapers,
  addTopic,
  addRelationship
} from '@/app/lib/data';
import { getRelatedAITopics } from '@/app/lib/openai-service';

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
    // Next.js 15 requiere que usemos context.params en lugar de desestructurar params
    const { params } = context;
    const { id: idString } = params;
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid tool ID' }, { status: 400 });
    }

    // Fetch the tool from JSON data store
    const tool = getToolById(id);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Get existing related topics
    const relatedTopics = getRelatedTopics(id, 'tool');
    const relatedPapers = getRelatedPapers(id, 'tool');

    // In a real implementation that can write to the data store,
    // this is where we would request new relationships from the AI service
    // For now, we'll just return the existing relationships

    return NextResponse.json({
      topics: relatedTopics,
      papers: relatedPapers,
      tools: [], // No tool-to-tool relationships in this simplified version
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error expanding tool:', error);
    return NextResponse.json({ 
      error: 'Failed to expand tool' 
    }, { status: 500 });
  }
} 