import { NextResponse } from 'next/server';
import { 
  getTopicById, 
  getRelatedTopics, 
  getRelatedTools,
  getRelatedPapers,
  addTopic, 
  addPaper, 
  addAiTool, 
  addRelationship 
} from '@/app/lib/data';
import { searchArxiv } from '@/app/lib/arxiv-service';
import { getRelatedAITopics, getRelatedAITools } from '@/app/lib/openai-service';
import { Topic } from '@/app/types';

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
    console.log('Starting topics/[id]/expand route handler with context:', context);
    // Correctly await params in Next.js 15
    const params = await context.params;
    console.log('Params received after await:', params);
    const idString = params.id;
    const id = parseInt(idString);
    console.log(`Processing topic ID: ${id}`);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid topic ID' }, { status: 400 });
    }

    // Fetch the topic from JSON data store
    const topic = getTopicById(id);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Get related nodes from the JSON data store
    let relatedTopics = getRelatedTopics(id, 'topic');
    let relatedTools = getRelatedTools(id, 'topic');
    const relatedPapers = getRelatedPapers(id, 'topic');

    console.log(`Found related items for topic ${id}:`, {
      topicsCount: relatedTopics?.length || 0,
      toolsCount: relatedTools?.length || 0,
      papersCount: relatedPapers?.length || 0
    });

    // If there are no related topics, fetch from OpenAI
    if (!relatedTopics || relatedTopics.length === 0) {
      console.log(`No related topics found for topic ${id}, querying OpenAI...`);
      try {
        // Get related topics from OpenAI
        const newRelatedTopics = await getRelatedAITopics(topic.name);
        console.log(`Retrieved ${newRelatedTopics.length} new topics from OpenAI`);
        
        // In a real implementation, we would save these to the database
        // For now, we'll just return them without saving
        
        // Add the topics
        for (const newTopic of newRelatedTopics) {
          const topicId = addTopic({
            name: newTopic.name,
            description: newTopic.description,
            source: 'openai',
            veracity_score: newTopic.veracity_score || 0.5
          });
          
          // Add the relationship
          addRelationship({
            source_id: id,
            source_type: 'topic',
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
    
    // If there are no related tools, fetch from OpenAI
    if (!relatedTools || relatedTools.length === 0) {
      console.log(`No related tools found for topic ${id}, querying OpenAI...`);
      try {
        // Get related tools from OpenAI
        const newRelatedTools = await getRelatedAITools(topic.name);
        console.log(`Retrieved ${newRelatedTools.length} new tools from OpenAI`);
        
        // In a real implementation, we would save these to the database
        // For now, we'll just return them without saving
        
        // Add the tools
        for (const tool of newRelatedTools) {
          const toolId = addAiTool({
            name: tool.name,
            description: tool.description,
            category: tool.category,
            url: tool.url,
            veracity_score: tool.veracity_score || 0.5
          });
          
          // Add the relationship
          addRelationship({
            source_id: id,
            source_type: 'topic',
            target_id: toolId,
            target_type: 'tool',
            relationship_type: 'related'
          });
        }
        
        // Return the new tools
        relatedTools = newRelatedTools;
      } catch (error) {
        console.error('Error fetching tools from OpenAI:', error);
        // Continue with empty tools
      }
    }

    return NextResponse.json({
      topics: relatedTopics || [],
      tools: relatedTools || [],
      papers: relatedPapers || []
    }, { status: 200 });

  } catch (error) {
    console.error('Error expanding topic:', error);
    return NextResponse.json({ error: 'Failed to expand topic' }, { status: 500 });
  }
} 