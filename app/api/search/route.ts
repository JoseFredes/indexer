import { NextResponse } from 'next/server';
import { getDb } from '../../lib/db';
import { SearchResult } from '../../types';

export async function GET(request: Request) {
  try {
    // Extract query from the request
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        results: [] 
      }, { status: 200 });
    }
    
    const db = await getDb();
    const searchTerm = `%${query}%`;
    
    // Search in topics
    const topics = await db.all(
      `SELECT id, 'topic' as type, name as title, description, veracity_score
       FROM topics
       WHERE name LIKE ? OR description LIKE ?
       LIMIT 10`,
      [searchTerm, searchTerm]
    );
    
    // Search in papers
    const papers = await db.all(
      `SELECT id, 'paper' as type, title, summary as description
       FROM papers
       WHERE title LIKE ? OR summary LIKE ? OR authors LIKE ?
       LIMIT 10`,
      [searchTerm, searchTerm, searchTerm]
    );
    
    // Search in tools
    const tools = await db.all(
      `SELECT id, 'tool' as type, name as title, description, veracity_score
       FROM ai_tools
       WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
       LIMIT 10`,
      [searchTerm, searchTerm, searchTerm]
    );
    
    // Combine and transform results
    const results: SearchResult[] = [
      ...topics.map((t: any) => ({
        id: `topic-${t.id}`,
        type: 'topic' as const,
        title: t.title,
        description: t.description || '',
        veracity_score: t.veracity_score
      })),
      ...papers.map((p: any) => ({
        id: `paper-${p.id}`,
        type: 'paper' as const,
        title: p.title,
        description: p.description || ''
      })),
      ...tools.map((t: any) => ({
        id: `tool-${t.id}`,
        type: 'tool' as const,
        title: t.title,
        description: t.description || '',
        veracity_score: t.veracity_score
      }))
    ];
    
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ 
      error: 'Failed to perform search' 
    }, { status: 500 });
  }
} 