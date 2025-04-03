// Script to add advanced AI topics and related concepts to the database
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function addAdvancedTopics() {
  console.log('Opening database connection...');
  const db = await open({
    filename: './ai-indexer.db',
    driver: sqlite3.Database
  });
  
  console.log('Adding advanced AI topics and related concepts...');
  
  // Define the main topics
  const mainTopics = [
    {
      name: 'Multi-agent Cognitive Processes (MCP)',
      description: 'Framework for orchestrating multiple specialized AI agents to solve complex tasks collaboratively.',
      veracity_score: 0.92,
      related_topics: [
        { name: 'Agent Orchestration', description: 'Coordinating multiple AI agents to work together toward a common goal.', veracity_score: 0.88 },
        { name: 'Cognitive Architecture', description: 'Structure that organizes artificial cognitive processes and representations.', veracity_score: 0.95 },
        { name: 'Agentic AI', description: 'AI systems that can autonomously take actions to achieve specified goals.', veracity_score: 0.90 }
      ]
    },
    {
      name: 'n8n',
      description: 'Workflow automation tool that connects different services and applications through a visual interface.',
      veracity_score: 0.97,
      related_topics: [
        { name: 'Workflow Automation', description: 'Systems that automate sequences of tasks across different applications.', veracity_score: 0.95 },
        { name: 'Low-Code Integration', description: 'Visual development environments for connecting systems with minimal coding.', veracity_score: 0.93 },
        { name: 'API Orchestration', description: 'Coordinating interactions between multiple APIs to create complex functionality.', veracity_score: 0.89 }
      ]
    },
    {
      name: 'Anthropic',
      description: 'AI safety company focused on developing reliable, interpretable, and steerable AI systems.',
      veracity_score: 0.98,
      related_topics: [
        { name: 'Constitutional AI', description: 'AI training methodology that uses a set of principles to guide model behavior.', veracity_score: 0.91 },
        { name: 'Claude', description: 'Large language model developed by Anthropic with a focus on helpfulness and safety.', veracity_score: 0.96 },
        { name: 'AI Alignment', description: 'Field focused on ensuring AI systems act in accordance with human values and intentions.', veracity_score: 0.93 }
      ]
    },
    {
      name: 'Cursor',
      description: 'AI-powered code editor that integrates language models to assist with programming tasks.',
      veracity_score: 0.94,
      related_topics: [
        { name: 'AI Code Completion', description: 'Features that suggest code as developers type, based on context and patterns.', veracity_score: 0.92 },
        { name: 'Code Generation', description: 'Creating complete code snippets or functions from natural language descriptions.', veracity_score: 0.89 },
        { name: 'AI Pair Programming', description: 'Collaborative coding approach where an AI assists a human developer.', veracity_score: 0.87 }
      ]
    },
    {
      name: 'AI Systems Architecture',
      description: 'Design principles and patterns for building complex AI systems that can scale and evolve.',
      veracity_score: 0.96,
      related_topics: [
        { name: 'Microservices for AI', description: 'Architectural pattern using independent, specialized services to build AI applications.', veracity_score: 0.92 },
        { name: 'Model Serving Infrastructure', description: 'Systems designed to deploy, monitor, and scale machine learning models in production.', veracity_score: 0.94 },
        { name: 'Data Pipelines', description: 'Automated systems for collecting, processing, and storing data for AI applications.', veracity_score: 0.95 }
      ]
    },
    {
      name: 'Retrieval-Augmented Generation (RAG)',
      description: 'Architecture combining information retrieval with text generation to create accurate, up-to-date responses.',
      veracity_score: 0.95,
      related_topics: [
        { name: 'Vector Databases', description: 'Specialized databases for storing and querying vector embeddings of data.', veracity_score: 0.94 },
        { name: 'Semantic Search', description: 'Search techniques that understand meaning rather than just keywords.', veracity_score: 0.93 },
        { name: 'Context Window Optimization', description: 'Techniques to effectively use the limited context window of language models.', veracity_score: 0.89 },
        { name: 'Knowledge Graphs', description: 'Structured representations of knowledge using entities and relationships.', veracity_score: 0.92 }
      ]
    },
    {
      name: 'Autonomous Agents',
      description: 'Self-directed AI systems that can perceive their environment and take actions to achieve goals.',
      veracity_score: 0.88,
      related_topics: [
        { name: 'AutoGPT', description: 'Experimental application of GPT models focused on autonomous goal pursuit.', veracity_score: 0.85 },
        { name: 'BabyAGI', description: 'Simple task management system using language models to create and prioritize tasks.', veracity_score: 0.82 },
        { name: 'Tool Use in LLMs', description: 'Capability of language models to use external tools to accomplish tasks.', veracity_score: 0.90 }
      ]
    },
    {
      name: 'AI Orchestration',
      description: 'Coordinating multiple AI systems and services to work together in a coherent workflow.',
      veracity_score: 0.92,
      related_topics: [
        { name: 'LangChain', description: 'Framework for developing applications with language models through composable components.', veracity_score: 0.94 },
        { name: 'AI Workflow Management', description: 'Systems for designing, executing, and monitoring AI processing pipelines.', veracity_score: 0.90 },
        { name: 'Function Calling', description: 'Technique allowing language models to invoke external functions and services.', veracity_score: 0.91 }
      ]
    },
    {
      name: 'Generative Models',
      description: 'AI systems that can create new content similar to their training data.',
      veracity_score: 0.97,
      related_topics: [
        { name: 'Diffusion Models', description: 'Type of generative model that gradually adds and then removes noise from data.', veracity_score: 0.95 },
        { name: 'Generative Adversarial Networks', description: 'Architecture using two neural networks competing against each other.', veracity_score: 0.96 },
        { name: 'Transformers', description: 'Neural network architecture based on self-attention mechanisms.', veracity_score: 0.98 },
        { name: 'Multimodal Models', description: 'AI systems that can process and generate multiple types of data like text and images.', veracity_score: 0.94 }
      ]
    }
  ];
  
  // Add AI tools related to these topics
  const relatedTools = [
    {
      name: 'LangChain',
      description: 'Framework for developing applications powered by language models.',
      url: 'https://langchain.com/',
      category: 'AI Development Framework',
      veracity_score: 0.94
    },
    {
      name: 'Pinecone',
      description: 'Vector database for storing and searching vector embeddings at scale.',
      url: 'https://www.pinecone.io/',
      category: 'Vector Database',
      veracity_score: 0.95
    },
    {
      name: 'Weaviate',
      description: 'Open-source vector search engine with semantic search capabilities.',
      url: 'https://weaviate.io/',
      category: 'Vector Database',
      veracity_score: 0.93
    },
    {
      name: 'Claude API',
      description: 'API access to Anthropic\'s Claude large language model.',
      url: 'https://www.anthropic.com/claude',
      category: 'Large Language Model',
      veracity_score: 0.96
    },
    {
      name: 'n8n',
      description: 'Workflow automation platform with visual editor.',
      url: 'https://n8n.io/',
      category: 'Workflow Automation',
      veracity_score: 0.97
    },
    {
      name: 'Cursor',
      description: 'AI-first code editor with integrated language model capabilities.',
      url: 'https://cursor.sh/',
      category: 'Development Tool',
      veracity_score: 0.94
    }
  ];
  
  // Add relevant papers
  const relatedPapers = [
    {
      arxiv_id: '2204.05862',
      title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
      authors: 'Patrick Lewis, Ethan Perez, Aleksandra Piktus, et al.',
      summary: 'Introduces RAG, a hybrid generation approach that combines a parametric memory with a non-parametric memory for language generation.',
      published_date: '2020-04-12',
      url: 'https://arxiv.org/abs/2005.11401'
    },
    {
      arxiv_id: '2303.12712',
      title: 'AutoGPT: An Autonomous GPT-4 Experiment',
      authors: 'Significant Gravitas',
      summary: 'Describes an experimental autonomous agent using GPT-4 to complete complex tasks through planning and tool use.',
      published_date: '2023-03-30',
      url: 'https://arxiv.org/abs/2303.12712'
    },
    {
      arxiv_id: '2302.04761',
      title: 'Constitutional AI: Harmlessness from AI Feedback',
      authors: 'Yuntao Bai, Andy Jones, et al.',
      summary: 'Presents a methodology for training language models to be helpful, harmless, and honest using AI feedback.',
      published_date: '2023-02-09',
      url: 'https://arxiv.org/abs/2212.08073'
    },
    {
      arxiv_id: '2304.03442',
      title: 'Claude: A Large Language Model with Constitutional AI',
      authors: 'Anthropic',
      summary: 'Introduces Claude, a language model trained using Constitutional AI to be helpful, harmless, and honest.',
      published_date: '2023-04-07',
      url: 'https://arxiv.org/abs/2304.03442'
    }
  ];
  
  // Insert the main topics
  for (const topic of mainTopics) {
    const result = await db.run(
      'INSERT INTO topics (name, description, source, veracity_score) VALUES (?, ?, ?, ?)',
      [topic.name, topic.description, 'advanced_seed', topic.veracity_score]
    );
    
    const mainTopicId = result.lastID;
    console.log(`Added main topic: ${topic.name} with ID ${mainTopicId}`);
    
    // Insert related topics and create relationships
    for (const relatedTopic of topic.related_topics) {
      const relatedResult = await db.run(
        'INSERT INTO topics (name, description, source, parent_id, veracity_score) VALUES (?, ?, ?, ?, ?)',
        [
          relatedTopic.name, 
          relatedTopic.description, 
          'advanced_seed', 
          mainTopicId, 
          relatedTopic.veracity_score
        ]
      );
      
      const relatedTopicId = relatedResult.lastID;
      console.log(`  - Added related topic: ${relatedTopic.name} with ID ${relatedTopicId}`);
      
      // Create relationship
      await db.run(
        'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
        [mainTopicId, 'topic', relatedTopicId, 'topic', 'parent-child']
      );
    }
  }
  
  // Insert tools and create relationships with relevant topics
  for (const tool of relatedTools) {
    const result = await db.run(
      'INSERT INTO ai_tools (name, description, url, category, veracity_score) VALUES (?, ?, ?, ?, ?)',
      [tool.name, tool.description, tool.url, tool.category, tool.veracity_score]
    );
    
    const toolId = result.lastID;
    console.log(`Added tool: ${tool.name} with ID ${toolId}`);
    
    // Find relevant topics to connect with this tool
    let relevantTopics;
    
    if (tool.name === 'LangChain') {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('AI Orchestration', 'Retrieval-Augmented Generation (RAG)')");
    } else if (tool.name === 'Pinecone' || tool.name === 'Weaviate') {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('Retrieval-Augmented Generation (RAG)', 'Vector Databases')");
    } else if (tool.name === 'Claude API') {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('Anthropic', 'Claude')");
    } else if (tool.name === 'n8n') {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('n8n', 'Workflow Automation')");
    } else if (tool.name === 'Cursor') {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('Cursor', 'AI Code Completion')");
    }
    
    if (relevantTopics && relevantTopics.length > 0) {
      for (const topic of relevantTopics) {
        await db.run(
          'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
          [topic.id, 'topic', toolId, 'tool', 'related']
        );
        console.log(`  - Created relationship between topic ID ${topic.id} and tool ID ${toolId}`);
      }
    }
  }
  
  // Insert papers and create relationships with relevant topics
  for (const paper of relatedPapers) {
    const result = await db.run(
      'INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url) VALUES (?, ?, ?, ?, ?, ?)',
      [paper.arxiv_id, paper.title, paper.authors, paper.summary, paper.published_date, paper.url]
    );
    
    const paperId = result.lastID;
    console.log(`Added paper: ${paper.title} with ID ${paperId}`);
    
    // Find relevant topics to connect with this paper
    let relevantTopics;
    
    if (paper.title.includes('Retrieval-Augmented Generation')) {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('Retrieval-Augmented Generation (RAG)')");
    } else if (paper.title.includes('AutoGPT')) {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('Autonomous Agents', 'AutoGPT')");
    } else if (paper.title.includes('Constitutional AI')) {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('Anthropic', 'Constitutional AI')");
    } else if (paper.title.includes('Claude')) {
      relevantTopics = await db.all("SELECT id FROM topics WHERE name IN ('Anthropic', 'Claude')");
    }
    
    if (relevantTopics && relevantTopics.length > 0) {
      for (const topic of relevantTopics) {
        await db.run(
          'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
          [topic.id, 'topic', paperId, 'paper', 'related']
        );
        console.log(`  - Created relationship between topic ID ${topic.id} and paper ID ${paperId}`);
      }
    }
  }
  
  // Create cross-topic relationships (connecting related topics across different main topics)
  const topicRelationships = [
    { source: 'Multi-agent Cognitive Processes (MCP)', target: 'Autonomous Agents', type: 'related' },
    { source: 'Agentic AI', target: 'Tool Use in LLMs', type: 'related' },
    { source: 'RAG', target: 'LangChain', target_type: 'tool', type: 'implements' },
    { source: 'Vector Databases', target: 'Semantic Search', type: 'enables' },
    { source: 'n8n', target: 'AI Orchestration', type: 'implements' },
    { source: 'AI Systems Architecture', target: 'AI Orchestration', type: 'includes' },
    { source: 'Generative Models', target: 'Multimodal Models', type: 'parent-child' }
  ];
  
  for (const rel of topicRelationships) {
    try {
      const sourceQuery = await db.get('SELECT id FROM topics WHERE name LIKE ?', [`%${rel.source}%`]);
      
      if (!sourceQuery) {
        console.log(`Source topic "${rel.source}" not found, skipping relationship`);
        continue;
      }
      
      if (rel.target_type === 'tool') {
        const targetQuery = await db.get('SELECT id FROM ai_tools WHERE name LIKE ?', [`%${rel.target}%`]);
        if (targetQuery) {
          await db.run(
            'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
            [sourceQuery.id, 'topic', targetQuery.id, 'tool', rel.type]
          );
          console.log(`Created cross-relationship between ${rel.source} and tool ${rel.target}`);
        }
      } else {
        const targetQuery = await db.get('SELECT id FROM topics WHERE name LIKE ?', [`%${rel.target}%`]);
        if (targetQuery) {
          await db.run(
            'INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type) VALUES (?, ?, ?, ?, ?)',
            [sourceQuery.id, 'topic', targetQuery.id, 'topic', rel.type]
          );
          console.log(`Created cross-relationship between ${rel.source} and ${rel.target}`);
        }
      }
    } catch (err) {
      console.error(`Error creating relationship for ${rel.source} -> ${rel.target}:`, err);
    }
  }
  
  await db.close();
  console.log('Database connection closed. Advanced topics successfully added!');
}

addAdvancedTopics().catch(err => {
  console.error('Error adding advanced topics:', err);
  process.exit(1);
}); 