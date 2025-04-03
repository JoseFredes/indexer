import { NextResponse } from 'next/server';
import { 
  getAllTopics, 
  getAllTools, 
  getAllPapers, 
  getAllRelationships,
  getDataCounts
} from '@/app/lib/data';

export async function GET() {
  console.log("API: Fetching initial topics from JSON data store");

  try {
    // Get data from JSON store
    const topics = getAllTopics();
    const tools = getAllTools();
    const papers = getAllPapers();
    const relationships = getAllRelationships();
    const dataCounts = getDataCounts();

    console.log(`API: Found ${topics.length} topics`);
    console.log(`API: Found ${tools.length} tools`);
    console.log(`API: Found ${papers.length} papers`);
    console.log(`API: Found ${relationships.length} relationships`);

    // Return the data
    return NextResponse.json({
      topics,
      tools,
      papers,
      relationships,
      meta: {
        dataCounts,
        environment: {
          nodeEnv: process.env.NODE_ENV || 'unknown',
          isVercel: process.env.VERCEL ? 'true' : 'false'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching initial topics:', error);
    return NextResponse.json({ 
      error: 'Error fetching initial topics',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 