import { NextResponse } from 'next/server';
import { getToolById } from '@/app/lib/data';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // En Next.js 15, usamos la destructuración correctamente
    const { params } = context;
    const { id: idString } = params;
    const id = parseInt(idString);
    
    console.log(`API: Getting info for tool ID ${id}`);
    
    if (isNaN(id)) {
      console.error('Invalid tool ID:', idString);
      return NextResponse.json({ error: 'Invalid tool ID' }, { status: 400 });
    }
    
    // Fetch the tool with detailed information from JSON data store
    const tool = getToolById(id);
    console.log('API: Tool found:', tool);
    
    if (!tool) {
      console.error('Tool not found with ID:', id);
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Use the detailed_info from the data store
    const info = tool.detailed_info || 
      `${tool.name} is an AI tool in the category of ${tool.category}. It is described as: ${tool.description}`;
    
    console.log('API: Returning info:', { info });  
    return NextResponse.json({ info }, { status: 200 });
  } catch (error) {
    console.error('Error getting tool info:', error);
    return NextResponse.json({ error: 'Failed to get tool information' }, { status: 500 });
  }
} 