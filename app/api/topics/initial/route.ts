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
    // Ensure the database is seeded
    await seedDatabase();
    
    // Fetch initial topics and relationships including advanced topics
    const db = await getDb();
    
    // Get topics from both initial_seed and advanced_seed sources
    const topics = await db.all(`
      SELECT DISTINCT * FROM topics 
      WHERE source IN ('initial_seed', 'advanced_seed')
    `);
    
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
    
    // Obtener papers (limitamos a 15 para no sobrecargar la interfaz)
    const papers = await db.all(`
      SELECT * FROM papers
      LIMIT 15
    `);
    
    // Get all relationships between all entities (topics, tools, papers)
    const relationships = await db.all(`
      SELECT DISTINCT r.* FROM relationships r
      WHERE (r.source_type = 'topic' AND r.target_type = 'topic')
         OR (r.source_type = 'tool' OR r.target_type = 'tool')
         OR (r.source_type = 'paper' OR r.target_type = 'paper')
      LIMIT 300
    `);
    
    // Crear un mapa para garantizar no hay relaciones duplicadas
    const uniqueRelationships = new Map<string, Relationship>();
    relationships.forEach((rel: Relationship) => {
      const key = `${rel.source_id}-${rel.source_type}-${rel.target_id}-${rel.target_type}`;
      // Solo guardar la relación si aún no existe una igual
      if (!uniqueRelationships.has(key)) {
        uniqueRelationships.set(key, rel);
      }
    });
    
    return NextResponse.json({ 
      topics: Array.from(uniqueTopics.values()), 
      tools: tools,
      papers: papers,
      relationships: Array.from(uniqueRelationships.values())
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching initial topics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch initial topics' 
    }, { status: 500 });
  }
} 