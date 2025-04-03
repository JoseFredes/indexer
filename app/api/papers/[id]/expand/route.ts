import { NextResponse } from 'next/server';
import { getDb, addTopic, addRelationship } from '@/app/lib/db';
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
    // Next.js 15 requiere que usemos context.params en lugar de desestructurar params
    const idString = context.params.id;
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid paper ID' }, { status: 400 });
    }

    const db = await getDb();
    
    // Fetch the paper
    const paper = await db.get('SELECT * FROM papers WHERE id = ?', id);
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Check if we've already expanded this paper
    const existingRelationships = await db.all(
      'SELECT * FROM relationships WHERE source_id = ? AND source_type = "paper"',
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

    // Otherwise, generate new related topics for this paper
    // Extract information from the paper to generate better related topics
    const prompt = `${paper.title} - ${paper.authors} - ${paper.summary}`;
    
    // Get related topics from the paper
    const relatedTopics = await getRelatedAITopics(prompt, 1, 4);
    
    // Save everything to the database
    const newTopicIds = [];
    for (const relTopic of relatedTopics) {
      // Generate detailed information for the topic
      const detailed_info = `${relTopic.name} is a concept discussed in the research paper "${paper.title}". ${relTopic.description}`;
      
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
        source_type: 'paper',
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
      'SELECT * FROM relationships WHERE source_id = ? AND source_type = "paper"',
      id
    );
    
    return NextResponse.json({
      topics: newTopics,
      papers: [],
      tools: [],
      relationships: newRelationships
    }, { status: 200 });
  } catch (error) {
    console.error('Error expanding paper:', error);
    return NextResponse.json({ error: 'Failed to expand paper' }, { status: 500 });
  }
} 