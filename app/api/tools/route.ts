import { NextResponse } from 'next/server';
import { getAllTools } from '@/app/lib/data';

export async function GET() {
  try {
    // Get all AI tools from JSON data store
    const tools = getAllTools();
    
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