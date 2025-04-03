// Script to initialize and seed the database
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function initializeDatabase() {
  console.log('Opening database connection...');
  const db = await open({
    filename: './ai-indexer.db',
    driver: sqlite3.Database
  });
  
  console.log('Creating tables...');
  // Create tables
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
  
  // Check if we already have seed data
  const topicsCount = await db.get('SELECT COUNT(*) as count FROM topics');
  
  if (topicsCount.count === 0) {
    console.log('Seeding initial data...');
    
    // Add initial topics with parameterized queries
    await db.run(
      'INSERT INTO topics (name, description, source, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?)',
      ['Artificial Intelligence', 'The field of AI research and development', 'initial_seed', 1.0, 
       'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think like humans and mimic their actions.']
    );
    
    await db.run(
      'INSERT INTO topics (name, description, source, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?)',
      ['Machine Learning', 'A subset of AI focused on learning from data', 'initial_seed', 1.0, 
       'Machine Learning (ML) is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.']
    );
    
    await db.run(
      'INSERT INTO topics (name, description, source, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?)',
      ['Large Language Models', 'Models that process and generate human language', 'initial_seed', 1.0, 
       'Large Language Models (LLMs) are advanced AI systems trained on vast amounts of text data to understand and generate human-like text.']
    );
    
    await db.run(
      'INSERT INTO topics (name, description, source, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?)',
      ['Computer Vision', 'AI systems that can interpret and analyze visual information', 'initial_seed', 1.0, 
       'Computer Vision is a field of artificial intelligence that enables computers to derive meaningful information from digital images, videos, and other visual inputs.']
    );
    
    await db.run(
      'INSERT INTO topics (name, description, source, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?)',
      ['Natural Language Processing', 'AI systems that understand and generate human language', 'initial_seed', 1.0, 
       'Natural Language Processing (NLP) is a field of artificial intelligence focused on enabling computers to understand, interpret, and generate human language in useful ways.']
    );
    
    await db.run(
      'INSERT INTO topics (name, description, source, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?)',
      ['Neural Networks', 'Computing systems inspired by biological neural networks', 'initial_seed', 1.0, 
       'Neural Networks are computing systems inspired by the biological neural networks that constitute animal brains.']
    );
    
    // Add AI tools
    await db.run(
      'INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?, ?)',
      ['TensorFlow', 'An open-source machine learning framework developed by Google', 'https://www.tensorflow.org/', 'Machine Learning Framework', 1.0, 
       'TensorFlow is an open-source machine learning framework developed by the Google Brain team.']
    );
    
    await db.run(
      'INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?, ?)',
      ['PyTorch', 'An open-source machine learning framework developed by Facebook', 'https://pytorch.org/', 'Machine Learning Framework', 1.0, 
       'PyTorch is an open-source machine learning library developed by Facebook\'s AI Research lab.']
    );
    
    await db.run(
      'INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?, ?)',
      ['OpenAI GPT-4', 'A large language model for natural language processing tasks', 'https://openai.com/gpt-4', 'Large Language Model', 1.0, 
       'GPT-4 (Generative Pre-trained Transformer 4) is a multimodal large language model created by OpenAI, released in March 2023.']
    );
    
    await db.run(
      'INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?, ?)',
      ['DALL-E 2', 'A neural network that creates images from textual descriptions', 'https://openai.com/dall-e-2', 'Image Generation', 0.95, 
       'DALL-E 2 is an AI system developed by OpenAI that can create realistic images and art from natural language descriptions.']
    );
    
    await db.run(
      'INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?, ?)',
      ['LangChain', 'A framework for developing applications with LLMs', 'https://langchain.com/', 'LLM Framework', 0.95, 
       'LangChain is an open-source framework for developing applications powered by language models.']
    );
    
    await db.run(
      'INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info) VALUES (?, ?, ?, ?, ?, ?)',
      ['Cursor', 'AI-powered code editor based on VSCode', 'https://cursor.com/', 'Developer Tool', 0.95, 
       'Cursor is an AI-enhanced code editor built on the foundation of Visual Studio Code, designed to integrate large language models into the development workflow.']
    );
    
    // Add papers
    await db.run(
      'INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url, detailed_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['2303.08774', 'GPT-4 Technical Report', 'OpenAI', 'We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs.', '2023-03-15', 'https://arxiv.org/abs/2303.08774',
       'The GPT-4 Technical Report details the development of GPT-4, a large-scale, multimodal model capable of processing both text and image inputs while producing text outputs.']
    );
    
    await db.run(
      'INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url, detailed_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['1706.03762', 'Attention Is All You Need', 'Ashish Vaswani et al.', 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.', '2017-06-12', 'https://arxiv.org/abs/1706.03762',
       'This seminal paper introduced the Transformer architecture, which relies entirely on attention mechanisms and has become the foundation of modern NLP systems.']
    );
    
    await db.run(
      'INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url, detailed_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['1810.04805', 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 'Jacob Devlin et al.', 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.', '2018-10-11', 'https://arxiv.org/abs/1810.04805',
       'This paper introduced BERT, a transformer-based language model that revolutionized NLP by using bidirectional context for language understanding tasks.']
    );
    
    await db.run(
      'INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url, detailed_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['2005.14165', 'Language Models are Few-Shot Learners', 'Tom Brown et al.', 'We demonstrate that scaling language models greatly improves task-agnostic, few-shot performance.', '2020-05-28', 'https://arxiv.org/abs/2005.14165',
       'This paper introduced GPT-3 and demonstrated that large language models can perform tasks with few examples, exhibiting emergent few-shot learning capabilities.']
    );
    
    await db.run(
      'INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url, detailed_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['2204.02311', 'A Generalist Agent', 'Scott Reed et al.', 'We report on the development of a single model capable of performing hundreds of tasks including vision, language, and decision making.', '2022-04-05', 'https://arxiv.org/abs/2204.02311',
       'This paper describes a generalist AI agent capable of performing hundreds of diverse tasks across vision, language, and decision-making domains.']
    );
    
    // Get the IDs of the inserted topics
    const topics = await db.all('SELECT * FROM topics');
    const ai = topics.find(t => t.name === 'Artificial Intelligence');
    const ml = topics.find(t => t.name === 'Machine Learning');
    const llm = topics.find(t => t.name === 'Large Language Models');
    const cv = topics.find(t => t.name === 'Computer Vision');
    const nlp = topics.find(t => t.name === 'Natural Language Processing');
    const nn = topics.find(t => t.name === 'Neural Networks');
    
    // Create relationships
    const relationships = [
      [ai.id, 'topic', ml.id, 'topic', 'parent-child'],
      [ai.id, 'topic', cv.id, 'topic', 'parent-child'],
      [ai.id, 'topic', nlp.id, 'topic', 'parent-child'],
      [ml.id, 'topic', nn.id, 'topic', 'related'],
      [ml.id, 'topic', llm.id, 'topic', 'related'],
    ];
    
    // Insert the relationships
    for (const [sourceId, sourceType, targetId, targetType, relType] of relationships) {
      await db.run(
        'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
        [sourceId, sourceType, targetId, targetType, relType]
      );
    }
    
    // Get tool IDs
    const tools = await db.all('SELECT * FROM ai_tools');
    const tensorflow = tools.find(t => t.name === 'TensorFlow');
    const pytorch = tools.find(t => t.name === 'PyTorch');
    const gpt4 = tools.find(t => t.name === 'OpenAI GPT-4');
    const dalle = tools.find(t => t.name === 'DALL-E 2');
    
    // Create tool relationships
    const toolRelationships = [
      [ml.id, 'topic', tensorflow.id, 'tool', 'related'],
      [ml.id, 'topic', pytorch.id, 'tool', 'related'],
      [llm.id, 'topic', gpt4.id, 'tool', 'related'],
      [cv.id, 'topic', dalle.id, 'tool', 'related'],
    ];
    
    // Insert tool relationships
    for (const [sourceId, sourceType, targetId, targetType, relType] of toolRelationships) {
      await db.run(
        'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
        [sourceId, sourceType, targetId, targetType, relType]
      );
    }
    
    // Get paper IDs
    const papers = await db.all('SELECT * FROM papers');
    const gpt4Paper = papers.find(p => p.title.includes('GPT-4'));
    const attentionPaper = papers.find(p => p.title.includes('Attention Is All'));
    const bertPaper = papers.find(p => p.title.includes('BERT'));
    
    // Create paper relationships
    const paperRelationships = [
      [llm.id, 'topic', gpt4Paper.id, 'paper', 'related'],
      [nlp.id, 'topic', attentionPaper.id, 'paper', 'related'],
      [nlp.id, 'topic', bertPaper.id, 'paper', 'related'],
    ];
    
    // Insert paper relationships
    for (const [sourceId, sourceType, targetId, targetType, relType] of paperRelationships) {
      await db.run(
        'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
        [sourceId, sourceType, targetId, targetType, relType]
      );
    }
    
    console.log('Database seeded successfully!');
  } else {
    console.log('Database already contains data, skipping seed process.');
  }
  
  await db.close();
  console.log('Database connection closed.');
}

initializeDatabase().catch(err => {
  console.error('Error initializing database:', err);
  process.exit(1);
}); 