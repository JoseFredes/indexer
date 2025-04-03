import { NextResponse } from 'next/server';
import { getPaperById } from '@/app/lib/data';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Correctly await params in Next.js 15
    const params = await context.params;
    const idString = params.id;
    const id = parseInt(idString);
    
    console.log(`API: Getting info for paper ID ${id}`);
    
    if (isNaN(id)) {
      console.error('Invalid paper ID:', idString);
      return NextResponse.json({ error: 'Invalid paper ID' }, { status: 400 });
    }
    
    // Fetch the paper with detailed information from JSON data store
    const paper = getPaperById(id);
    console.log('API: Paper found:', paper);
    
    if (!paper) {
      console.error('Paper not found with ID:', id);
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Use the detailed_info from the data store
    const info = paper.detailed_info || 
      `"${paper.title}" is a research paper ${paper.authors ? `authored by ${paper.authors}` : ''}. ${paper.summary || ''}`;
    
    console.log('API: Returning info:', { info });
    return NextResponse.json({ info }, { status: 200 });
  } catch (error) {
    console.error('Error getting paper info:', error);
    return NextResponse.json({ error: 'Failed to get paper information' }, { status: 500 });
  }
} 