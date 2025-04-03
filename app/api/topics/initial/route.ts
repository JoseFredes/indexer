import { NextResponse } from 'next/server';
import { getTopics, getRelationships, seedDatabase, getDb } from '../../../lib/db';
import { Topic } from '../../../types';

interface Relationship {
  id: number;
  source_id: number;
  source_type: string;
  target_id: number;
  target_type: string;
  relationship_type: string;
  created_at?: string;
}

export async function GET() {
  try {
    console.log("API: /api/topics/initial - Initializing database and fetching initial data");
    
    // Ensure the database is seeded
    let seedError = null;
    try {
      // Intenta hacer el seed, pero no fuerza si ya existen datos
      await seedDatabase(false);
    } catch (error) {
      seedError = error;
      console.error("Error seeding database:", error);
      // Continuamos de todos modos, para intentar devolver datos si los hay
    }
    
    // Fetch initial topics and relationships including advanced topics
    const db = await getDb();
    
    console.log("API: Fetching topics, tools, papers and relationships");
    
    // Verificar si tenemos algún dato
    const hasData = await checkForData(db);
    
    if (!hasData) {
      console.log("No data found after normal seed, attempting force seed...");
      try {
        // Si no hay datos, intentamos forzar el seed
        await seedDatabase(true);
      } catch (forceError) {
        console.error("Error during forced seed:", forceError);
        // Continuamos aún con el error
      }
    }
    
    // Get topics from both initial_seed and advanced_seed sources
    const topics = await db.all(`
      SELECT DISTINCT * FROM topics 
      WHERE source IN ('initial_seed', 'advanced_seed')
    `);
    
    console.log(`API: Found ${topics.length} topics`);
    
    // Crear un mapa para garantizar no hay duplicados por ID
    const uniqueTopics = new Map<number, Topic>();
    topics.forEach((topic: Topic) => {
      // Solo guardar el tema si aún no existe en el mapa de temas únicos
      if (!uniqueTopics.has(topic.id)) {
        uniqueTopics.set(topic.id, topic);
      }
    });
    
    // Obtener herramientas de IA (limitamos a 15 para no sobrecargar la interfaz)
    const tools = await db.all(`
      SELECT * FROM ai_tools
      LIMIT 15
    `);
    
    console.log(`API: Found ${tools.length} tools`);
    
    // Obtener papers (limitamos a 15 para no sobrecargar la interfaz)
    const papers = await db.all(`
      SELECT * FROM papers
      LIMIT 15
    `);
    
    console.log(`API: Found ${papers.length} papers`);
    
    // Get all relationships between all entities (topics, tools, papers)
    const relationships = await db.all(`
      SELECT DISTINCT r.* FROM relationships r
      WHERE (r.source_type = 'topic' AND r.target_type = 'topic')
         OR (r.source_type = 'tool' OR r.target_type = 'tool')
         OR (r.source_type = 'paper' OR r.target_type = 'paper')
      LIMIT 300
    `);
    
    console.log(`API: Found ${relationships.length} relationships`);
    
    // Crear un mapa para garantizar no hay relaciones duplicadas
    const uniqueRelationships = new Map<string, Relationship>();
    relationships.forEach((rel: Relationship) => {
      const key = `${rel.source_id}-${rel.source_type}-${rel.target_id}-${rel.target_type}`;
      // Solo guardar la relación si aún no existe una igual
      if (!uniqueRelationships.has(key)) {
        uniqueRelationships.set(key, rel);
      }
    });
    
    console.log("API: Returning data to client");
    
    return NextResponse.json({ 
      topics: Array.from(uniqueTopics.values()), 
      tools: tools,
      papers: papers,
      relationships: Array.from(uniqueRelationships.values())
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching initial topics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch initial topics',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Función auxiliar para verificar si hay datos en la BD
async function checkForData(db: any) {
  const topicsCount = await db.get('SELECT COUNT(*) as count FROM topics');
  const toolsCount = await db.get('SELECT COUNT(*) as count FROM ai_tools');
  const papersCount = await db.get('SELECT COUNT(*) as count FROM papers');
  
  return topicsCount.count > 0 || toolsCount.count > 0 || papersCount.count > 0;
} 