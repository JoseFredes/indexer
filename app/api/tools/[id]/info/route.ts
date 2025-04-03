import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Next.js 15 requiere que usemos context.params en lugar de desestructurar params
    const idString = context.params.id;
    const id = parseInt(idString);
    
    console.log(`API: Getting info for tool ID ${id}`);
    
    if (isNaN(id)) {
      console.error('Invalid tool ID:', idString);
      return NextResponse.json({ error: 'Invalid tool ID' }, { status: 400 });
    }

    const db = await getDb();
    
    // Fetch the tool with detailed information
    const tool = await db.get('SELECT * FROM ai_tools WHERE id = ?', id);
    console.log('API: Tool found:', tool);
    
    if (!tool) {
      console.error('Tool not found with ID:', id);
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Use the detailed_info from the database
    const info = tool.detailed_info || 
      `${tool.name} is an AI tool in the category of ${tool.category}. It is described as: ${tool.description}`;
    
    console.log('API: Returning info:', { info });  
    return NextResponse.json({ info }, { status: 200 });
  } catch (error) {
    console.error('Error getting tool info:', error);
    return NextResponse.json({ error: 'Failed to get tool information' }, { status: 500 });
  }
} 