import { NextResponse } from 'next/server';
import { getDb, addTopic, addRelationship } from '../../../../lib/db';
import { getRelatedAITopics } from '../../../../lib/openai-service';

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
    // Next.js 15 requiere que usemos context.params en lugar de desestructurar params
    const idString = context.params.id;
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid tool ID' }, { status: 400 });
    }

    const db = await getDb();
    
    // Fetch the tool
    const tool = await db.get('SELECT * FROM ai_tools WHERE id = ?', id);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Check if we've already expanded this tool
    const existingRelationships = await db.all(
      'SELECT * FROM relationships WHERE source_id = ? AND source_type = "tool"',
      id
    );

    if (existingRelationships.length > 0) {
      // If already expanded, return existing related nodes
      const relatedTopicIds = existingRelationships
        .filter((rel: Relationship) => rel.target_type === 'topic')
        .map((rel: Relationship) => rel.target_id);
      
      const topics = relatedTopicIds.length > 0
        ? await db.all('SELECT * FROM topics WHERE id IN (' + relatedTopicIds.join(',') + ')')
        : [];

      return NextResponse.json({
        topics,
        papers: [],
        tools: [],
        relationships: existingRelationships
      }, { status: 200 });
    }

    // Otherwise, generate new related topics for this tool
    // Extract information from the tool to generate better related topics
    const prompt = `${tool.name} - ${tool.category} - ${tool.description}`;
    
    // Get related topics for the tool
    const relatedTopics = await getRelatedAITopics(prompt, 1, 4);
    
    // Save everything to the database
    const newTopicIds = [];
    for (const relTopic of relatedTopics) {
      // Generate detailed information for the topic
      const detailed_info = `${relTopic.name} is a concept related to the AI tool ${tool.name}. ${relTopic.description}`;
      
      const topicId = await addTopic({
        name: relTopic.name,
        description: relTopic.description,
        source: 'openai',
        veracity_score: relTopic.veracity_score,
        detailed_info: detailed_info
      });
      newTopicIds.push(topicId);
      
      // Add relationship
      await addRelationship({
        source_id: id,
        source_type: 'tool',
        target_id: topicId,
        target_type: 'topic',
        relationship_type: 'related'
      });
    }
    
    // Fetch the newly added items to return them
    const newTopics = newTopicIds.length > 0
      ? await db.all('SELECT * FROM topics WHERE id IN (' + newTopicIds.join(',') + ')')
      : [];
    
    const newRelationships = await db.all(
      'SELECT * FROM relationships WHERE source_id = ? AND source_type = "tool"',
      id
    );
    
    return NextResponse.json({
      topics: newTopics,
      papers: [],
      tools: [],
      relationships: newRelationships
    }, { status: 200 });
  } catch (error) {
    console.error('Error expanding tool:', error);
    return NextResponse.json({ error: 'Failed to expand tool' }, { status: 500 });
  }
} 