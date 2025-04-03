// JSON data store for AI Indexer

// Type definitions
export interface Topic {
  id: number;
  name: string;
  description: string;
  source: string;
  parent_id?: number | null;
  veracity_score: number;
  detailed_info?: string;
  created_at?: string;
}

export interface Paper {
  id: number;
  arxiv_id?: string;
  title: string;
  authors?: string;
  summary?: string;
  published_date?: string;
  url?: string;
  detailed_info?: string;
  created_at?: string;
}

export interface AiTool {
  id: number;
  name: string;
  description: string;
  url?: string;
  category?: string;
  veracity_score?: number;
  detailed_info?: string;
  created_at?: string;
}

export interface Relationship {
  id: number;
  source_id: number;
  source_type: string;
  target_id: number;
  target_type: string;
  relationship_type: string;
  created_at?: string;
}

// Data
export const data = {
  topics: [
    {
      id: 1,
      name: 'Artificial Intelligence',
      description: 'The field of AI research and development',
      source: 'initial_seed',
      veracity_score: 1.0,
      detailed_info: 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. AI technology is rapidly advancing and being integrated into various sectors, including healthcare, finance, education, transportation, and more. Key branches include machine learning, neural networks, natural language processing, robotics, and computer vision. The field faces challenges related to ethics, bias, transparency, and job displacement. Future directions include advancing AI reasoning, integrating neuroscience insights, developing AI-human collaboration, addressing ethical concerns, and creating more specialized applications for industries.',
      created_at: '2023-04-03T05:10:00Z'
    },
    {
      id: 2,
      name: 'Machine Learning',
      description: 'A subset of AI focused on learning from data',
      source: 'initial_seed',
      veracity_score: 1.0,
      detailed_info: 'Machine Learning (ML) is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves. Machine learning evolved from pattern recognition and computational learning theory, and is widely used in data analytics to make predictions or decisions without being explicitly programmed to perform the task. Various techniques include supervised learning (using labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). Applications include image and speech recognition, recommendation systems, fraud detection, and autonomous vehicles. Recent advances include deep learning, transfer learning, and automated machine learning.',
      created_at: '2023-04-03T05:11:00Z'
    },
    {
      id: 3,
      name: 'Large Language Models',
      description: 'Models that process and generate human language',
      source: 'initial_seed',
      veracity_score: 1.0,
      detailed_info: 'Large Language Models (LLMs) are advanced AI systems trained on vast amounts of text data to understand and generate human-like text. These models, which include GPT (Generative Pre-trained Transformer) series, BERT, and others, can perform a wide range of language tasks including translation, summarization, question-answering, content creation, and conversation. LLMs utilize transformer architectures with attention mechanisms that help them understand context and relationships between words. They are trained on diverse corpora including books, articles, websites, and code, enabling them to capture broad knowledge about language and the world. Key challenges include factual accuracy, bias mitigation, transparency, computational requirements, and alignment with human values. Current applications span education, customer service, content creation, programming assistance, and research, with ongoing development focused on improving reasoning abilities and reducing hallucinations.',
      created_at: '2023-04-03T05:12:00Z'
    },
    {
      id: 4,
      name: 'Computer Vision',
      description: 'AI systems that can interpret and analyze visual information',
      source: 'initial_seed',
      veracity_score: 1.0,
      detailed_info: 'Computer Vision is a field of artificial intelligence that enables computers to derive meaningful information from digital images, videos, and other visual inputs. This technology allows machines to identify and process objects in much the same way that human vision does. Computer vision tasks include image recognition, object detection, segmentation, pose estimation, and motion analysis. It relies heavily on convolutional neural networks (CNNs) and other deep learning architectures. Applications span multiple industries including autonomous vehicles, medical diagnostics, surveillance, augmented reality, robotics, and quality control in manufacturing. Recent advances include real-time object detection systems, generative models like GANs for image synthesis, and self-supervised learning approaches that reduce dependence on labeled data.',
      created_at: '2023-04-03T05:13:00Z'
    },
    {
      id: 5,
      name: 'Reinforcement Learning',
      description: 'Learning through interaction with an environment',
      source: 'initial_seed',
      veracity_score: 1.0,
      detailed_info: 'Reinforcement Learning (RL) is a type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize some notion of cumulative reward. Unlike supervised learning, the agent isn\'t explicitly told which actions to take but must discover which actions yield the highest rewards through trial and error. Key concepts include the agent-environment interaction loop, reward signals, value functions, and policies. RL has achieved remarkable successes in games (AlphaGo, Atari games), robotics, resource management, recommendation systems, and autonomous vehicles. Modern approaches combine RL with deep learning (Deep RL) and include methods like Q-learning, policy gradients, actor-critic methods, and model-based RL. Challenges include sample efficiency, exploration-exploitation trade-offs, and transferring skills learned in one environment to another.',
      created_at: '2023-04-03T05:14:00Z'
    },
    {
      id: 6,
      name: 'Natural Language Processing',
      description: 'AI systems that understand and generate human language',
      source: 'initial_seed',
      veracity_score: 1.0,
      detailed_info: 'Natural Language Processing (NLP) is a field of artificial intelligence focused on enabling computers to understand, interpret, and generate human language in useful ways. NLP combines computational linguistics, machine learning, and deep learning to process and analyze large amounts of natural language data. Key NLP tasks include sentiment analysis, named entity recognition, part-of-speech tagging, machine translation, question answering, summarization, and dialogue systems. The field has been revolutionized by transformer-based language models like BERT, GPT, and T5, which have achieved state-of-the-art results across numerous language tasks. Applications include virtual assistants, customer service chatbots, content analysis, language translation, information extraction from text, and automated content generation. Ongoing challenges include handling context, understanding nuance and sarcasm, maintaining factual accuracy, and reducing biases present in training data.',
      created_at: '2023-04-03T05:15:00Z'
    }
  ],
  
  tools: [
    {
      id: 1,
      name: 'TensorFlow',
      description: 'An open-source machine learning framework developed by Google',
      url: 'https://www.tensorflow.org/',
      category: 'Machine Learning Framework',
      veracity_score: 1.0,
      detailed_info: 'TensorFlow is an open-source machine learning framework developed by the Google Brain team.',
      created_at: '2023-04-03T05:20:00Z'
    },
    {
      id: 2,
      name: 'PyTorch',
      description: 'An open-source machine learning framework developed by Facebook',
      url: 'https://pytorch.org/',
      category: 'Machine Learning Framework',
      veracity_score: 1.0,
      detailed_info: 'PyTorch is an open-source machine learning library developed by Facebook\'s AI Research lab.',
      created_at: '2023-04-03T05:20:30Z'
    },
    {
      id: 3,
      name: 'OpenAI GPT-4',
      description: 'Large language model created by OpenAI',
      url: 'https://openai.com/gpt-4',
      category: 'Language Model',
      veracity_score: 0.95,
      detailed_info: 'GPT-4 is a large multimodal model created by OpenAI that can accept image and text inputs and produce text outputs.',
      created_at: '2023-04-03T05:21:00Z'
    },
    {
      id: 4,
      name: 'DALL-E 2',
      description: 'AI system that creates realistic images from text descriptions',
      url: 'https://openai.com/dall-e-2',
      category: 'Image Generation',
      veracity_score: 0.95,
      detailed_info: 'DALL-E 2 is an AI system developed by OpenAI that can create realistic images and art from a text description.',
      created_at: '2023-04-03T05:22:00Z'
    },
    {
      id: 5,
      name: 'Hugging Face Transformers',
      description: 'Library for working with transformer-based models',
      url: 'https://huggingface.co/transformers',
      category: 'Machine Learning Library',
      veracity_score: 1.0,
      detailed_info: 'Hugging Face Transformers is a library that provides thousands of pre-trained models for natural language processing tasks.',
      created_at: '2023-04-03T05:23:00Z'
    },
    {
      id: 6,
      name: 'Cursor',
      description: 'AI-powered code editor based on VSCode',
      url: 'https://cursor.com/',
      category: 'Developer Tool',
      veracity_score: 0.95,
      detailed_info: 'Cursor is an AI-enhanced code editor built on the foundation of Visual Studio Code, designed to integrate large language models into the development workflow.',
      created_at: '2023-04-03T05:30:32Z'
    }
  ],
  
  papers: [
    {
      id: 1,
      arxiv_id: '2303.08774',
      title: 'GPT-4 Technical Report',
      authors: 'OpenAI',
      summary: 'Technical report describing GPT-4, a large-scale multimodal model',
      published_date: '2023-03-15',
      url: 'https://arxiv.org/abs/2303.08774',
      detailed_info: 'This paper introduces GPT-4, a large multimodal model capable of processing image and text inputs and producing text outputs.',
      created_at: '2023-04-03T05:25:00Z'
    },
    {
      id: 2,
      arxiv_id: '1706.03762',
      title: 'Attention Is All You Need',
      authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin',
      summary: 'The paper that introduced the Transformer architecture',
      published_date: '2017-06-12',
      url: 'https://arxiv.org/abs/1706.03762',
      detailed_info: 'This paper introduced the Transformer architecture, which has been foundational for modern language models.',
      created_at: '2023-04-03T05:26:00Z'
    },
    {
      id: 3,
      arxiv_id: '1810.04805',
      title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
      authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
      summary: 'Paper describing BERT, a bidirectional transformer pre-trained using masked language modeling',
      published_date: '2018-10-11',
      url: 'https://arxiv.org/abs/1810.04805',
      detailed_info: 'This paper introduced BERT, which uses bidirectional training of Transformer for language modeling.',
      created_at: '2023-04-03T05:27:00Z'
    },
    {
      id: 4,
      arxiv_id: '2005.14165',
      title: 'Language Models are Few-Shot Learners',
      authors: 'Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, Prafulla Dhariwal, Arvind Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, Sandhini Agarwal, Ariel Herbert-Voss, Gretchen Krueger, Tom Henighan, Rewon Child, Aditya Ramesh, Daniel M. Ziegler, Jeffrey Wu, Clemens Winter, Christopher Hesse, Mark Chen, Eric Sigler, Mateusz Litwin, Scott Gray, Benjamin Chess, Jack Clark, Christopher Berner, Sam McCandlish, Alec Radford, Ilya Sutskever, Dario Amodei',
      summary: 'Paper describing GPT-3 and its few-shot learning capabilities',
      published_date: '2020-05-28',
      url: 'https://arxiv.org/abs/2005.14165',
      detailed_info: 'This paper describes GPT-3 and demonstrates how it can perform tasks with few or no examples.',
      created_at: '2023-04-03T05:28:00Z'
    }
  ],
  
  relationships: [
    {
      id: 1,
      source_id: 1,
      source_type: 'topic',
      target_id: 2,
      target_type: 'topic',
      relationship_type: 'parent-child',
      created_at: '2023-04-03T05:35:00Z'
    },
    {
      id: 2,
      source_id: 1,
      source_type: 'topic',
      target_id: 4,
      target_type: 'topic',
      relationship_type: 'parent-child',
      created_at: '2023-04-03T05:35:10Z'
    },
    {
      id: 3,
      source_id: 1,
      source_type: 'topic',
      target_id: 5,
      target_type: 'topic',
      relationship_type: 'parent-child',
      created_at: '2023-04-03T05:35:20Z'
    },
    {
      id: 4,
      source_id: 1,
      source_type: 'topic',
      target_id: 6,
      target_type: 'topic',
      relationship_type: 'parent-child',
      created_at: '2023-04-03T05:35:30Z'
    },
    {
      id: 5,
      source_id: 6,
      source_type: 'topic',
      target_id: 3,
      target_type: 'topic',
      relationship_type: 'parent-child',
      created_at: '2023-04-03T05:35:40Z'
    },
    {
      id: 6,
      source_id: 2,
      source_type: 'topic',
      target_id: 1,
      target_type: 'tool',
      relationship_type: 'related',
      created_at: '2023-04-03T05:36:00Z'
    },
    {
      id: 7,
      source_id: 2,
      source_type: 'topic',
      target_id: 2,
      target_type: 'tool',
      relationship_type: 'related',
      created_at: '2023-04-03T05:36:10Z'
    },
    {
      id: 8,
      source_id: 3,
      source_type: 'topic',
      target_id: 3,
      target_type: 'tool',
      relationship_type: 'related',
      created_at: '2023-04-03T05:36:20Z'
    },
    {
      id: 9,
      source_id: 3,
      source_type: 'topic',
      target_id: 6,
      target_type: 'tool',
      relationship_type: 'related',
      created_at: '2023-04-03T05:36:30Z'
    },
    {
      id: 10,
      source_id: 3,
      source_type: 'topic',
      target_id: 1,
      target_type: 'paper',
      relationship_type: 'related',
      created_at: '2023-04-03T05:37:00Z'
    },
    {
      id: 11,
      source_id: 3,
      source_type: 'topic',
      target_id: 4,
      target_type: 'paper',
      relationship_type: 'related',
      created_at: '2023-04-03T05:37:10Z'
    }
  ]
};

