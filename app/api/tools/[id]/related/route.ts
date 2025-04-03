import { NextResponse } from 'next/server';
import { 
  getToolById, 
  getRelatedTopics 
} from '@/app/lib/data';

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
      return NextResponse.json({ error: 'Invalid tool ID' }, { status: 400 });
    }

    // Fetch the tool from JSON data store
    const tool = getToolById(id);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Get related topics from the JSON data store
    const relatedTopics = getRelatedTopics(id, 'tool');

    return NextResponse.json({
      topics: relatedTopics,
      papers: [],
      tools: []
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error getting related topics for tool:', error);
    return NextResponse.json({ 
      error: 'Failed to get related topics for tool' 
    }, { status: 500 });
  }
} 