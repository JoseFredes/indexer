import { NextResponse } from 'next/server';
import { 
  getPaperById, 
  getRelatedTopics, 
  getRelatedTools,
  getRelatedPapers
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
      return NextResponse.json({ error: 'Invalid paper ID' }, { status: 400 });
    }

    // Fetch the paper from JSON data store
    const paper = getPaperById(id);
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Get related nodes from the JSON data store
    const relatedTopics = getRelatedTopics(id, 'paper');
    const relatedTools = getRelatedTools(id, 'paper');
    const relatedPapers = getRelatedPapers(id, 'paper');

    // In a real implementation with a writable data store, 
    // this is where we would request new relationships from the AI services
    // For now, we'll just return the existing relationships

    return NextResponse.json({
      topics: relatedTopics,
      tools: relatedTools,
      papers: relatedPapers
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error expanding paper:', error);
    return NextResponse.json({ 
      error: 'Failed to expand paper' 
    }, { status: 500 });
  }
} 