// Helper functions to simulate database operations
export function getAllTopics() {
  return [...data.topics];
}

export function getAllTools() {
  return [...data.tools];
}

export function getAllPapers() {
  return [...data.papers];
}

export function getAllRelationships() {
  return [...data.relationships];
}

export function getTopicById(id: number) {
  return data.topics.find(topic => topic.id === id) || null;
}

export function getToolById(id: number) {
  return data.tools.find(tool => tool.id === id) || null;
}

export function getPaperById(id: number) {
  return data.papers.find(paper => paper.id === id) || null;
}

export function getRelationshipsForNode(id: number, type: string) {
  return data.relationships.filter(rel => 
    (rel.source_id === id && rel.source_type === type) || 
    (rel.target_id === id && rel.target_type === type)
  );
}

export function getRelatedTopics(sourceId: number, sourceType: string) {
  const relationships = data.relationships.filter(rel => 
    (rel.source_id === sourceId && rel.source_type === sourceType && rel.target_type === 'topic') ||
    (rel.target_id === sourceId && rel.target_type === sourceType && rel.source_type === 'topic')
  );
  
  const topicIds = relationships.map(rel => 
    rel.source_type === 'topic' ? rel.source_id : rel.target_id
  ).filter(id => id !== sourceId);
  
  return data.topics.filter(topic => topicIds.includes(topic.id));
}

