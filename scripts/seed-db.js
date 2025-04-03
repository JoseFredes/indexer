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
    // Seed initial topics with detailed information
    await db.run(`
      INSERT INTO topics (name, description, source, veracity_score, detailed_info)
      VALUES 
        ('Artificial Intelligence', 'The field of AI research and development', 'initial_seed', 1.0, 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. AI technology is rapidly advancing and being integrated into various sectors, including healthcare, finance, education, transportation, and more. Key branches include machine learning, neural networks, natural language processing, robotics, and computer vision. The field faces challenges related to ethics, bias, transparency, and job displacement. Future directions include advancing AI reasoning, integrating neuroscience insights, developing AI-human collaboration, addressing ethical concerns, and creating more specialized applications for industries.'),
        ('Machine Learning', 'A subset of AI focused on learning from data', 'initial_seed', 1.0, 'Machine Learning (ML) is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves. Machine learning evolved from pattern recognition and computational learning theory, and is widely used in data analytics to make predictions or decisions without being explicitly programmed to perform the task. Various techniques include supervised learning (using labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). Applications include image and speech recognition, recommendation systems, fraud detection, and autonomous vehicles. Recent advances include deep learning, transfer learning, and automated machine learning.'),
        ('Large Language Models', 'Models that process and generate human language', 'initial_seed', 1.0, 'Large Language Models (LLMs) are advanced AI systems trained on vast amounts of text data to understand and generate human-like text. These models, which include GPT (Generative Pre-trained Transformer) series, BERT, and others, can perform a wide range of language tasks including translation, summarization, question-answering, content creation, and conversation. LLMs utilize transformer architectures with attention mechanisms that help them understand context and relationships between words. They are trained on diverse corpora including books, articles, websites, and code, enabling them to capture broad knowledge about language and the world. Key challenges include factual accuracy, bias mitigation, transparency, computational requirements, and alignment with human values. Current applications span education, customer service, content creation, programming assistance, and research, with ongoing development focused on improving reasoning abilities and reducing hallucinations.'),
        ('Computer Vision', 'AI systems that can interpret and analyze visual information', 'initial_seed', 1.0, 'Computer Vision is a field of artificial intelligence that enables computers to derive meaningful information from digital images, videos, and other visual inputs. This technology allows machines to identify and process objects in much the same way that human vision does. Computer vision tasks include image recognition, object detection, segmentation, pose estimation, and motion analysis. It relies heavily on convolutional neural networks (CNNs) and other deep learning architectures. Applications span multiple industries including autonomous vehicles, medical diagnostics, surveillance, augmented reality, robotics, and quality control in manufacturing. Recent advances include real-time object detection systems, generative models like GANs for image synthesis, and self-supervised learning approaches that reduce dependence on labeled data.'),
        ('Reinforcement Learning', 'Learning through interaction with an environment', 'initial_seed', 1.0, 'Reinforcement Learning (RL) is a type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize some notion of cumulative reward. Unlike supervised learning, the agent isn\'t explicitly told which actions to take but must discover which actions yield the highest rewards through trial and error. Key concepts include the agent-environment interaction loop, reward signals, value functions, and policies. RL has achieved remarkable successes in games (AlphaGo, Atari games), robotics, resource management, recommendation systems, and autonomous vehicles. Modern approaches combine RL with deep learning (Deep RL) and include methods like Q-learning, policy gradients, actor-critic methods, and model-based RL. Challenges include sample efficiency, exploration-exploitation trade-offs, and transferring skills learned in one environment to another.'),
        ('Natural Language Processing', 'AI systems that understand and generate human language', 'initial_seed', 1.0, 'Natural Language Processing (NLP) is a field of artificial intelligence focused on enabling computers to understand, interpret, and generate human language in useful ways. NLP combines computational linguistics, machine learning, and deep learning to process and analyze large amounts of natural language data. Key NLP tasks include sentiment analysis, named entity recognition, part-of-speech tagging, machine translation, question answering, summarization, and dialogue systems. The field has been revolutionized by transformer-based language models like BERT, GPT, and T5, which have achieved state-of-the-art results across numerous language tasks. Applications include virtual assistants, customer service chatbots, content analysis, language translation, information extraction from text, and automated content generation. Ongoing challenges include handling context, understanding nuance and sarcasm, maintaining factual accuracy, and reducing biases present in training data.'),
        ('Neural Networks', 'Computing systems inspired by biological neural networks', 'initial_seed', 1.0, 'Neural Networks are computing systems inspired by the biological neural networks that constitute animal brains. These systems \'learn\' to perform tasks by considering examples, generally without being programmed with task-specific rules. They excel at pattern recognition, function approximation, and data clustering. The basic structure consists of interconnected nodes or "neurons" organized in layers (input, hidden, and output), with each connection having an associated weight that is adjusted during training. Types include feedforward networks, convolutional neural networks (CNNs) for image processing, recurrent neural networks (RNNs) for sequential data, and generative adversarial networks (GANs) for generating new data samples. Neural networks form the backbone of deep learning and have enabled breakthroughs in computer vision, speech recognition, natural language processing, and game playing. Training challenges include the need for large datasets, computational resources, and techniques to prevent overfitting.'),
        ('Deep Learning', 'Neural networks with many layers for complex pattern recognition', 'initial_seed', 1.0, 'Deep Learning is a subset of machine learning that uses neural networks with many layers (hence "deep") to analyze various forms of data. These deep neural networks are capable of learning complex patterns and representations of data through multiple levels of abstraction. Key architectures include convolutional neural networks (CNNs) for image processing, recurrent neural networks (RNNs) and transformers for sequential data, and generative models like GANs and VAEs for creating new content. Deep learning has enabled significant advances in computer vision, speech recognition, natural language processing, drug discovery, genomics, and game playing. The field's explosive growth has been fueled by the availability of big data, increased computational power through GPUs and TPUs, and algorithmic improvements like better activation functions, normalization techniques, and optimization methods. Challenges include the need for large amounts of labeled data, interpretability of models, and computational resources required for training.'),
        ('Generative AI', 'AI systems that can create new content like images or text', 'initial_seed', 0.95, 'Generative AI refers to artificial intelligence systems capable of generating new content that resembles human-created work, including text, images, music, code, and more. These systems learn patterns from existing data and create new outputs that maintain the statistical properties and apparent meaning of that data. Key technologies include Generative Adversarial Networks (GANs), Variational Autoencoders (VAEs), autoregressive models like GPT, and diffusion models like Stable Diffusion and DALL-E. Applications span creative industries (art, music, writing), product design, content generation, synthetic data creation for training other AI systems, and augmenting human creativity. The field has seen explosive growth with models like GPT-4, Midjourney, and Stable Diffusion demonstrating remarkable capabilities in generating high-quality, diverse content. Ethical concerns include copyright questions, potential misuse for creating misleading content, authenticity verification, and impact on creative professions. Research continues in areas of control, consistency, and reducing harmful biases in generated content.'),
        ('Transformer Architecture', 'Neural network architecture with attention mechanisms', 'initial_seed', 0.95, 'The Transformer architecture is a neural network design introduced in the 2017 paper "Attention Is All You Need" that revolutionized natural language processing and subsequently many other AI fields. Unlike previous sequence models that processed data sequentially (like RNNs), transformers process entire sequences simultaneously through a mechanism called self-attention, which weighs the importance of different parts of the input data. The architecture consists of an encoder-decoder structure with multi-head attention layers, feed-forward networks, residual connections, and layer normalization. Transformers excel at capturing long-range dependencies in data and can be efficiently parallelized for faster training. They form the foundation of modern language models like BERT, GPT, T5, and many others, enabling breakthroughs in machine translation, text summarization, question answering, and text generation. Beyond NLP, transformer variants have been successfully applied to computer vision, audio processing, protein structure prediction, and multimodal learning, demonstrating the architecture\'s versatility and effectiveness across domains.');
    `);
    
    // Add relationships between seed topics
    const topics = await db.all('SELECT * FROM topics');
    const ai = topics.find(t => t.name === 'Artificial Intelligence');
    const ml = topics.find(t => t.name === 'Machine Learning');
    const llm = topics.find(t => t.name === 'Large Language Models');
    const cv = topics.find(t => t.name === 'Computer Vision');
    const rl = topics.find(t => t.name === 'Reinforcement Learning');
    const nlp = topics.find(t => t.name === 'Natural Language Processing');
    const nn = topics.find(t => t.name === 'Neural Networks');
    const dl = topics.find(t => t.name === 'Deep Learning');
    const genai = topics.find(t => t.name === 'Generative AI');
    const transformer = topics.find(t => t.name === 'Transformer Architecture');
    
    // Create relationships
    await db.run(`
      INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type)
      VALUES 
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'parent-child'),
        (?, 'topic', ?, 'topic', 'related'),
        (?, 'topic', ?, 'topic', 'related');
    `, [
      ai.id, ml.id, 
      ai.id, cv.id, 
      ai.id, rl.id,
      ai.id, nlp.id,
      ml.id, nn.id,
      ml.id, dl.id,
      nn.id, dl.id,
      nlp.id, llm.id,
      llm.id, transformer.id,
      genai.id, llm.id
    ]);
    
    // Add more AI tools
    await db.run(`
      INSERT INTO ai_tools (name, description, url, category, veracity_score, detailed_info)
      VALUES 
        ('TensorFlow', 'An open-source machine learning framework developed by Google', 'https://www.tensorflow.org/', 'Machine Learning Framework', 1.0, 'TensorFlow is an open-source machine learning framework developed by the Google Brain team. Released in 2015, it provides a comprehensive ecosystem of tools for building and deploying machine learning models. The framework supports training and inference of deep neural networks on a variety of platforms from servers to edge devices and mobile applications. TensorFlow offers multiple levels of abstraction, allowing users to choose the right one for their needs. Its high-level Keras API makes building and training models accessible, while lower-level APIs provide greater control. The framework supports distributed training across multiple GPUs and TPUs (Tensor Processing Units). The TensorFlow ecosystem includes TensorFlow Extended for production pipelines, TensorFlow Lite for mobile and edge deployment, TensorFlow.js for browser-based ML, and numerous domain-specific libraries.'),
        ('PyTorch', 'An open-source machine learning framework developed by Facebook', 'https://pytorch.org/', 'Machine Learning Framework', 1.0, 'PyTorch is an open-source machine learning library developed by Facebook\'s AI Research lab. Released in 2016, it has become widely adopted in the research community and increasingly in production environments. PyTorch is known for its intuitive design and Python integration, offering a dynamic computational graph that provides flexibility during model development and debugging. The framework provides GPU acceleration, a rich ecosystem of tools and libraries, and seamless integration with Python data science libraries. PyTorch\'s design philosophy emphasizes ease of use, enabling rapid prototyping while maintaining performance. It offers comprehensive libraries for computer vision (torchvision), natural language processing (torchtext), and audio processing (torchaudio). Recent versions include distributed training capabilities, quantization for deployment, and mobile optimization.'),
        ('OpenAI GPT-4', 'A large language model for natural language processing tasks', 'https://openai.com/gpt-4', 'Large Language Model', 1.0, 'GPT-4 (Generative Pre-trained Transformer 4) is a multimodal large language model created by OpenAI, released in March 2023. It represents a significant advancement over previous GPT models with enhanced capabilities in reasoning, following instructions, and generating creative content. GPT-4 can process both text and image inputs, demonstrating remarkable performance across diverse tasks including writing, coding, test-taking, and creative applications. The model shows improved factual accuracy, better reasoning abilities, and reduced tendencies toward hallucination compared to its predecessors. GPT-4 demonstrates capabilities in multi-step reasoning, understanding complex instructions, and solving problems in domains ranging from mathematics to visual interpretation. It was trained on a diverse corpus of text and code, with reinforcement learning from human feedback used to align the model with human preferences and reduce harmful outputs.'),
        ('DALL-E 2', 'A neural network that creates images from textual descriptions', 'https://openai.com/dall-e-2', 'Image Generation', 0.95, 'DALL-E 2 is an AI system developed by OpenAI that can create realistic images and art from natural language descriptions. Released in April 2022, it represents a significant advancement in text-to-image generation technology, producing higher resolution and more accurate images than its predecessor. The system understands a wide range of concepts expressed in natural language and can combine concepts, attributes, and styles in ways that reflect a deep understanding of language and visual concepts. DALL-E 2 can generate entirely new images, edit existing images to add or remove elements while maintaining shadows and reflections, and create variations of an input image. The technology uses a diffusion model that starts with a pattern of random dots and gradually alters that pattern to create an image when guided by the text prompt. OpenAI implemented various safety measures including content filters, technical limitations on certain types of content, and policies guiding appropriate use.'),
        ('Cursor', 'AI-powered code editor based on VSCode', 'https://cursor.com/', 'Developer Tool', 0.95, 'Cursor is an AI-enhanced code editor built on the foundation of Visual Studio Code, designed to integrate large language models into the development workflow. Launched in 2023, Cursor augments the familiar VSCode interface with AI capabilities, allowing developers to chat with an AI about their code, generate code from natural language descriptions, get intelligent code completions, and receive explanations of complex code segments. The editor maintains compatibility with VSCode extensions while adding features like generating unit tests, refactoring code using natural language instructions, and providing context-aware answers to programming questions. Cursor\'s AI understands the broader codebase structure, enabling it to provide more relevant suggestions than isolated code completion tools. The editor supports most major programming languages and frameworks, with particular strength in Python, JavaScript, TypeScript, and web development. Cursor offers both free usage with certain limitations and premium features through a subscription model.'),
        ('GitHub Copilot', 'AI pair programmer that suggests code in real-time', 'https://github.com/features/copilot', 'Developer Tool', 1.0, 'GitHub Copilot is an AI pair programming tool developed by GitHub in collaboration with OpenAI. Launched in 2021, it serves as an AI assistant that suggests code as you type, helping to reduce repetitive tasks and improve developer productivity. Powered by OpenAI Codex, a descendant of GPT-3 trained on billions of lines of public code, Copilot can generate entire functions, docstrings, tests, and boilerplate code based on comments and context. It integrates directly into popular code editors including Visual Studio Code, Visual Studio, and JetBrains IDEs. Copilot works across dozens of programming languages with particularly strong performance in Python, JavaScript, TypeScript, Ruby, and Go. The tool adapts to a developer\'s coding style over time, learning from accepted suggestions to provide more personalized recommendations. Features include whole-line and whole-function suggestions, generating alternative implementations, and Copilot Chat for answering programming questions within the editor.'),
        ('LangChain', 'A framework for developing applications with LLMs', 'https://langchain.com/', 'LLM Framework', 0.95, 'LangChain is an open-source framework for developing applications powered by language models. Created in 2022, it addresses the challenges of building applications that leverage large language models (LLMs) by providing composable tools and components for common patterns. The framework enables developers to combine LLMs with external data sources and computation to create more powerful applications than using LLMs alone. Key components include chains (combining multiple components for specific tasks), agents (LLMs that can use tools to accomplish goals), memory systems (for stateful applications), document loaders (for importing various data types), vector stores (for semantic search), and retrievers (for finding relevant information). LangChain supports multiple LLM providers, including OpenAI, Anthropic, Google, and open-source models. The framework has found applications in document analysis, chatbots with specific knowledge, data extraction systems, and code analysis tools. LangChain\'s ecosystem has grown rapidly with extensive documentation, templates for common use cases, and integrations with diverse tools and services.'),
        ('n8n', 'Workflow automation tool with AI capabilities', 'https://n8n.io/', 'Automation Tool', 0.9, NULL),
        ('OpenCV', 'Open-source computer vision library', 'https://opencv.org/', 'Computer Vision Library', 1.0, NULL),
        ('Scikit-learn', 'Machine learning library for Python', 'https://scikit-learn.org/', 'Machine Learning Library', 1.0, NULL),
        ('Hugging Face Transformers', 'A library providing pre-trained models for NLP tasks', 'https://huggingface.co/transformers/', 'NLP Library', 1.0, NULL),
        ('Midjourney', 'An AI image generation tool that creates images from text prompts', 'https://midjourney.com/', 'Image Generation', 0.95, NULL),
        ('Stable Diffusion', 'An open-source image generation model', 'https://stability.ai/stable-diffusion', 'Image Generation', 0.95, NULL),
        ('Anthropic Claude', 'An AI assistant designed to be helpful, harmless, and honest', 'https://www.anthropic.com/claude', 'Large Language Model', 0.95, NULL),
        ('NVIDIA CUDA', 'A parallel computing platform and API for GPU computing', 'https://developer.nvidia.com/cuda-toolkit', 'GPU Computing', 1.0, NULL);
    `);
    
    // Add more research papers
    await db.run(`
      INSERT INTO papers (arxiv_id, title, authors, summary, published_date, url)
      VALUES 
        ('2303.08774', 'GPT-4 Technical Report', 'OpenAI', 'We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs.', '2023-03-15', 'https://arxiv.org/abs/2303.08774'),
        ('1706.03762', 'Attention Is All You Need', 'Ashish Vaswani et al.', 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.', '2017-06-12', 'https://arxiv.org/abs/1706.03762'),
        ('1810.04805', 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 'Jacob Devlin et al.', 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.', '2018-10-11', 'https://arxiv.org/abs/1810.04805'),
        ('2005.14165', 'Language Models are Few-Shot Learners', 'Tom Brown et al.', 'We demonstrate that scaling language models greatly improves task-agnostic, few-shot performance.', '2020-05-28', 'https://arxiv.org/abs/2005.14165'),
        ('2204.02311', 'A Generalist Agent', 'Scott Reed et al.', 'We report on the development of a single model capable of performing hundreds of tasks including vision, language, and decision making.', '2022-04-05', 'https://arxiv.org/abs/2204.02311'),
        ('2302.13971', 'LLaMA: Open and Efficient Foundation Language Models', 'Hugo Touvron et al.', 'We introduce LLaMA, a collection of foundation language models ranging from 7B to 65B parameters.', '2023-02-27', 'https://arxiv.org/abs/2302.13971'),
        ('2107.14795', 'Evaluating Large Language Models Trained on Code', 'Mark Chen et al.', 'We introduce Codex, a GPT language model fine-tuned on publicly available code from GitHub.', '2021-07-30', 'https://arxiv.org/abs/2107.14795'),
        ('2203.02155', 'Training language models to follow instructions with human feedback', 'Long Ouyang et al.', 'We present InstructGPT, a model fine-tuned with human feedback to align with user intent.', '2022-03-04', 'https://arxiv.org/abs/2203.02155'),
        ('2302.04023', 'A Survey of Large Language Models', 'Wayne Xin Zhao et al.', 'A comprehensive survey of large language models, discussing architectures, capabilities, and limitations.', '2023-02-08', 'https://arxiv.org/abs/2302.04023'),
        ('2212.08073', 'Constitutional AI: Harmlessness from AI Feedback', 'Yuntao Bai et al.', 'We propose a technique for training a harmless AI assistant through a process we call constitutional AI.', '2022-12-15', 'https://arxiv.org/abs/2212.08073'),
        ('2305.10601', 'Evaluating Verifiability in Generative Search Engines', 'Nelson F. Liu et al.', 'We evaluate the verifiability of claims produced by generative search engines and LLMs.', '2023-05-18', 'https://arxiv.org/abs/2305.10601'),
        ('2201.11903', 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models', 'Jason Wei et al.', 'We propose chain-of-thought prompting, which improves the reasoning abilities of large language models.', '2022-01-28', 'https://arxiv.org/abs/2201.11903');
    `);
    
    // Add relationships between topics, tools, and papers
    const tools = await db.all('SELECT * FROM ai_tools');
    const papers = await db.all('SELECT * FROM papers');
    
    const tensorflow = tools.find(t => t.name === 'TensorFlow');
    const pytorch = tools.find(t => t.name === 'PyTorch');
    const gpt4 = tools.find(t => t.name === 'OpenAI GPT-4');
    const dalle = tools.find(t => t.name === 'DALL-E 2');
    const midjourney = tools.find(t => t.name === 'Midjourney');
    const stableDiffusion = tools.find(t => t.name === 'Stable Diffusion');
    const huggingFace = tools.find(t => t.name === 'Hugging Face Transformers');
    const langchain = tools.find(t => t.name === 'LangChain');
    const claude = tools.find(t => t.name === 'Anthropic Claude');
    const cuda = tools.find(t => t.name === 'NVIDIA CUDA');
    const cursor = tools.find(t => t.name === 'Cursor');
    const copilot = tools.find(t => t.name === 'GitHub Copilot');
    const n8n = tools.find(t => t.name === 'n8n');
    const opencv = tools.find(t => t.name === 'OpenCV');
    const scikitlearn = tools.find(t => t.name === 'Scikit-learn');
    
    const gpt4Paper = papers.find(p => p.title === 'GPT-4 Technical Report');
    const attentionPaper = papers.find(p => p.title === 'Attention Is All You Need');
    const bertPaper = papers.find(p => p.title === 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding');
    const fewShotPaper = papers.find(p => p.title === 'Language Models are Few-Shot Learners');
    const generalistPaper = papers.find(p => p.title === 'A Generalist Agent');
    const llamaPaper = papers.find(p => p.title === 'LLaMA: Open and Efficient Foundation Language Models');
    const codexPaper = papers.find(p => p.title === 'Evaluating Large Language Models Trained on Code');
    const instructGPTPaper = papers.find(p => p.title === 'Training language models to follow instructions with human feedback');
    const llmSurveyPaper = papers.find(p => p.title === 'A Survey of Large Language Models');
    const constitutionalAIPaper = papers.find(p => p.title === 'Constitutional AI: Harmlessness from AI Feedback');
    const verifiabilityPaper = papers.find(p => p.title === 'Evaluating Verifiability in Generative Search Engines');
    const chainOfThoughtPaper = papers.find(p => p.title === 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models');
    
    // Create relationships between topics and tools/papers
    await db.run(`
      INSERT INTO relationships (source_id, source_type, target_id, target_type, relationship_type)
      VALUES 
        -- Topic-Tool relationships
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        (?, 'topic', ?, 'tool', 'related'),
        
        -- Topic-Paper relationships
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related'),
        (?, 'topic', ?, 'paper', 'related');
    `, [
      // Topic-Tool relationships
      ml.id, tensorflow.id,
      ml.id, pytorch.id,
      dl.id, tensorflow.id,
      dl.id, pytorch.id,
      llm.id, gpt4.id,
      genai.id, dalle.id,
      genai.id, midjourney.id,
      genai.id, stableDiffusion.id,
      transformer.id, huggingFace.id,
      llm.id, langchain.id,
      llm.id, claude.id,
      dl.id, cuda.id,
      llm.id, cursor.id,
      llm.id, copilot.id,
      ai.id, n8n.id,
      cv.id, opencv.id,
      ml.id, scikitlearn.id,
      transformer.id, gpt4.id,
      
      // Topic-Paper relationships
      llm.id, gpt4Paper.id,
      transformer.id, attentionPaper.id,
      transformer.id, bertPaper.id,
      llm.id, fewShotPaper.id,
      ai.id, generalistPaper.id,
      llm.id, llamaPaper.id,
      llm.id, codexPaper.id,
      llm.id, instructGPTPaper.id,
      llm.id, llmSurveyPaper.id,
      llm.id, constitutionalAIPaper.id,
      llm.id, verifiabilityPaper.id,
      llm.id, chainOfThoughtPaper.id,
      transformer.id, fewShotPaper.id,
      dl.id, attentionPaper.id,
      genai.id, gpt4Paper.id
    ]);
    
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