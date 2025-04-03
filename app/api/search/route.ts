import { NextResponse } from 'next/server';
import { searchInData } from '../../lib/data';
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
    
    console.log('Search API: Searching for:', query);
    
    // Usar la función de búsqueda en memoria en lugar de la base de datos
    const { topics, papers, tools } = searchInData(query);
    
    console.log(`Search API: Found ${topics.length} topics, ${papers.length} papers, ${tools.length} tools`);
    
    // Combine and transform results
    const results: SearchResult[] = [
      ...topics.map((t: any) => ({
        id: `topic-${t.id}`,
        type: 'topic' as const,
        title: t.name,
        description: t.description || '',
        veracity_score: t.veracity_score
      })),
      ...papers.map((p: any) => ({
        id: `paper-${p.id}`,
        type: 'paper' as const,
        title: p.title,
        description: p.summary || '',
      })),
      ...tools.map((t: any) => ({
        id: `tool-${t.id}`,
        type: 'tool' as const,
        title: t.name,
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