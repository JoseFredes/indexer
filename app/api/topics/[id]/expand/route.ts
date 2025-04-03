import { NextResponse } from 'next/server';
import { getDb, addTopic, addPaper, addAiTool, addRelationship } from '../../../../lib/db';
import { searchArxiv } from '../../../../lib/arxiv-service';
import { getRelatedAITopics, getRelatedAITools } from '../../../../lib/openai-service';
import { Topic } from '../../../../types';

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
      return NextResponse.json({ error: 'Invalid topic ID' }, { status: 400 });
    }

    const db = await getDb();
    
    // Fetch the topic
    const topic = await db.get('SELECT * FROM topics WHERE id = ?', id);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Check if we've already expanded this topic
    const existingRelationships = await db.all(
      'SELECT * FROM relationships WHERE source_id = ? AND source_type = "topic"',
      id
    );

    if (existingRelationships.length > 0) {
      // If already expanded, return existing related nodes
      const relatedTopicIds = existingRelationships
        .filter((rel: Relationship) => rel.target_type === 'topic')
        .map((rel: Relationship) => rel.target_id);
      
      const relatedToolIds = existingRelationships
        .filter((rel: Relationship) => rel.target_type === 'tool')
        .map((rel: Relationship) => rel.target_id);
      
      const relatedPaperIds = existingRelationships
        .filter((rel: Relationship) => rel.target_type === 'paper')
        .map((rel: Relationship) => rel.target_id);
      
      const topics = relatedTopicIds.length > 0
        ? await db.all('SELECT * FROM topics WHERE id IN (' + relatedTopicIds.join(',') + ')')
        : [];
      
      const tools = relatedToolIds.length > 0
        ? await db.all('SELECT * FROM ai_tools WHERE id IN (' + relatedToolIds.join(',') + ')')
        : [];
      
      const papers = relatedPaperIds.length > 0
        ? await db.all('SELECT * FROM papers WHERE id IN (' + relatedPaperIds.join(',') + ')')
        : [];

      return NextResponse.json({
        topics,
        tools,
        papers,
        relationships: existingRelationships
      }, { status: 200 });
    }

    // Otherwise, fetch new related data
    const [relatedTopics, relatedTools, papers] = await Promise.all([
      // Get related topics
      getRelatedAITopics(topic.name, 2),
      // Get related AI tools
      getRelatedAITools(topic.name),
      // Search for related papers on ArXiv
      searchArxiv(topic.name, 5)
    ]);
    
    // Save everything to the database
    const newTopicIds = [];
    for (const relTopic of relatedTopics) {
      // Generate detailed information for the topic
      const detailed_info = `${relTopic.name} is a concept in the field of ${topic.name}. ${relTopic.description}`;
      
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
        source_type: 'topic',
        target_id: topicId,
        target_type: 'topic',
        relationship_type: 'related'
      });
    }
    
    const newToolIds = [];
    for (const tool of relatedTools) {
      // Generate detailed information for the tool
      const detailed_info = `${tool.name} is a ${tool.category} related to ${topic.name}. ${tool.description}`;
      
      const toolId = await addAiTool({
        name: tool.name,
        description: tool.description,
        url: tool.url,
        category: tool.category,
        veracity_score: tool.veracity_score,
        detailed_info: detailed_info
      });
      newToolIds.push(toolId);
      
      // Add relationship
      await addRelationship({
        source_id: id,
        source_type: 'topic',
        target_id: toolId,
        target_type: 'tool',
        relationship_type: 'related'
      });
    }
    
    const newPaperIds = [];
    for (const paper of papers) {
      // Generate detailed information for the paper
      const detailed_info = `"${paper.title}" is a research paper authored by ${paper.authors}. The paper discusses: ${paper.summary}`;
      
      const paperId = await addPaper({
        ...paper,
        detailed_info: detailed_info
      });
      newPaperIds.push(paperId);
      
      // Add relationship
      await addRelationship({
        source_id: id,
        source_type: 'topic',
        target_id: paperId,
        target_type: 'paper',
        relationship_type: 'related'
      });
    }
    
    // Fetch the newly added items to return them
    const newTopics = newTopicIds.length > 0
      ? await db.all('SELECT * FROM topics WHERE id IN (' + newTopicIds.join(',') + ')')
      : [];
    
    const newTools = newToolIds.length > 0
      ? await db.all('SELECT * FROM ai_tools WHERE id IN (' + newToolIds.join(',') + ')')
      : [];
    
    const newPapers = newPaperIds.length > 0
      ? await db.all('SELECT * FROM papers WHERE id IN (' + newPaperIds.join(',') + ')')
      : [];
    
    const newRelationships = await db.all(
      'SELECT * FROM relationships WHERE source_id = ? AND source_type = "topic"',
      id
    );
    
    return NextResponse.json({
      topics: newTopics,
      tools: newTools,
      papers: newPapers,
      relationships: newRelationships
    }, { status: 200 });
  } catch (error) {
    console.error('Error expanding topic:', error);
    return NextResponse.json({ error: 'Failed to expand topic' }, { status: 500 });
  }
} 