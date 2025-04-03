import { NextResponse } from 'next/server';
import { getAllPapers } from '@/app/lib/data';

export async function GET() {
  try {
    // Get all research papers from JSON data store
    const papers = getAllPapers();
    
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