import { NextResponse } from 'next/server';
import { 
  getToolById, 
  getRelatedTopics, 
  getRelatedPapers,
  addTopic,
  addRelationship
} from '@/app/lib/data';
import { getRelatedAITopics } from '@/app/lib/openai-service';

// Define a type for relationships
interface Relationship {
  id: number;
  source_id: number;
  source_type: string;
  target_id: number;
  target_type: string;
  relationship_type: string;
  created_at?: string;
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    console.log('Starting tools/[id]/expand route handler with context:', context);
    // Correctly await params in Next.js 15
    const params = await context.params;
    console.log('Params received after await:', params);
    const idString = params.id;
    const id = parseInt(idString);
    console.log(`Processing tool ID: ${id}`);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid tool ID' }, { status: 400 });
    }

    // Fetch the tool from JSON data store
    const tool = getToolById(id);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Get existing related topics
    let relatedTopics = getRelatedTopics(id, 'tool');
    const relatedPapers = getRelatedPapers(id, 'tool');

    console.log(`Found related items for tool ${id}:`, {
      topicsCount: relatedTopics?.length || 0,
      papersCount: relatedPapers?.length || 0
    });

    // If there are no related topics, fetch from OpenAI
    if (!relatedTopics || relatedTopics.length === 0) {
      console.log(`No related topics found for tool ${id}, querying OpenAI...`);
      try {
        // Get related topics from OpenAI
        const newRelatedTopics = await getRelatedAITopics(tool.name);
        console.log(`Retrieved ${newRelatedTopics.length} new topics from OpenAI`);
        
        // In a real implementation, we would save these to the database
        // For now, we'll just return them without saving
        
        // Add the topics
        for (const topic of newRelatedTopics) {
          const topicId = addTopic({
            name: topic.name,
            description: topic.description,
            source: 'openai',
            veracity_score: topic.veracity_score || 0.5
          });
          
          // Add the relationship
          addRelationship({
            source_id: id,
            source_type: 'tool',
            target_id: topicId,
            target_type: 'topic',
            relationship_type: 'related'
          });
        }
        
        // Return the new topics
        relatedTopics = newRelatedTopics;
      } catch (error) {
        console.error('Error fetching topics from OpenAI:', error);
        // Continue with empty topics
      }
    }

    return NextResponse.json({
      topics: relatedTopics || [],
      papers: relatedPapers || [],
      tools: [], // No tool-to-tool relationships in this simplified version
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error expanding tool:', error);
    return NextResponse.json({ 
      error: 'Failed to expand tool' 
    }, { status: 500 });
  }
} 