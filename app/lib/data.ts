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
    },
    {
      id: 7,
      name: 'Neural Networks',
      description: 'Computing systems inspired by biological neural networks',
      source: 'expansion',
      veracity_score: 0.95,
      detailed_info: 'Neural Networks are computing systems inspired by biological neural networks that constitute animal brains. They are the foundation of many modern machine learning systems, particularly deep learning. A neural network consists of layers of interconnected nodes or "neurons," each processing and passing information to subsequent layers. Different architectures include feedforward networks, convolutional neural networks (CNNs), recurrent neural networks (RNNs), and transformers. Neural networks excel at pattern recognition tasks such as image classification, speech recognition, and natural language processing. Training involves adjusting the weights of connections between neurons using techniques like backpropagation and gradient descent. Recent advances include deeper architectures, attention mechanisms, and specialized networks for specific domains such as graph neural networks for relational data.',
      created_at: '2023-05-15T09:10:00Z'
    },
    {
      id: 8,
      name: 'Deep Learning',
      description: 'Machine learning based on deep neural networks with multiple layers',
      source: 'expansion',
      veracity_score: 0.92,
      parent_id: 2,
      detailed_info: 'Deep Learning is a subset of machine learning that uses multi-layered neural networks to extract progressively higher-level features from raw input data. It has revolutionized AI capabilities in vision, language, audio, and game playing. Deep learning architectures include deep neural networks (DNNs), convolutional neural networks (CNNs), recurrent neural networks (RNNs), and transformers. The "deep" aspect refers to the multiple hidden layers between input and output, which enable automatic feature extraction without manual engineering. Training deep models requires substantial data and computational resources but offers powerful representation learning. Key advances include residual connections (ResNets) to train very deep networks, batch normalization for stable training, dropout for regularization, and Adam optimization. Deep learning powers applications like image recognition, machine translation, speech synthesis, autonomous driving, and drug discovery.',
      created_at: '2023-05-15T09:15:00Z'
    },
    {
      id: 9,
      name: 'Generative AI',
      description: 'AI systems that create new content such as text, images, audio, or code',
      source: 'expansion',
      veracity_score: 0.9,
      detailed_info: 'Generative AI refers to artificial intelligence systems capable of generating new content that resembles human-created work. This includes text (like articles or code), images, music, videos, and 3D models. Major advances in generative AI include GANs (Generative Adversarial Networks), VAEs (Variational Autoencoders), diffusion models, and autoregressive models like GPT. These systems learn patterns from vast datasets and can then produce novel outputs that maintain the statistical properties of their training data. Recent breakthroughs include text-to-image models (DALL-E, Midjourney, Stable Diffusion), large language models for text and code generation (GPT, Claude, LLaMA), voice synthesis (WaveNet, VALL-E), and music composition tools. Concerns about generative AI include copyright issues, potential misuse for creating deepfakes, impact on creative professions, and amplification of biases present in training data.',
      created_at: '2023-05-15T09:20:00Z'
    },
    {
      id: 10,
      name: 'Robotics',
      description: 'The branch of AI concerned with creating physical machines that can perform tasks',
      source: 'expansion',
      veracity_score: 0.88,
      detailed_info: 'Robotics combines mechanical engineering, electrical engineering, and computer science to design, construct, and operate robots—machines that can substitute for humans and replicate human actions. Modern robotics heavily incorporates AI techniques for perception, decision-making, and control. Categories include industrial robots for manufacturing, service robots for commercial and consumer applications, medical robots for surgery and rehabilitation, and autonomous mobile robots like self-driving vehicles and drones. Key components include sensors (cameras, LiDAR, tactile sensors), actuators, control systems, and AI algorithms for navigation, manipulation, and interaction. Current research focuses on improving dexterity and manipulation skills, advancing human-robot collaboration, developing better learning algorithms for robotic control, enhancing robots\' social interaction capabilities, and creating more adaptable and generalizable robotic systems.',
      created_at: '2023-05-15T09:25:00Z'
    },
    {
      id: 11,
      name: 'AI Ethics',
      description: 'Study of ethical issues related to artificial intelligence development and deployment',
      source: 'expansion',
      veracity_score: 0.85,
      detailed_info: 'AI Ethics examines the moral implications of developing and deploying artificial intelligence systems. It addresses concerns including fairness and bias in AI decision-making, transparency and explainability of AI systems, privacy concerns around data collection and use, accountability for AI actions, potential job displacement due to automation, and existential risks from advanced AI. Key principles include beneficence (AI should benefit humanity), non-maleficence (AI should avoid harm), autonomy (humans should maintain control), justice (AI benefits should be distributed fairly), and explicability (AI decisions should be understandable). Frameworks for ethical AI include technical approaches like fairness-aware algorithms and interpretability methods, governance approaches through regulations and standards (like the EU AI Act), and organizational practices such as diverse AI development teams and ethical review processes. The field is interdisciplinary, drawing from philosophy, computer science, law, sociology, and psychology.',
      created_at: '2023-05-15T09:30:00Z'
    },
    {
      id: 12,
      name: 'AI Alignment',
      description: 'Research on ensuring AI systems act in accordance with human values and intentions',
      source: 'expansion',
      veracity_score: 0.82,
      detailed_info: 'AI Alignment research focuses on ensuring that increasingly capable AI systems remain aligned with human values, goals, and intentions. This field addresses the challenge that powerful optimization systems might pursue goals in unintended ways if their objectives are not perfectly specified. Key areas include specification (accurately defining what we want AI to do), robustness (ensuring AI continues to pursue intended goals even as its capabilities increase), and monitoring (maintaining oversight of AI systems). Technical approaches include reinforcement learning from human feedback (RLHF), constitutional AI methods, interpretability research to understand AI reasoning, and formal verification of AI behavior. The field also considers philosophical questions about which values AI should align with, given diverse human preferences, and governance structures to ensure alignment efforts are prioritized as AI capabilities advance. AI alignment is considered increasingly important as AI systems become more autonomous and capable of taking actions with significant real-world impacts.',
      created_at: '2023-05-15T09:35:00Z'
    },
    {
      id: 13,
      name: 'Multimodal AI',
      description: 'AI systems that can process and integrate multiple types of information',
      source: 'expansion',
      veracity_score: 0.9,
      detailed_info: 'Multimodal AI refers to artificial intelligence systems that can process and integrate information from multiple modalities or types of data, such as text, images, audio, video, and sensor readings. By combining inputs from different sources, these systems gain a more comprehensive understanding of the world, similar to how humans use multiple senses. Examples include vision-language models like GPT-4V and Gemini that can analyze images and answer questions about them, text-to-image generators like DALL-E and Stable Diffusion, multimodal chatbots that can process voice and visual inputs, and embodied AI agents that integrate perception across modalities for robotics applications. Key technical challenges include aligning representations across different modalities, managing the computational complexity of processing multiple data streams, and developing architectures that effectively fuse information from different sources. Multimodal AI has applications in healthcare diagnostics, autonomous vehicles, accessibility tools, augmented reality, and more sophisticated virtual assistants.',
      created_at: '2023-05-15T09:40:00Z'
    },
    {
      id: 14,
      name: 'Federated Learning',
      description: 'Technique that trains AI models across multiple devices while keeping data private',
      source: 'expansion',
      parent_id: 2,
      veracity_score: 0.85,
      detailed_info: 'Federated Learning is a machine learning approach where an algorithm is trained across multiple decentralized devices or servers holding local data samples, without exchanging the data itself. This technique addresses privacy concerns by allowing model training on sensitive data (like medical records or personal messages) without that data ever leaving its source device. In federated learning, only model updates are shared with a central server, not the raw data. The server then aggregates these updates to improve a global model, which is redistributed to the participating devices. Challenges include dealing with statistical heterogeneity (when data across devices isn\'t identically distributed), communication efficiency (as sending model updates can be bandwidth-intensive), and security concerns (as model updates might still leak some information). Applications include predictive text on smartphones, healthcare analytics across institutions, financial fraud detection, and IoT device optimization. Recent advances include algorithms for robust aggregation, compression techniques for efficient communication, and differential privacy methods to further enhance data protection.',
      created_at: '2023-05-15T09:45:00Z'
    },
    {
      id: 15,
      name: 'AI Agents',
      description: 'Autonomous AI systems that can take actions to achieve specific goals',
      source: 'expansion',
      veracity_score: 0.87,
      detailed_info: 'AI Agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. Unlike traditional AI models that perform discrete tasks, agents are designed to operate continuously in dynamic environments, learning and adapting over time. Components of AI agents include perception (sensing the environment), cognition (processing information and decision-making), and action (implementing decisions in the world). Architectures range from reactive agents (simple stimulus-response) to deliberative agents (planning-based) and hybrid approaches. Recent advances in large language models have enabled agentic AI systems that can plan complex sequences of actions, use tools, perform reasoning steps, and maintain long-term goals and context. Research challenges include balancing exploration versus exploitation, ensuring safety and alignment with human values, enabling effective human oversight, and creating agents that can learn from limited examples. Applications include personal assistants, autonomous vehicles, trading systems, game-playing agents, search and rescue robots, and research assistants.',
      created_at: '2023-05-15T09:50:00Z'
    },
    {
      id: 16,
      name: 'Quantum Machine Learning',
      description: 'Intersection of quantum computing and machine learning',
      source: 'expansion',
      parent_id: 2,
      veracity_score: 0.8,
      detailed_info: 'Quantum Machine Learning (QML) explores the intersection of quantum computing and machine learning, seeking to harness quantum mechanical phenomena to enhance learning algorithms. This emerging field investigates how quantum properties like superposition, entanglement, and interference might provide computational advantages for certain machine learning tasks. Potential benefits include faster processing of high-dimensional data, more efficient sampling, and exploring larger solution spaces simultaneously. Current QML approaches include quantum neural networks, quantum support vector machines, quantum principal component analysis, and variational quantum algorithms like QAOA and VQE. Research is actively exploring quantum kernels, quantum feature maps, and quantum reinforcement learning. Significant challenges remain, including hardware limitations of current noisy intermediate-scale quantum (NISQ) devices, error correction requirements, and identifying which machine learning problems truly benefit from quantum approaches. As quantum hardware matures, QML could potentially transform areas requiring complex optimization, simulation of quantum systems, or processing of massive, high-dimensional datasets.',
      created_at: '2023-05-15T09:55:00Z'
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
    },
    {
      id: 7,
      name: 'Midjourney',
      description: 'AI-powered text-to-image generation tool',
      url: 'https://www.midjourney.com/',
      category: 'Image Generation',
      veracity_score: 0.95,
      detailed_info: 'Midjourney is an AI image generation service that creates images from natural language descriptions, known as "prompts." It uses a machine learning technique similar to diffusion models to generate detailed and artistic visualizations based on textual input. Midjourney has gained popularity for its aesthetically pleasing outputs and particular style that blends photorealism with artistic elements. The service operates primarily through Discord, where users can interact with the Midjourney bot to generate images in community servers. It offers various parameters to control aspects like aspect ratio, stylistic variations, and image quality. Midjourney continues to evolve with regular version updates that improve image coherence, detail, and prompt adherence.',
      created_at: '2023-05-20T10:00:00Z'
    },
    {
      id: 8,
      name: 'LangChain',
      description: 'Framework for developing applications with LLMs',
      url: 'https://langchain.com/',
      category: 'Development Framework',
      veracity_score: 0.93,
      detailed_info: 'LangChain is an open-source framework designed to simplify the development of applications using large language models (LLMs). It provides a standard interface for chains, integrations with other tools, and end-to-end chains for common applications. The framework focuses on composability, allowing developers to combine various components like document loaders, embeddings, vector stores, and prompt templates to create sophisticated applications. Key features include document analysis with semantic search, multi-step reasoning through chains that combine multiple LLM calls, and agents that can use tools and decide on actions to take. LangChain supports various LLM providers including OpenAI, Anthropic, and open-source models, and offers memory components to retain information between calls in a conversation.',
      created_at: '2023-05-20T10:05:00Z'
    },
    {
      id: 9,
      name: 'Stable Diffusion',
      description: 'Open-source text-to-image diffusion model',
      url: 'https://stability.ai/stable-diffusion',
      category: 'Image Generation',
      veracity_score: 0.94,
      detailed_info: 'Stable Diffusion is an open-source text-to-image latent diffusion model released by Stability AI. Unlike many proprietary AI image generators, Stable Diffusion\'s open-source nature has allowed it to be downloaded and run locally on consumer hardware, leading to widespread adoption and customization. The model works by understanding text prompts and gradually removing noise from a random seed image to create a coherent image matching the description. Stable Diffusion can be used for various tasks including text-to-image generation, image-to-image transformations (using an existing image as a starting point), inpainting (selectively regenerating portions of an image), and outpainting (extending images beyond their original boundaries). The model has undergone multiple versions, each improving image quality, prompt adherence, and reducing unwanted artifacts.',
      created_at: '2023-05-20T10:10:00Z'
    },
    {
      id: 10,
      name: 'AutoGPT',
      description: 'Autonomous AI agent using GPT-4',
      url: 'https://github.com/Significant-Gravitas/Auto-GPT',
      category: 'AI Agent',
      veracity_score: 0.85,
      detailed_info: 'AutoGPT is an experimental open-source application that demonstrates the potential of autonomous AI agents. It uses GPT-4 to operate with minimal human input by breaking down larger objectives into smaller tasks and executing them. AutoGPT distinguishes itself by incorporating memory systems, planning capabilities, and internet access to perform complex sequences of actions toward user-defined goals. The tool includes features like chain-of-thought reasoning, adaptive planning, and the ability to access various tools including web browsing, file operations, and code execution. Users define a goal, and AutoGPT autonomously determines the necessary steps, executes them, and learns from the outcomes. While primarily an experimental project, AutoGPT has sparked interest in agentic AI systems that can operate with extended autonomy.',
      created_at: '2023-05-20T10:15:00Z'
    },
    {
      id: 11,
      name: 'Anthropic Claude',
      description: 'Conversational AI assistant with focus on safety',
      url: 'https://www.anthropic.com/claude',
      category: 'Language Model',
      veracity_score: 0.94,
      detailed_info: 'Claude is a conversational AI assistant developed by Anthropic, designed with a focus on helpfulness, harmlessness, and honesty. Anthropic has developed Claude using a technique called Constitutional AI, which aims to create AI systems that are more aligned with human values and less prone to generating harmful outputs. Claude excels at thoughtful dialogue, content creation, complex reasoning, and answering questions across many domains. It can process and analyze large documents (up to approximately 75,000 words), making it useful for tasks requiring comprehension of extensive text. Claude is available through a direct API and through integrations with platforms like Amazon Bedrock, Slack, and various AI applications. Different versions of Claude exist (Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku) with varying capabilities and performance characteristics.',
      created_at: '2023-05-20T10:20:00Z'
    },
    {
      id: 12,
      name: 'Llama 3',
      description: 'Open-source large language model by Meta',
      url: 'https://ai.meta.com/llama/',
      category: 'Language Model',
      veracity_score: 0.93,
      detailed_info: "Llama 3 is an open-source large language model developed by Meta AI, designed to be more accessible to researchers and developers than proprietary alternatives. Released under a more permissive license than previous versions, Llama 3 allows for commercial use with certain restrictions. The model comes in different sizes (8B and 70B parameters) to accommodate various computational resources, with the larger models providing better performance across reasoning, coding, and knowledge-intensive tasks. Llama 3 has been trained on a diverse multilingual dataset and exhibits improved performance on truthfulness, reasoning, and coding benchmarks compared to its predecessors. The model architecture builds on the transformer design with optimizations like Grouped-Query Attention (GQA) for more efficient inference. Meta's release of Llama 3 represents part of a broader trend toward more open and accessible AI development.",
      created_at: '2023-05-20T10:25:00Z'
    },
    {
      id: 13,
      name: 'NVIDIA Omniverse',
      description: 'Platform for 3D design collaboration and simulation',
      url: 'https://www.nvidia.com/en-us/omniverse/',
      category: 'Simulation Platform',
      veracity_score: 0.92,
      detailed_info: 'NVIDIA Omniverse is a scalable computing platform for creating and operating industrial metaverse applications. It provides a shared virtual space where 3D designers, engineers, and creators can collaborate in real-time across different software applications. Omniverse is built on Universal Scene Description (USD), originally developed by Pixar, which serves as an open, extensible ecosystem for 3D workflows. The platform includes AI-powered tools for tasks like generating 3D assets from 2D images, converting simple objects to physically accurate ones, and enhancing animations with realistic physics. Key applications include digital twins for industrial facilities, advanced simulations for robotics and autonomous vehicles, and collaborative 3D content creation for entertainment. Omniverse combines NVIDIA\'s expertise in graphics processing with AI technologies to create a powerful environment for building, simulating, and rendering complex 3D worlds with photorealistic quality.',
      created_at: '2023-05-20T10:30:00Z'
    },
    {
      id: 14,
      name: 'Jasper',
      description: 'AI content generation platform for marketing',
      url: 'https://www.jasper.ai/',
      category: 'Content Generation',
      veracity_score: 0.89,
      detailed_info: 'Jasper is an AI content generation platform designed specifically for marketing and business content creation. It uses advanced language models to help marketing teams, content creators, and businesses generate blog posts, social media content, marketing copy, emails, and other written materials. Jasper offers various specialized templates for different content formats and marketing needs, as well as a document editor with AI-assisted writing capabilities. The platform includes features like brand voice customization, which helps maintain consistent tone across different pieces of content, and team collaboration tools for enterprises. Jasper integrates with other marketing tools and platforms, including SEO analyzers, image generators, and content management systems. While focused primarily on generating marketing content, Jasper has expanded to support various business writing tasks, from internal communications to product descriptions.',
      created_at: '2023-05-20T10:35:00Z'
    },
    {
      id: 15,
      name: 'Runway Gen-2',
      description: 'AI video generation platform',
      url: 'https://runwayml.com/',
      category: 'Video Generation',
      veracity_score: 0.91,
      detailed_info: 'Runway Gen-2 is an advanced AI video generation platform that can create and edit videos from text prompts or image inputs. Developed by Runway, a creative AI company, Gen-2 represents a significant advancement in generative AI for video content. The model can generate short video clips based on text descriptions, transform still images into moving videos, and extend existing videos with AI-generated content. Gen-2 supports various creative controls including motion direction, stylistic parameters, and the ability to maintain consistent characters or scenes across generated clips. The platform is used by filmmakers, visual effects artists, and content creators to quickly prototype ideas, generate establishing shots, or create specialized visual effects. Runway continues to develop the technology, with each iteration improving temporal consistency, visual quality, and creative control options.',
      created_at: '2023-05-20T10:40:00Z'
    },
    {
      id: 16,
      name: 'Cohere',
      description: 'NLP platform providing language models through API',
      url: 'https://cohere.com/',
      category: 'Language Model',
      veracity_score: 0.9,
      detailed_info: 'Cohere is an NLP platform that provides access to powerful language models through a simple API. Founded by former Google Brain researchers, Cohere focuses on making advanced language AI accessible to developers and businesses of all sizes. The company offers various models specialized for different tasks, including generation (creating original content), representation (understanding and embedding text), and classification (categorizing text). Cohere\'s models excel at enterprise and business use cases, with features designed for semantic search, content moderation, customer support automation, and multilingual applications. The platform emphasizes data privacy and security, with options for deploying models on private clouds. Cohere Command, their flagship model, has been optimized for reliability, factuality, and commercial use, making it particularly suited for business-critical applications that require consistent and trustworthy outputs.',
      created_at: '2023-05-20T10:45:00Z'
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
    },
    {
      id: 5,
      arxiv_id: '2106.09685',
      title: 'Evaluating Large Language Models Trained on Code',
      authors: 'Mark Chen, Jerry Tworek, Heewoo Jun, Qiming Yuan, Henrique Ponde de Oliveira Pinto, Jared Kaplan, Harri Edwards, Yuri Burda, Nicholas Joseph, Greg Brockman, Alex Ray, Raul Puri, Gretchen Krueger, Michael Petrov, Heidy Khlaaf, Girish Sastry, Pamela Mishkin, Brooke Chan, Scott Gray, Nick Ryder, Mikhail Pavlov, Alethea Power, Lukasz Kaiser, Mohammad Bavarian, Clemens Winter, Philippe Tillet, Felipe Petroski Such, Dave Cummings, Matthias Plappert, Fotios Chantzis, Elizabeth Barnes, Ariel Herbert-Voss, William Hebgen Guss, Alex Nichol, Alex Paino, Nikolas Tezak, Jie Tang, Igor Babuschkin, Suchir Balaji, Shantanu Jain, William Saunders, Christopher Hesse, Andrew N. Carr, Jan Leike, Josh Achiam, Vedant Misra, Evan Morikawa, Alec Radford, Matthew Knight, Miles Brundage, Mira Murati, Katie Mayer, Peter Welinder, Bob McGrew, Dario Amodei, Sam McCandlish, Ilya Sutskever, Wojciech Zaremba',
      summary: 'Study presenting Codex, the model powering GitHub Copilot',
      published_date: '2021-06-17',
      url: 'https://arxiv.org/abs/2106.09685',
      detailed_info: 'This paper presents Codex, a GPT model fine-tuned on publicly available code from GitHub. The researchers train Codex on both natural language and billions of lines of source code to create a model that can translate natural language to programming code. The paper describes how Codex was evaluated on Python code-writing tasks, including novel problems that require deeper reasoning, and demonstrates that the model can solve up to 72% of these problems. The authors also discuss the limitations of Codex, including its tendency to repeat training data verbatim and its sensitivity to solution format and variable naming. The research represents a significant advancement in code generation, showing how large language models can be applied to programming tasks, while also highlighting the challenges and ethical considerations of automated code generation systems.',
      created_at: '2023-05-21T11:00:00Z'
    },
    {
      id: 6,
      arxiv_id: '2204.05862',
      title: 'Training language models to follow instructions with human feedback',
      authors: 'Long Ouyang, Jeff Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, John Schulman, Jacob Hilton, Fraser Kelton, Luke Miller, Maddie Simens, Amanda Askell, Peter Welinder, Paul Christiano, Jan Leike, Ryan Lowe',
      summary: 'Paper introducing Reinforcement Learning from Human Feedback (RLHF)',
      published_date: '2022-04-12',
      url: 'https://arxiv.org/abs/2204.05862',
      detailed_info: 'This paper introduces InstructGPT, an approach for aligning language models with human intent by fine-tuning them using reinforcement learning from human feedback (RLHF). The researchers start with a pretrained GPT model, then fine-tune it using human demonstrations of desired behaviors, create a reward model from human comparisons of outputs, and finally optimize the model against this reward using reinforcement learning. The resulting InstructGPT models are much better at following instructions than the original GPT-3, show improvements in truthfulness and reductions in toxic outputs, while being preferred by human evaluators. This work established the RLHF approach that has become fundamental to developing helpful and harmless AI assistants like ChatGPT, Claude, and subsequent instruction-tuned models. The paper discusses important limitations, including that the models still make factual errors and can still generate toxic outputs when explicitly instructed to do so.',
      created_at: '2023-05-21T11:05:00Z'
    },
    {
      id: 7,
      arxiv_id: '2112.11446',
      title: 'A Generalist Agent',
      authors: 'Scott Reed, Konrad Żołna, Emilio Parisotto, Sergio Gómez Colmenarejo, Alexander Novikov, Gabriel Barth-Maron, Mai Giménez, Yury Sulsky, Jackie Kay, Jost Tobias Springenberg, Tom Eccles, Jake Bruce, Ali Razavi, Ashley Edwards, Nicolas Heess, Yutian Chen, Raia Hadsell, Oriol Vinyals, Mahyar Bordbar, Nando de Freitas',
      summary: 'DeepMind paper presenting Gato, a generalist AI agent trained across multiple domains',
      published_date: '2021-12-20',
      url: 'https://arxiv.org/abs/2112.11446',
      detailed_info: 'This paper introduces Gato, a generalist AI agent from DeepMind that can perform hundreds of different tasks across vastly different domains. Gato uses a single neural network with the same set of weights to play Atari games, caption images, chat with humans, control robotic arms, and more. The researchers train this transformer-based model on a diverse set of data including text, images, button presses, and joint torques, all represented as tokens in a sequence. Despite being a generalist, Gato achieves competitive performance compared to specialists in many domains. The paper represents an important step toward more general AI systems that can handle multiple modalities and tasks without requiring separate models for each application. The researchers suggest that training such generalist models on even more data and compute could lead to systems with even broader and more general capabilities.',
      created_at: '2023-05-21T11:10:00Z'
    },
    {
      id: 8,
      arxiv_id: '2302.13971',
      title: 'A Survey of Large Language Models',
      authors: 'Wayne Xin Zhao, Kun Zhou, Junyi Li, Tianyi Tang, Xiaolei Wang, Yupeng Hou, Yingqian Min, Beichen Zhang, Junjie Zhang, Zican Dong, Yifan Du, Chen Yang, Yushuo Chen, Zhipeng Chen, Jinhao Jiang, Ruiyang Ren, Yifan Li, Xinyu Tang, Zikang Liu, Peiyu Liu, Jian-Yun Nie, Ji-Rong Wen',
      summary: 'Comprehensive survey of large language models, their capabilities, and challenges',
      published_date: '2023-02-27',
      url: 'https://arxiv.org/abs/2302.13971',
      detailed_info: 'This comprehensive survey paper examines the rapidly evolving field of large language models (LLMs), providing a systematic review of their development, capabilities, and challenges. The authors present a taxonomy of existing LLMs and thoroughly analyze key components of the LLM lifecycle: pre-training, adaptation tuning, and utilization. They explore how LLMs acquire fundamental language skills during pre-training on massive text corpora, how these models are adapted to specific tasks and aligned with human preferences, and how various prompting strategies and augmentation techniques enhance their performance. The paper also discusses the major capacities that have emerged in LLMs, such as in-context learning, instruction following, and tool use, while highlighting significant challenges including factuality, safety, efficiency, and evaluation. This survey serves as a valuable resource for understanding the current state and future directions of large language models, offering extensive references and insights into this transformative AI technology.',
      created_at: '2023-05-21T11:15:00Z'
    },
    {
      id: 9,
      arxiv_id: '2302.07842',
      title: 'Scaling Up to Excellence: Practicing Retrieval-Augmented Generation',
      authors: 'Fantine Huot, Barlas Oğuz, Oznur Alkan, Joshua Maynez, Parvez Ahammad, Sumit Sanghai',
      summary: 'Research on improving LLMs through retrieval-augmented generation (RAG)',
      published_date: '2023-02-15',
      url: 'https://arxiv.org/abs/2302.07842',
      detailed_info: 'This paper explores retrieval-augmented generation (RAG) for large language models, offering an in-depth analysis of how to effectively combine external knowledge retrieval with language model generation to improve accuracy, reduce hallucinations, and enable up-to-date information access. The researchers investigate various critical design choices in building RAG systems, including the construction of document stores, retrieval methods, and how to effectively integrate retrieved information into the generation process. Their experiments reveal insights about index construction strategies, chunking methods, and the impact of different fusion algorithms on the quality of generations. The study demonstrates that carefully designed RAG systems can significantly enhance language model performance on knowledge-intensive tasks, even when compared to much larger models without retrieval augmentation. The paper also discusses practical trade-offs in real-world deployments, such as latency considerations and the relationship between model size and retrieval effectiveness.',
      created_at: '2023-05-21T11:20:00Z'
    },
    {
      id: 10,
      arxiv_id: '2201.11903',
      title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
      authors: 'Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed Chi, Quoc Le, Denny Zhou',
      summary: 'Introduces chain-of-thought prompting to improve LLM reasoning capabilities',
      published_date: '2022-01-28',
      url: 'https://arxiv.org/abs/2201.11903',
      detailed_info: "This influential paper introduces chain-of-thought (CoT) prompting, a technique that dramatically improves the reasoning capabilities of large language models by prompting them to generate intermediate reasoning steps before producing an answer. The researchers demonstrate that by providing examples where the model shows its work step-by-step (similar to how humans solve complex problems), language models can better tackle tasks requiring multi-step reasoning, such as arithmetic word problems, commonsense reasoning, and symbolic manipulation. The paper shows that this capability emerges primarily in models above a certain scale (around 100B parameters), suggesting it's an emergent property of model scaling. The approach requires no additional training or fine-tuning, making it a purely prompt-based method to enhance reasoning. Chain-of-thought prompting has become a fundamental technique in the field, inspiring numerous follow-up works on zero-shot CoT, self-consistency, and various other prompting strategies designed to improve reasoning in large language models.",
      created_at: '2023-05-21T11:25:00Z'
    },
    {
      id: 11,
      arxiv_id: '2307.09288',
      title: 'Llama 2: Open Foundation and Fine-Tuned Chat Models',
      authors: 'Hugo Touvron, Louis Martin, Kevin Stone, Peter Albert, Amjad Almahairi, Yasmine Babaei, Nikolay Bashlykov, Soumya Batra, Prajjwal Bhargava, Shruti Bhosale, Dan Bikel, Lukas Blecher, Cristian Canton Ferrer, Moya Chen, Guillem Cucurull, David Esiobu, Jude Fernandes, Jeremy Fu, Wenyin Fu, Brian Fuller, Cynthia Gao, Vedanuj Goswami, Naman Goyal, Anthony Hartshorn, Saghar Hosseini, Rui Hou, Hakan Inan, Marcin Kardas, Viktor Kerkez, Madian Khabsa, Isabel Kloumann, Artem Korenev, Punit Singh Koura, Marie-Anne Lachaux, Thibaut Lavril, Jenya Lee, Diana Liskovich, Yinghai Lu, Yuning Mao, Xavier Martinet, Todor Mihaylov, Pushkar Mishra, Igor Molybog, Yixin Nie, Andrew Poulton, Jeremy Reizenstein, Rashi Rungta, Kalyan Saladi, Alan Schelten, Ruan Silva, Eric Michael Smith, Ranjan Subramanian, Xiaoqing Ellen Tan, Binh Tang, Ross Taylor, Adina Williams, Jian Xiang Kuan, Puxin Xu, Zheng Yan, Iliyan Zarov, Yuchen Zhang, Angela Fan, Melanie Kambadur, Sharan Narang, Aurelien Rodriguez, Robert Stojnic, Sergey Edunov, Thomas Scialom',
      summary: 'Meta\'s paper on the development of the open-source Llama 2 family of large language models',
      published_date: '2023-07-18',
      url: 'https://arxiv.org/abs/2307.09288',
      detailed_info: 'This paper describes Llama 2, a collection of open-source large language models released by Meta AI ranging from 7 to 70 billion parameters. The researchers detail the pretraining methodology, which uses 2 trillion tokens of data, and introduce their approach to fine-tuning for dialogue applications (Llama 2-Chat). The paper emphasizes Meta\'s focus on safety and responsible release, describing their human preference data collection for reinforcement learning from human feedback (RLHF), their safety fine-tuning process, and their red-teaming efforts to identify and mitigate harmful outputs. Comprehensive evaluations show that Llama 2-Chat models are competitive with other leading chat models on helpfulness benchmarks while demonstrating improved safety characteristics. The release represents a significant contribution to the open-source AI ecosystem, providing high-quality models under a permissive license that allows commercial use with certain restrictions. The paper includes extensive ablation studies and analyses of various design choices in the development process.',
      created_at: '2023-05-21T11:30:00Z'
    },
    {
      id: 12,
      arxiv_id: '2211.05100',
      title: 'Scaling Instruction-Finetuned Language Models',
      authors: 'Hyung Won Chung, Le Hou, Shayne Longpre, Barret Zoph, Yi Tay, William Fedus, Eric Li, Xuezhi Wang, Mostafa Dehghani, Siddhartha Brahma, Albert Webson, Shixiang Shane Gu, Zhuyun Dai, Mirac Suzgun, Xinyun Chen, Aakanksha Chowdhery, Sharan Narang, Gaurav Mishra, Adams Yu, Vincent Zhao, Yanping Huang, Andrew Dai, Hongkun Yu, Slav Petrov, Ed H. Chi, Jeff Dean, Jacob Devlin, Adam Roberts, Denny Zhou, Quoc V. Le, Jason Wei',
      summary: 'Google paper on scaling instruction-tuned models across model sizes and instruction datasets',
      published_date: '2022-11-28',
      url: 'https://arxiv.org/abs/2211.05100',
      detailed_info: 'This paper from Google Research presents a comprehensive study on scaling instruction-finetuned language models (FLAN models) across different dimensions: model size, number of tasks, and instruction templates. The researchers fine-tune a collection of language models ranging from 80 million to 540 billion parameters on up to 1,836 tasks expressed through various instruction formats. Their findings demonstrate several scaling benefits: performance improves with model size, number of tasks, and number of instruction templates, with improvements being most pronounced on unseen tasks and instruction formats, suggesting enhanced generalization. The study shows that instruction finetuning improves performance on a wide range of benchmarks, including reasoning, multilingual tasks, and extracting truthful information. Notably, the best FLAN-PaLM 540B model outperforms previous state-of-the-art results on 9 out of 11 evaluated benchmarks. The paper provides valuable insights into the factors that influence the effectiveness of instruction tuning and contributes to the understanding of how to create more general-purpose language models.',
      created_at: '2023-05-21T11:35:00Z'
    },
    {
      id: 13,
      arxiv_id: '2304.03442',
      title: 'Sparks of Artificial General Intelligence: Early experiments with GPT-4',
      authors: 'Sébastien Bubeck, Varun Chandrasekaran, Ronen Eldan, Johannes Gehrke, Eric Horvitz, Ece Kamar, Peter Lee, Yin Tat Lee, Yuanzhi Li, Scott Lundberg, Harsha Nori, Hamid Palangi, Marco Tulio Ribeiro, Yi Zhang',
      summary: 'Microsoft Research study examining GPT-4\'s capabilities and limitations',
      published_date: '2023-04-06',
      url: 'https://arxiv.org/abs/2304.03442',
      detailed_info: 'This paper by Microsoft Research presents an early analysis of GPT-4\'s capabilities, examining both its impressive abilities and important limitations. The researchers evaluate GPT-4 across a wide range of tasks, demonstrating its advanced reasoning in domains like mathematics, coding, vision, medicine, law, psychology, and more. They observe that GPT-4 exhibits emergent abilities not present in previous models, including sophisticated planning, hypothesis generation, and self-correction. The paper introduces the concept of "sparks" of Artificial General Intelligence (AGI), suggesting that while GPT-4 is not fully an AGI system, it displays several characteristics that point in that direction. The researchers also discuss GPT-4\'s limitations, including factual errors, reasoning flaws, susceptibility to jailbreaking, and difficulties with tasks requiring precise world models. The study offers insights into both the current capabilities of frontier AI systems and the research challenges that remain in developing more general, reliable AI systems.',
      created_at: '2023-05-21T11:40:00Z'
    },
    {
      id: 14,
      arxiv_id: '2308.08155',
      title: 'Leveraging Large Language Models for Scalable Vector Database Augmentation',
      authors: 'Masato Fujii, Takahiro Suzuki, Takayuki Nagai, Yushi Cao, Alexandre Rademaker, Nobuaki Minematsu, Paweł Mandera, Horanyi Jozsef, Ziheng Zeng, Prabhakar Gupta, Yonghyun Jeon, Yadollah Yaghoobzadeh, Karthik Raman',
      summary: 'Research on improving vector database quality using large language models',
      published_date: '2023-08-16',
      url: 'https://arxiv.org/abs/2308.08155',
      detailed_info: 'This paper explores how large language models (LLMs) can be used to enhance vector databases for retrieval augmented generation (RAG) systems. The researchers address common challenges in RAG implementations, including low-quality vector representations, poorly chunked documents, and inadequate metadata. They propose a framework that leverages LLMs to improve each component: by creating semantic embeddings through document summarization, by intelligently chunking documents based on semantic structure rather than fixed token counts, and by automatically generating rich metadata to facilitate more precise retrieval. The experimental results demonstrate significant improvements in retrieval quality across various domains compared to traditional approaches. The paper provides practical insights for implementing more effective RAG systems, making it particularly valuable for applications where the quality of retrieved information directly impacts the reliability of AI-generated responses. The techniques described are generally applicable across different domains and document types, offering a systematic approach to improving information retrieval in LLM-based systems.',
      created_at: '2023-05-21T11:45:00Z'
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