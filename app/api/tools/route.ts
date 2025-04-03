import { NextResponse } from 'next/server';
import { getDb } from '../../lib/db';

export async function GET() {
  try {
    const db = await getDb();
    
    // Get all AI tools
    const tools = await db.all('SELECT * FROM ai_tools');
    
    return NextResponse.json({ 
      tools
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching AI tools:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch AI tools' 
    }, { status: 500 });
  }
} 