export function getRelatedTools(sourceId: number, sourceType: string) {
  const relationships = data.relationships.filter(rel => 
    (rel.source_id === sourceId && rel.source_type === sourceType && rel.target_type === 'tool') ||
    (rel.target_id === sourceId && rel.target_type === sourceType && rel.source_type === 'tool')
  );
  
  const toolIds = relationships.map(rel => 
    rel.source_type === 'tool' ? rel.source_id : rel.target_id
  );
  
  return data.tools.filter(tool => toolIds.includes(tool.id));
}

export function getRelatedPapers(sourceId: number, sourceType: string) {
  const relationships = data.relationships.filter(rel => 
    (rel.source_id === sourceId && rel.source_type === sourceType && rel.target_type === 'paper') ||
    (rel.target_id === sourceId && rel.target_type === sourceType && rel.source_type === 'paper')
  );
  
  const paperIds = relationships.map(rel => 
    rel.source_type === 'paper' ? rel.source_id : rel.target_id
  );
  
  return data.papers.filter(paper => paperIds.includes(paper.id));
}

// Mock functions for adding data (won't actually modify the data in production)
let nextTopicId = data.topics.length + 1;
let nextToolId = data.tools.length + 1;
let nextPaperId = data.papers.length + 1;
let nextRelationshipId = data.relationships.length + 1;

export function addTopic(topic: Omit<Topic, 'id' | 'created_at'>) {
  console.log('Would add topic:', topic);
  // In a real implementation with a writable data store, you would add the topic
  return nextTopicId++;
}

export function addAiTool(tool: Omit<AiTool, 'id' | 'created_at'>) {
  console.log('Would add tool:', tool);
  // In a real implementation with a writable data store, you would add the tool
  return nextToolId++;
}

export function addPaper(paper: Omit<Paper, 'id' | 'created_at'>) {
  console.log('Would add paper:', paper);
  // In a real implementation with a writable data store, you would add the paper
  return nextPaperId++;
}

export function addRelationship(relationship: Omit<Relationship, 'id' | 'created_at'>) {
  console.log('Would add relationship:', relationship);
  // In a real implementation with a writable data store, you would add the relationship
  return nextRelationshipId++;
}

// Debug functions
export function getDataCounts() {
  return {
    topics: data.topics.length,
    tools: data.tools.length,
    papers: data.papers.length,
    relationships: data.relationships.length
  };
} 