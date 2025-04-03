import { NextResponse } from 'next/server';
import { 
  getPaperById, 
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
    // Correctly await params in Next.js 15
    const params = await context.params;
    const idString = params.id;
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid paper ID' }, { status: 400 });
    }

    // Fetch the paper from JSON data store
    const paper = getPaperById(id);
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Get related topics from the JSON data store
    const relatedTopics = getRelatedTopics(id, 'paper');

    return NextResponse.json({
      topics: relatedTopics,
      papers: [],
      tools: []
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error getting related topics for paper:', error);
    return NextResponse.json({ 
      error: 'Failed to get related topics for paper' 
    }, { status: 500 });
  }
} 