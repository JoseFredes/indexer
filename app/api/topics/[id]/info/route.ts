import { NextResponse } from 'next/server';
import { getTopicById } from '@/app/lib/data';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Correctly await params in Next.js 15
    const params = await context.params;
    const idString = params.id;
    const id = parseInt(idString);
    
    console.log(`API: Getting info for topic ID ${id}`);
    
    if (isNaN(id)) {
      console.error('Invalid topic ID:', idString);
      return NextResponse.json({ error: 'Invalid topic ID' }, { status: 400 });
    }
    
    // Fetch the topic with detailed information from JSON data store
    const topic = getTopicById(id);
    console.log('API: Topic found:', topic);
    
    if (!topic) {
      console.error('Topic not found with ID:', id);
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Use the detailed_info from the data store
    const info = topic.detailed_info || 
      `${topic.name} is a concept in the field of artificial intelligence. It is described as: ${topic.description}`;
    
    console.log('API: Returning info:', { info });
    return NextResponse.json({ info }, { status: 200 });
  } catch (error) {
    console.error('Error getting topic info:', error);
    return NextResponse.json({ error: 'Failed to get topic information' }, { status: 500 });
  }
} 