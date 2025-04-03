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
export async function seedDatabase(force: boolean = false) {
  try {
    const db = await getDb();
    
    // Verificar si ya hay datos en la base de datos
    const topicsCount = await db.get('SELECT COUNT(*) as count FROM topics');
    const toolsCount = await db.get('SELECT COUNT(*) as count FROM ai_tools');
    const papersCount = await db.get('SELECT COUNT(*) as count FROM papers');
    
    console.log(`Seed check - Topics: ${topicsCount.count}, Tools: ${toolsCount.count}, Papers: ${papersCount.count}, Force: ${force}`);
    
    // Solo ejecutar la carga de datos si no hay suficientes datos en la base de datos o si force=true
    if (force || topicsCount.count < 3 || toolsCount.count < 2 || papersCount.count < 2) {
      console.log("Seeding database with initial data...");
      
      // Carga inicial de tópicos de IA si es necesario
      if (force || topicsCount.count < 3) {
        console.log("Adding initial AI topics...");
        await db.run(`
          INSERT INTO topics (name, description, source, veracity_score, detailed_info)
          VALUES 
            ('Artificial Intelligence', 'The field of AI research and development', 'initial_seed', 1.0, 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. AI technology is rapidly advancing and being integrated into various sectors, including healthcare, finance, education, transportation, and more. Key branches include machine learning, neural networks, natural language processing, robotics, and computer vision. The field faces challenges related to ethics, bias, transparency, and job displacement. Future directions include advancing AI reasoning, integrating neuroscience insights, developing AI-human collaboration, addressing ethical concerns, and creating more specialized applications for industries.'),
            ('Machine Learning', 'A subset of AI focused on learning from data', 'initial_seed', 1.0, 'Machine Learning (ML) is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves. Machine learning evolved from pattern recognition and computational learning theory, and is widely used in data analytics to make predictions or decisions without being explicitly programmed to perform the task. Various techniques include supervised learning (using labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). Applications include image and speech recognition, recommendation systems, fraud detection, and autonomous vehicles. Recent advances include deep learning, transfer learning, and automated machine learning.'),
            ('Large Language Models', 'Models that process and generate human language', 'initial_seed', 1.0, 'Large Language Models (LLMs) are advanced AI systems trained on vast amounts of text data to understand and generate human-like text. These models, which include GPT (Generative Pre-trained Transformer) series, BERT, and others, can perform a wide range of language tasks including translation, summarization, question-answering, content creation, and conversation. LLMs utilize transformer architectures with attention mechanisms that help them understand context and relationships between words. They are trained on diverse corpora including books, articles, websites, and code, enabling them to capture broad knowledge about language and the world. Key challenges include factual accuracy, bias mitigation, transparency, computational requirements, and alignment with human values. Current applications span education, customer service, content creation, programming assistance, and research, with ongoing development focused on improving reasoning abilities and reducing hallucinations.');
        `);
        console.log("Added initial AI topics successfully");
      }
      
      // Carga inicial de herramientas de IA si es necesario
      if (force || toolsCount.count < 2) {
        console.log("Adding initial AI tools...");
        await db.run(`
          INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info)
          VALUES 
            ('TensorFlow', 'An open-source machine learning framework developed by Google', 'https://www.tensorflow.org/', 'Machine Learning Framework', 0.95, 'TensorFlow is a Machine Learning Framework related to Neural Networks. An open-source machine learning framework developed by Google'),
            ('PyTorch', 'An open-source machine learning framework developed by Facebook', 'https://pytorch.org/', 'Machine Learning Framework', 0.95, 'PyTorch is an open-source machine learning library developed by Facebook\'s AI Research lab.'),
            ('OpenAI GPT-4', 'A large language model for natural language processing tasks', 'https://openai.com/gpt-4', 'Large Language Model', 0.95, 'GPT-4 is a multimodal large language model created by OpenAI, capable of processing both text and image inputs.'),
            ('DALL-E 2', 'A neural network that creates images from textual descriptions', 'https://openai.com/dall-e-2', 'Image Generation', 0.9, 'DALL-E 2 is an AI system developed by OpenAI that can create realistic images and art from natural language descriptions.'),
            ('Cursor', 'AI-powered code editor based on VSCode', 'https://cursor.com/', 'Developer Tool', 0.95, 'Cursor is an AI-enhanced code editor built on the foundation of Visual Studio Code, designed to integrate large language models into the development workflow.'),
            ('GitHub Copilot', 'AI pair programmer that suggests code in real-time', 'https://github.com/features/copilot', 'Developer Tool', 0.95, 'GitHub Copilot is an AI pair programming tool developed by GitHub in collaboration with OpenAI.');
        `);
        console.log("Added initial AI tools successfully");
      }
      
      // Carga inicial de papers de IA si es necesario
      if (force || papersCount.count < 2) {
        console.log("Adding initial AI papers...");
        await db.run(`
          INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url)
          VALUES 
            ('2303.08774', 'GPT-4 Technical Report', 'OpenAI', 'We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs.', '2023-03-15', 'https://arxiv.org/abs/2303.08774'),
            ('1706.03762', 'Attention Is All You Need', 'Ashish Vaswani et al.', 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.', '2017-06-12', 'https://arxiv.org/abs/1706.03762'),
            ('1810.04805', 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 'Jacob Devlin et al.', 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.', '2018-10-11', 'https://arxiv.org/abs/1810.04805'),
            ('2005.14165', 'Language Models are Few-Shot Learners', 'Tom Brown et al.', 'We demonstrate that scaling language models greatly improves task-agnostic, few-shot performance.', '2020-05-28', 'https://arxiv.org/abs/2005.14165');
        `);
        console.log("Added initial AI papers successfully");
      }
      
      try {
        // Add relationships between seed topics, tools, and papers
        console.log("Setting up relationships between entities...");
        const topics = await db.all('SELECT * FROM topics');
        const tools = await db.all('SELECT * FROM ai_tools');
        const papers = await db.all('SELECT * FROM papers');
        
        console.log(`Found ${topics.length} topics, ${tools.length} tools, ${papers.length} papers`);
        
        const ai = topics.find((t: any) => t.name === 'Artificial Intelligence');
        const ml = topics.find((t: any) => t.name === 'Machine Learning');
        const llm = topics.find((t: any) => t.name === 'Large Language Models');
        
        if (ai && ml && llm) {
          console.log("Found main topics (AI, ML, LLM)");
          
          // Check if relationships already exist
          const relCount = await db.get('SELECT COUNT(*) as count FROM relationships');
          
          if (force || relCount.count < 2) {
            console.log("Adding topic-topic relationships...");
            await db.run(`
              INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type)
              VALUES 
                (?, 'topic', ?, 'topic', 'parent-child'),
                (?, 'topic', ?, 'topic', 'parent-child');
            `, [ai.id, ml.id, ml.id, llm.id]);
            console.log("Added topic-topic relationships");
          }
          
          // Add relationships between topics and tools
          const tensorflow = tools.find((t: any) => t.name === 'TensorFlow');
          const pytorch = tools.find((t: any) => t.name === 'PyTorch');
          const gpt4 = tools.find((t: any) => t.name === 'OpenAI GPT-4');
          const cursor = tools.find((t: any) => t.name === 'Cursor');
          
          if (tensorflow && pytorch && gpt4 && ml && llm) {
            console.log("Found main tools (TensorFlow, PyTorch, GPT-4)");
            if (force || relCount.count < 5) {
              console.log("Adding topic-tool relationships...");
              await db.run(`
                INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type)
                VALUES 
                  (?, 'topic', ?, 'tool', 'related'),
                  (?, 'topic', ?, 'tool', 'related'),
                  (?, 'topic', ?, 'tool', 'related');
              `, [ml.id, tensorflow.id, ml.id, pytorch.id, llm.id, gpt4.id]);
              console.log("Added topic-tool relationships");
            }
          } else {
            console.warn("Could not find all required tools", { tensorflow, pytorch, gpt4 });
          }
          
          // Add relationships between topics and papers
          const gpt4Paper = papers.find((p: any) => p.title === 'GPT-4 Technical Report');
          const attentionPaper = papers.find((p: any) => p.title === 'Attention Is All You Need');
          
          if (gpt4Paper && attentionPaper && llm) {
            console.log("Found main papers (GPT-4, Attention)");
            if (force || relCount.count < 7) {
              console.log("Adding topic-paper relationships...");
              await db.run(`
                INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type)
                VALUES 
                  (?, 'topic', ?, 'paper', 'related'),
                  (?, 'topic', ?, 'paper', 'related');
              `, [llm.id, gpt4Paper.id, llm.id, attentionPaper.id]);
              console.log("Added topic-paper relationships");
            }
          } else {
            console.warn("Could not find all required papers", { gpt4Paper, attentionPaper });
          }
        } else {
          console.warn("Could not find main topics", { ai, ml, llm });
        }
      } catch (relationshipError) {
        console.error("Error setting up relationships:", relationshipError);
        // Continuamos a pesar del error en las relaciones
      }
      
      console.log("Database seeded successfully!");
    } else {
      console.log("Database already contains sufficient data, skipping seed process.");
    }
    
    return true;
  } catch (seedError) {
    console.error("Error during database seeding:", seedError);
    // Re-throw para que el llamador pueda manejarlo
    throw seedError;
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