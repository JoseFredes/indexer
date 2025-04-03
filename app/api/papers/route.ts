import { NextResponse } from 'next/server';
import { getDb } from '../../lib/db';

export async function GET() {
  try {
    const db = await getDb();
    
    // Get all research papers
    const papers = await db.all('SELECT * FROM papers');
    
    return NextResponse.json({ 
      papers
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch research papers' 
    }, { status: 500 });
  }
} 