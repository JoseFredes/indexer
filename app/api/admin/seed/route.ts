import { NextResponse } from 'next/server';
import { getDb, seedDatabase } from '../../../../lib/db';

export async function GET() {
  try {
    console.log("ADMIN API: Forzando seed de la base de datos");
    
    const db = await getDb();
    
    // Status actual antes del seed
    const beforeTopicsCount = await db.get('SELECT COUNT(*) as count FROM topics');
    const beforeToolsCount = await db.get('SELECT COUNT(*) as count FROM ai_tools');
    const beforePapersCount = await db.get('SELECT COUNT(*) as count FROM papers');
    const beforeRelCount = await db.get('SELECT COUNT(*) as count FROM relationships');
    
    const beforeStatus = {
      topics: beforeTopicsCount.count,
      tools: beforeToolsCount.count,
      papers: beforePapersCount.count,
      relationships: beforeRelCount.count,
    };
    
    console.log("ADMIN API: Estado actual de la BD:", beforeStatus);
    
    // Forzar seed de la base de datos
    await seedDatabase(true); // Forzar el seed independientemente de si hay datos o no
    
    // Status después del seed
    const afterTopicsCount = await db.get('SELECT COUNT(*) as count FROM topics');
    const afterToolsCount = await db.get('SELECT COUNT(*) as count FROM ai_tools');
    const afterPapersCount = await db.get('SELECT COUNT(*) as count FROM papers');
    const afterRelCount = await db.get('SELECT COUNT(*) as count FROM relationships');
    
    const afterStatus = {
      topics: afterTopicsCount.count,
      tools: afterToolsCount.count,
      papers: afterPapersCount.count,
      relationships: afterRelCount.count,
    };
    
    console.log("ADMIN API: Estado después del seed:", afterStatus);
    
    // Obtener algunos ejemplos de datos para verificar
    const topics = await db.all('SELECT id, name, source FROM topics LIMIT 5');
    const tools = await db.all('SELECT id, name, category FROM ai_tools LIMIT 5');
    const papers = await db.all('SELECT id, title FROM papers LIMIT 5');
    const relationships = await db.all('SELECT id, source_id, source_type, target_id, target_type FROM relationships LIMIT 5');
    
    // Obtener la ruta de la base de datos
    const dbInfo = db.filename ? { path: db.filename } : { info: "No filename available" };
    
    return NextResponse.json({
      success: true,
      dbInfo,
      before: beforeStatus,
      after: afterStatus,
      samples: {
        topics,
        tools,
        papers,
        relationships
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error durante el proceso de seed forzado:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error durante el proceso de seed forzado',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 