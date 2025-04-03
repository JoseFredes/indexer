import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize the SQLite database
let db: any = null;

// Función para crear las tablas si no existen
async function createTables() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      source TEXT NOT NULL,
      parent_id INTEGER,
      veracity_score REAL,
      detailed_info TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES topics(id)
    );
    
    CREATE TABLE IF NOT EXISTS papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      arxiv_id TEXT UNIQUE,
      title TEXT NOT NULL,
      authors TEXT,
      summary TEXT,
      published_date TEXT,
      url TEXT,
      detailed_info TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS ai_tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      url TEXT,
      category TEXT,
      veracity_score REAL,
      detailed_info TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id INTEGER NOT NULL,
      source_type TEXT NOT NULL,
      target_id INTEGER NOT NULL,
      target_type TEXT NOT NULL,
      relationship_type TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function getDb() {
  if (!db) {
    // En Vercel, usa el directorio /tmp que es escribible
    const dbPath = process.env.NODE_ENV === 'production' && process.env.VERCEL 
      ? '/tmp/ai-indexer.db' 
      : './ai-indexer.db';
      
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Asegurarnos de que las tablas existen
    await createTables();
  }
  
  return db;
}

// Initialize the database with some seed data
export async function seedDatabase() {
  const db = await getDb();
  
  // Verificar si ya hay datos en la base de datos
  const topicsCount = await db.get('SELECT COUNT(*) as count FROM topics');
  
  // Solo ejecutar la carga de datos si no hay tópicos en la base de datos
  if (topicsCount.count === 0) {
    // Carga inicial de tópicos de IA
    await db.run(`
      INSERT INTO topics (name, description, source, veracity_score, detailed_info)
      VALUES 
        ('Artificial Intelligence', 'The field of AI research and development', 'initial_seed', 1.0, 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. AI technology is rapidly advancing and being integrated into various sectors, including healthcare, finance, education, transportation, and more. Key branches include machine learning, neural networks, natural language processing, robotics, and computer vision. The field faces challenges related to ethics, bias, transparency, and job displacement. Future directions include advancing AI reasoning, integrating neuroscience insights, developing AI-human collaboration, addressing ethical concerns, and creating more specialized applications for industries.'),
        ('Machine Learning', 'A subset of AI focused on learning from data', 'initial_seed', 1.0, 'Machine Learning (ML) is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves. Machine learning evolved from pattern recognition and computational learning theory, and is widely used in data analytics to make predictions or decisions without being explicitly programmed to perform the task. Various techniques include supervised learning (using labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). Applications include image and speech recognition, recommendation systems, fraud detection, and autonomous vehicles. Recent advances include deep learning, transfer learning, and automated machine learning.'),
        ('Large Language Models', 'Models that process and generate human language', 'initial_seed', 1.0, 'Large Language Models (LLMs) are advanced AI systems trained on vast amounts of text data to understand and generate human-like text. These models, which include GPT (Generative Pre-trained Transformer) series, BERT, and others, can perform a wide range of language tasks including translation, summarization, question-answering, content creation, and conversation. LLMs utilize transformer architectures with attention mechanisms that help them understand context and relationships between words. They are trained on diverse corpora including books, articles, websites, and code, enabling them to capture broad knowledge about language and the world. Key challenges include factual accuracy, bias mitigation, transparency, computational requirements, and alignment with human values. Current applications span education, customer service, content creation, programming assistance, and research, with ongoing development focused on improving reasoning abilities and reducing hallucinations.');
    `);
    
    // Add relationships between seed topics
    const topics = await db.all('SELECT * FROM topics');
    const ai = topics.find(t => t.name === 'Artificial Intelligence');
    const ml = topics.find(t => t.name === 'Machine Learning');
    const llm = topics.find(t => t.name === 'Large Language Models');
    
    await db.run(`
      INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type)
      VALUES 
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'parent-child');
    `, [ai.id, ml.id, ml.id, llm.id]);
  }
}

// Helper functions for database operations
export async function getTopics() {
  const db = await getDb();
  return db.all('SELECT * FROM topics');
}

export async function getPapers() {
  const db = await getDb();
  return db.all('SELECT * FROM papers');
}

export async function getAiTools() {
  const db = await getDb();
  return db.all('SELECT * FROM ai_tools');
}

export async function getRelationships() {
  const db = await getDb();
  return db.all('SELECT * FROM relationships');
}

export async function addTopic(topic: any) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO topics (name, description, source, parent_id, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?, ?)',
    [topic.name, topic.description, topic.source, topic.parent_id, topic.veracity_score, topic.detailed_info || null]
  );
  return result.lastID;
}

export async function addPaper(paper: any) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url, detailed_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [paper.arxiv_id, paper.title, paper.authors, paper.summary, paper.published_date, paper.url, paper.detailed_info || null]
  );
  return result.lastID;
}

export async function addAiTool(tool: any) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?, ?)',
    [tool.name, tool.description, tool.url, tool.category, tool.veracity_score, tool.detailed_info || null]
  );
  return result.lastID;
}

export async function addRelationship(relationship: any) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
    [relationship.source_id, relationship.source_type, relationship.target_id, relationship.target_type, relationship.relationship_type]
  );
  return result.lastID;
} 