import { NextResponse } from 'next/server';
import { getDb, seedDatabase } from '@/app/lib/db';

// Helper para verificar si hay datos en la base de datos
async function checkForData(db: any) {
  const topicsCount = await db.get('SELECT COUNT(*) as count FROM topics');
  const toolsCount = await db.get('SELECT COUNT(*) as count FROM ai_tools');
  const papersCount = await db.get('SELECT COUNT(*) as count FROM papers');
  
  console.log(`DB Check: Topics=${topicsCount.count}, Tools=${toolsCount.count}, Papers=${papersCount.count}`);
  
  return {
    hasData: topicsCount.count > 0 && toolsCount.count > 0 && papersCount.count > 0,
    counts: {
      topics: topicsCount.count,
      tools: toolsCount.count,
      papers: papersCount.count
    }
  };
}

export async function GET() {
  console.log("API: Fetching initial topics");
  let seedError = null;

  try {
    // Intentar inicializar la base de datos sin forzar
    try {
      console.log("API: Intentando seed inicial (no forzado)");
      await seedDatabase(false);
    } catch (error) {
      console.warn("API: Error en seed inicial (no forzado):", error);
      seedError = error;
    }

    const db = await getDb();
    
    // Verificar si hay datos
    const dataCheck = await checkForData(db);
    
    // Si no hay datos después del intento inicial, intentar forzar el seed
    if (!dataCheck.hasData) {
      console.log("API: No se encontraron datos, intentando seed forzado");
      try {
        await seedDatabase(true);
        console.log("API: Seed forzado completado");
      } catch (error) {
        console.error("API: Error en seed forzado:", error);
        seedError = error;
      }
    }

    // Obtener topics de ambas fuentes
    console.log("API: Fetching topics from database");
    const topicsInitial = await db.all('SELECT * FROM topics WHERE source = "initial_seed"');
    const topicsAdvanced = await db.all('SELECT * FROM topics WHERE source = "advanced_seed"');
    
    console.log(`API: Found ${topicsInitial.length} initial topics and ${topicsAdvanced.length} advanced topics`);

    // Fetch tools
    const tools = await db.all('SELECT * FROM ai_tools');
    console.log(`API: Found ${tools.length} tools`);

    // Fetch papers
    const papers = await db.all('SELECT * FROM papers');
    console.log(`API: Found ${papers.length} papers`);

    // Fetch topic relationships (para cualquier tipo de relación)
    const relationships = await db.all(`
      SELECT r.id, r.source_id, r.source_type, r.target_id, r.target_type, r.strength
      FROM relationships r
      WHERE r.source_type = 'topic' OR r.target_type = 'topic'
    `);
    console.log(`API: Found ${relationships.length} relationships`);

    // Eliminar duplicados si los hubiera (no debería haber, pero por seguridad)
    const uniqueTopics = [...new Map([...topicsInitial, ...topicsAdvanced].map(item => [item.id, item])).values()];

    // Retornar los datos
    return NextResponse.json({
      topics: uniqueTopics,
      tools,
      papers,
      relationships,
      meta: {
        seed: {
          attempted: true,
          error: seedError ? String(seedError) : null,
          dataCounts: dataCheck.counts
        },
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
      details: error instanceof Error ? error.message : String(error),
      seedError: seedError ? String(seedError) : null
    }, { status: 500 });
  }
} 