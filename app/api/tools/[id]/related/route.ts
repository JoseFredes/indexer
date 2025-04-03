import { NextResponse } from 'next/server';
import { getDb, addTopic, addRelationship } from '../../../../lib/db';
import { getRelatedAITopics } from '../../../../lib/openai-service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
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
        .filter(rel => rel.target_type === 'topic')
        .map(rel => rel.target_id);
      
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

    // Otherwise, generate new related topics
    // Get related topics for the AI tool
    const relatedTopics = await getRelatedAITopics(`${tool.name} - ${tool.description} - ${tool.category}`);
    
    // Save everything to the database
    const newTopicIds = [];
    for (const relTopic of relatedTopics) {
      const topicId = await addTopic({
        name: relTopic.name,
        description: relTopic.description,
        source: 'openai',
        veracity_score: relTopic.veracity_score
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