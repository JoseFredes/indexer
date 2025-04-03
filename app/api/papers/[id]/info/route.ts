import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Next.js 15 requiere que usemos context.params en lugar de desestructurar params
    const idString = context.params.id;
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid paper ID' }, { status: 400 });
    }

    const db = await getDb();
    
    // Fetch the paper with detailed information
    const paper = await db.get('SELECT * FROM papers WHERE id = ?', id);
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Use the detailed_info from the database
    const info = paper.detailed_info || 
      `"${paper.title}" is a research paper authored by ${paper.authors}. The paper discusses: ${paper.summary}`;
    
    return NextResponse.json({ info }, { status: 200 });
  } catch (error) {
    console.error('Error getting paper info:', error);
    return NextResponse.json({ error: 'Failed to get paper information' }, { status: 500 });
  }
} 