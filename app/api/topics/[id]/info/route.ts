import { NextResponse } from 'next/server';
import { getDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Next.js 15 requiere que usemos context.params en lugar de desestructurar params
    const idString = context.params.id;
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid topic ID' }, { status: 400 });
    }

    const db = await getDb();
    
    // Fetch the topic with detailed information
    const topic = await db.get('SELECT * FROM topics WHERE id = ?', id);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Use the detailed_info from the database
    const info = topic.detailed_info || 
      `${topic.name} is a concept in the field of artificial intelligence. It is described as: ${topic.description}`;
    
    return NextResponse.json({ info }, { status: 200 });
  } catch (error) {
    console.error('Error getting topic info:', error);
    return NextResponse.json({ error: 'Failed to get topic information' }, { status: 500 });
  }
} 